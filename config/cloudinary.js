const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const signedUrl = cloudinary.url('ar4mfdqyxl62vmztxn7j', {
  resource_type: 'raw',  // Ensure correct resource type (raw in your case)
  secure: true,           // HTTPS
  sign_url: true,         // Enable signed URL
  expiration: 15 * 60     // URL expiration time in seconds (15 minutes)
});

console.log(signedUrl);

module.exports = cloudinary;