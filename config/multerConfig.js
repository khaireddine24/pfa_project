// config/multerConfig.js
import multer from 'multer';
import path from 'path';

// Set storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filter to only allow image files
const fileFilter = (req, file, cb) => {
    console.log(`Received file: ${file.originalname}`);
    console.log(`MIME type: ${file.mimetype}`);
    console.log(`File extension: ${path.extname(file.originalname)}`);
    
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  };
  
// Configure multer with limits and other settings
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit for file size
    fieldSize: 10 * 1024 * 1024, // 10 MB limit for field size
  }
});

export default upload;
