const express = require('express');
const authMiddleware = require('../middlewares/authe');
const multer = require('multer');
const upload = require('../config/uploadMiddleware');
const fileModel = require('../model/files.model');
const path = require('path');
const fs = require('fs');


const router = express.Router();
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate a signed URL
const signedUrl = cloudinary.url('ar4mfdqyxl62vmztxn7j', {
  resource_type: 'raw',  // Ensure correct resource type (raw in your case)
  secure: true,           // HTTPS
  sign_url: true,         // Enable signed URL
  expiration: 15 * 60     // URL expiration time in seconds (15 minutes)
});

console.log(signedUrl);  // Output the signed URL



// Route to render home page
router.get('/home', authMiddleware, async (req, res) => {
  const userFiles = await fileModel.find({
    user: req.userId
  });
  console.log(userFiles);

  res.render('home', {
    files: userFiles
  });
});

// Route to upload files
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    // Ensure req.userId exists before attempting to insert data
    if (!req.userId) {
      return res.status(400).json({ error: "User ID missing from request" });
    }

    // Upload file to Cloudinary as a 'raw' file (non-image)
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      type: "upload", // Change from 'authenticated' to 'upload'
    });    

    // Create file record in database
    const newFile = await fileModel.create({
      path: result.secure_url,
      originalname: req.file.originalname,
      public_id: result.public_id,  // Store public_id for downloading later
      user: req.userId
    });
    

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      file: newFile
    });

  } catch (error) {
    console.error(" Database Insert Error:", error);
    res.status(500).json({ error: 'Database insert failed', message: error.message });
  }
});


// Route to download a file
router.get('/download/:fileId', async (req, res) => {
  try {
    // Fetch file info from MongoDB
    const file = await fileModel.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found in database' });
    }

    // Cloudinary stores files using a URL
    const cloudinaryUrl = file.path; // Assuming 'path' stores Cloudinary URL

    if (!cloudinaryUrl) {
      return res.status(400).json({ error: 'Cloudinary URL not found' });
    }

    // Redirect user to Cloudinary URL to download the file
    res.redirect(cloudinaryUrl);

  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;