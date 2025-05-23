const express = require('express');
const multer = require('multer');
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent, uploadBanner } = require('../controllers/eventControllers');
const authValidator = require('../middleware/authValidator');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });
  
  const fileFilter = (req, file, cb) => {
    console.log('File MIME type:', file.mimetype);
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed'));
    }
  };
  
  const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB limit
    }
  });
  
  

router.post('/', authValidator, createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', authValidator, updateEvent);
router.delete('/:id',authValidator, deleteEvent);
router.post('/:id/upload', authValidator, upload.single('banner'), uploadBanner);

module.exports = router;
