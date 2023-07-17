const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var crypto  = require('crypto');


const userSchema =  new Schema({
    user_name: {
        type: String,
        required: true,
        unique: true,
    },
    user_pass: {
        type: String,
        required: true,
    },
    user_hobby: {
        type: String,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        required: false
    },
    hash : String, 
    salt : String 
}, { timestamps: true });

 
// Method to set salt and hash the password for a user 
userSchema.methods.setPassword = function(password) { 
    
// Creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex'); 
    
    // Hashing user's salt and password with 1000 iterations, 
    
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}; 
    
// Method to check the entered password is correct or not 
userSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 
    
// Exporting module to allow it to be imported in other files 
const User = module.exports = mongoose.model('User', userSchema); 