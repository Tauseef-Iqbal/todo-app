const app = require('./src/app')
const DbInitializer = require('./src/db/connection')
require('dotenv').config()

const PORT = process.env.EXPRESS_PORT

async function startup() {
  try {
    app.listen(PORT, () => {
      console.log(`Starting TODO App on port ${PORT}...`)
      console.log(new Date().toLocaleString())
    })

    // connect the mongodb database
    await DbInitializer()
  } catch (error) {
    console.log('Startup failed!')
    console.log(error)
  }
}

startup()
