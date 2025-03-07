const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {type: String, minLength: 3, required: true, unique: true},
  name: String,
  passwordHash: {type: String, required: true}, // min password length 3 checked by controller
  blogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)