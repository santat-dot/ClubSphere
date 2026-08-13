const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary-v2');

cloudinary.config({
    cloud_name : process.env.Cloud_Name,
    api_key : process.env.API_Key,
    api_secret : process.env.API_Secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cloudSphere',
        allowed_formats: ["png","jpeg","jpg","webp", "svg", "avif", "apng"], 
    
    },
});


module.exports = {
    cloudinary,
    storage
}