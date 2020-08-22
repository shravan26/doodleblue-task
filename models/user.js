const mongoose = require('mongoose');
const crypto = require('crypto');
const {v1: uuidv1} = require('uuid');
const {ObjectId} = mongoose.Schema;
const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxLength : 60,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    salt : String,
    encry_password : {
        type : String,
        required : true
    },
    tasks : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Task"
        }
    ],
    expired : {
        type : ObjectId,
        ref : "expired"
    }
},{timestamps:true})

//creating a virtual field where the encrypted password is set

userSchema.virtual('password')
.set(function(password){
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
})
.get(function() {
    return this._password;
})

userSchema.methods = {
    //Authentication function for the user
    authenticate : function(plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password
    },

    //Schema method to secure password using crypto
    securePassword : function(plainPassword) {
       if(!plainPassword) return "";
       try {
           return crypto.createHmac('sha256',this.salt)
           .update(plainPassword)
           .digest('hex');
       }
       catch(error){
           return  "";
       }
    }
}


module.exports = mongoose.model('User',userSchema);