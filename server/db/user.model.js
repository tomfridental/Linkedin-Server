const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: [true, 'first_name really importent!!'] },
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

// UserSchema.pre('save', async function(next){
//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })
  
// UserSchema.methods.is_valid_password = async function(password){
//     return await bcrypt.compare(password, this.password)
// }

module.exports = mongoose.model('Linkedin-Users', UserSchema);
