const mongoose = require("mongoose")

// if (process.argv.length<3) {
//   console.log("give password as argument")
//   process.exit(1)
// }

// const password = process.argv[2]

const url = process.env.MONGODB_URI

console.log("connecting to ", url)

mongoose.connect(url)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "name missing"],
    unique: true
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, "number missing"],
    validate: {
      validator: function(v) {
        // allow only xx-* or xxx-* where x is one number and * is 1 or more numbers
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phonenumber!`
    }
  }
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)