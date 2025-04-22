# Event Management API

A robust backend API for managing events, including user authentication, event creation, updates, status management, and file uploads.

## Overview

This Event Management API allows users to register, create events, update event details, upload event banners, and manage participants. The system includes automated event status updates and reminder notifications.

🔗 Live Demo: [https://event-970g.onrender.com](https://event-970g.onrender.com)

## Features

- **User Authentication**
  - Secure registration and login with JWT token-based authentication
  - Protected routes for authorized actions

- **Event Management**
  - Create, read, update, and delete events
  - Automatic event status tracking (upcoming → ongoing → completed)
  - Event reminders and notifications
  - User authorization checks (only creators can edit their events)

- **File Management**
  - Upload event banner images (JPEG/PNG)
  - 2MB file size limit with type validation
  - Static file serving

- **Automated Background Tasks**
  - Event reminder notifications (5 minutes before start)
  - Automatic status updates based on event times
  - Periodic system maintenance

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer
- **Scheduling**: Node-cron
- **Security**: bcryptjs for password hashing

## Project Structure

```
event-management-api/
├── config/
│   └── db.js               # Database connection
├── controllers/
│   ├── authControllers.js  # User authentication logic
│   └── eventControllers.js # Event management logic
├── middleware/
│   ├── authValidator.js    # JWT validation
│   ├── errorHandler.js     # Global error handling
│   └── logger.js           # Request logging
├── model/
│   ├── Event.js            # Event schema and model
│   └── User.js             # User schema and model
├── route/
│   ├── authRoutes.js       # Authentication routes
│   └── eventRoutes.js      # Event management routes
├── uploads/                # Banner image storage
├── utils/
│   └── cronJobs.js         # Scheduled tasks
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
└── server.js               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/event-management-api.git
cd event-management-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```
MONGO_URI=mongodb+srv://your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
PORT=5000
```

4. **Create uploads directory**
```bash
mkdir uploads
```

5. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000` (or the PORT you specified).

## API Documentation

### Authentication

#### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "pass": "securepassword123"
}
```
- **Success Response**: `200 OK`
```json
{
  "message": "Registration successful"
}
```

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "pass": "securepassword123"
}
```
- **Success Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Events

#### Create Event
- **URL**: `/events`
- **Method**: `POST`
- **Auth**: Required (Bearer Token)
- **Body**:
```json
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "location": "Convention Center",
  "startTime": "2025-05-15T09:00:00Z",
  "endTime": "2025-05-15T17:00:00Z",
  "maxParticipants": 200,
  "isPublished": true
}
```
- **Success Response**: `201 Created`

#### Get All Events
- **URL**: `/events`
- **Method**: `GET`
- **Auth**: Not required
- **Success Response**: `200 OK`
```json
[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "location": "Convention Center",
    "startTime": "2025-05-15T09:00:00Z",
    "endTime": "2025-05-15T17:00:00Z",
    "createdBy": "60d21b1c67d0d8992e610c84",
    "status": "upcoming",
    "maxParticipants": 200,
    "isPublished": true,
    "participants": [],
    "createdAt": "2025-04-20T12:00:00Z",
    "updatedAt": "2025-04-20T12:00:00Z"
  }
]
```

#### Get Event by ID
- **URL**: `/events/:id`
- **Method**: `GET`
- **Auth**: Not required
- **Success Response**: `200 OK`
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "location": "Convention Center",
  "startTime": "2025-05-15T09:00:00Z",
  "endTime": "2025-05-15T17:00:00Z",
  "createdBy": "60d21b1c67d0d8992e610c84",
  "status": "upcoming",
  "maxParticipants": 200,
  "isPublished": true,
  "participants": [],
  "createdAt": "2025-04-20T12:00:00Z",
  "updatedAt": "2025-04-20T12:00:00Z"
}
```

#### Update Event
- **URL**: `/events/:id`
- **Method**: `PUT`
- **Auth**: Required (Bearer Token, must be creator)
- **Body**:
```json
{
  "title": "Updated Tech Conference 2025",
  "description": "Updated description"
}
```
- **Success Response**: `200 OK`

#### Delete Event
- **URL**: `/events/:id`
- **Method**: `DELETE`
- **Auth**: Required (Bearer Token, must be creator)
- **Success Response**: `200 OK`
```json
{
  "message": "Event deleted"
}
```

#### Upload Event Banner
- **URL**: `/events/:id/upload`
- **Method**: `POST`
- **Auth**: Required (Bearer Token, must be creator)
- **Body**: Form-data with key `banner` and file value
- **File Requirements**: JPEG/PNG, max 2MB
- **Success Response**: `200 OK`
```json
{
  "message": "Upload successful",
  "bannerUrl": "/uploads/1619812345678-image.jpg"
}
```

## Event Status Lifecycle

Events in the system follow a lifecycle:

1. **Upcoming**: After creation until the start time
2. **Ongoing**: Between start time and end time
3. **Completed**: After end time

The system automatically updates these statuses via a cron job that runs every 10 minutes.

## Automated Background Tasks

1. **Event Reminders**:
   - Runs every minute
   - Identifies events starting in the next 5 minutes
   - Logs reminders (can be extended to email/SMS notifications)

2. **Status Updater**:
   - Runs every 10 minutes
   - Updates event statuses based on current time
   - Transitions events from upcoming → ongoing → completed

## Error Handling

The API uses standard HTTP status codes for error responses:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Valid authentication but insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## Testing with cURL

### Register User
```bash
curl -X POST https://event-970g.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User", "email":"test@example.com", "pass":"password123"}'
```

### Login
```bash
curl -X POST https://event-970g.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "pass":"password123"}'
```

### Create Event
```bash
curl -X POST https://event-970g.onrender.com/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"New Event", "description":"Event description", "location":"Virtual", "startTime":"2025-05-01T10:00:00Z", "endTime":"2025-05-01T12:00:00Z", "maxParticipants":50, "isPublished":true}'
```

### Get Events
```bash
curl -X GET https://event-970g.onrender.com/events
```

### Upload Banner
```bash
curl -X POST https://event-970g.onrender.com/events/EVENT_ID/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "banner=@/path/to/your/image.jpg"
```

## File Upload Troubleshooting

If you encounter issues with file uploads:

1. Ensure the file is a valid JPEG or PNG
2. Check that the file size is under 2MB
3. Use the correct field name (`banner`) in your form-data
4. Verify your JWT token is valid and included in the Authorization header
5. Confirm that the `/uploads` directory exists with proper write permissions


## Contact

For questions or support, please create an issue in the GitHub repository.
