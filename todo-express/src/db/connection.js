const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const DbInitializer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Database Connected Successfully!!!')
  } catch (error) {
    console.error('Error connecting to Database:', error.message)
    process.exit(1)
  }
}

module.exports = DbInitializer
