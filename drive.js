const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const connectToDB=require('./config/db');
connectToDB();
const userRouter=require('./routes/user.routes')
const cookieparser=require('cookie-parser');
const indexRouter=require('./routes/index.routes');
app.set('view engine','ejs');
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:true}))
app.use('/', indexRouter);
app.use('/users', userRouter);


require('dotenv').config(); // Load environment variables
const cloudinary = require('cloudinary').v2;
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async function(){
    const result=await cloudinary.uploader.upload('b.png');
    console.log(result);
})


app.listen(process.env.PORT || 3000,()=> {
    console.log('the server is running in 3000 port');
})
