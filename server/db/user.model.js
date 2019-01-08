const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    registrationWizard: {type: String, required: false},
    company_name: {type: String, required: false},
    job_title: {type: String, required: false},
    country: {type: String, require: false},
    postal_code: {type: String, required: false},
    avatar: {type: String, required: false},
    primium: {type: Boolean, required: false},
    industry: {type: String, required: false}
}, { timestamps: true });

UserSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.password;
    return obj;
   }

module.exports = mongoose.model('linkedin-users', UserSchema);
