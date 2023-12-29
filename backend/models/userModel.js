const mongoose = require("mongoose");
const bcrypt = require('bcryptjs') 

const userSchema = mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    password:{type:String,required:true},
    pic: {type:String,default:"https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"},
},{timestamps:true});

userSchema.methods.MatchPassword = async function(enteredpassword){
   return await bcrypt.compare(enteredpassword,this.password)
};

userSchema.pre('save',async function(next){
    if(!this.isModified){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})

const User = mongoose.model("User",userSchema);

module.exports = User;
