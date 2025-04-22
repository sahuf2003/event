# Event Management API

A backend API to manage events, including user registration, authentication, event creation, updates, and status management.

## Features

- **User Registration & Login**: Secure authentication with JWT tokens.
- **Event Management**: Create, read, update, and delete events.
- **Event Status**: Automatically update event statuses (upcoming, ongoing, completed).
- **Event Reminders**: Notifications for events starting soon.
- **File Uploads**: Upload event banners (JPEG/PNG) with size validation.

## Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/sahuf2003/event.git
    cd event
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory with the following environment variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```

4. **Start the server**:
    ```bash
    npm run dev
    ```

The server will be running on `http://localhost:5000`.

## Testing with cURL & Postman

### 1. **Register User**
- **POST** `/auth/register`
- **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```

- **cURL**:
    ```bash
    curl -X POST http://localhost:5000/auth/register -H "Content-Type: application/json" -d '{"name":"John Doe", "email":"john@example.com", "passwoed":"password123"}'
    ```

### 2. **Login User**
- **POST** `/auth/login`
- **Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```

- **cURL**:
    ```bash
    curl -X POST http://localhost:5000/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com", "passwoed":"password123"}'
    ```

- **Response**:
    ```json
    {
      "token": "your_jwt_token_here"
    }
    ```

### 3. **Create Event**
- **POST** `/events`
- **Headers**:
    - `Authorization: Bearer <JWT_TOKEN>`
- **Body**:
    ```json
    {
      "title": "Sample Event",
      "description": "Description of the event",
      "location": "Venue",
      "startTime": "2025-04-23T12:00:00Z",
      "endTime": "2025-04-23T14:00:00Z",
      "maxParticipants": 100,
    }
    ```

- **cURL**:
    ```bash
    curl -X POST http://localhost:5000/events -H "Content-Type: application/json" -H "Authorization: Bearer <JWT_TOKEN>" -d '{"title":"Sample Event", "description":"Description of the event", "location":"Venue", "startTime":"2025-04-23T12:00:00Z", "endTime":"2025-04-23T14:00:00Z", "maxParticipants":100, "isPublished":true}'
    ```

### 4. **Get Events**
- **GET** `/events`

- **cURL**:
    ```bash
    curl -X GET http://localhost:5000/events -H "Content-Type: application/json"
    ```

### 5. **Update Event**
- **PUT** `/events/:id`
- **Headers**:
    - `Authorization: Bearer <JWT_TOKEN>`
- **Body**:
    ```json
    {
      "title": "Updated Event",
      "location": "New Location"
    }
    ```

- **cURL**:
    ```bash
    curl -X PUT http://localhost:5000/events/<event_id> -H "Authorization: Bearer <JWT_TOKEN>" -H "Content-Type: application/json" -d '{"title":"Updated Event", "location":"New Location"}'
    ```

### 6. **Delete Event**
- **DELETE** `/events/:id`
- **Headers**:
    - `Authorization: Bearer <JWT_TOKEN>`

- **cURL**:
    ```bash
    curl -X DELETE http://localhost:5000/events/<event_id> -H "Authorization: Bearer <JWT_TOKEN>"
    ```

## Event Statuses

- **upcoming**: The event is scheduled but hasn't started yet.
- **ongoing**: The event is currently happening.
- **completed**: The event has finished.
- **cancelled**: The event was cancelled.

The system automatically updates the event status based on the event's start and end time. Events will be marked as `ongoing` when the current time falls between the `startTime` and `endTime`, and as `completed` once the `endTime` has passed.

## Error Handling

The API uses standard HTTP status codes for error responses:

- **400 Bad Request**: The request was invalid (e.g., missing required fields).
- **401 Unauthorized**: The user is not authenticated or the JWT token is invalid.
- **403 Forbidden**: The user doesn't have permission to perform the action.
- **404 Not Found**: The requested resource doesn't exist.
- **500 Internal Server Error**: An unexpected error occurred on the server.

### Sample Error Response:
```json
{
  "error": "Invalid token"
}
