import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    audio: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav', 'audio/wave'],
    lyrics: ['text/plain'],
    cover: ['image/jpeg', 'image/png', 'image/webp'],
  };

  const fieldName = file.fieldname;
  const fileMime = file.mimetype;

  if (allowedMimes[fieldName] && allowedMimes[fieldName].includes(fileMime)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type for ${fieldName}. Expected: ${allowedMimes[fieldName]?.join(', ') || 'unknown'}`
      ),
      false
    );
  }
};

// Create multer instance with configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

export default upload;
