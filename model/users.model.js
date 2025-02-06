const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minlength:[3,"user must be at least 3 characters"],
        maxlength:20,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        minlength:[13,"email most containt 13 characters long"]
    }
    ,password:{
        type:String,
        required:true,
        minlength:[8,"password must be at least 8 characters long"]
    }
    
})
const user=mongoose.model('User',userSchema);
module.exports=user;