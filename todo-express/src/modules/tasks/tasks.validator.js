const { validateAgainstSchema } = require('../../services/validation.services')
const { cloneJSON } = require('../../services/route.services')

const taskDtos = {
  createTaskDto: {
    title: { type: 'string', required: true, isEmpty: false },
    body: { type: 'string' },
    completed: { type: 'boolean' },
  },
  updateTaskDto: {
    title: { type: 'string', isEmpty: false },
    body: { type: 'string' },
    completed: { type: 'boolean' },
  },
}

async function validateIncomingData(req, res) {
  if (req.method === 'POST') {
    await validateCreate(req.body).catch((error) => {
      throw error
    })
  } else if (req.method === 'PUT') {
    await validateUpdate(req.body).catch((error) => {
      throw error
    })
  } else {
    throw new Error(`unknown validation action '${req.method}'`)
  }
}

async function validateCreate(body) {
  const createSchema = await cloneJSON(taskDtos.createTaskDto) // copy so we can modify safely
  validateAgainstSchema(body, createSchema)
}

async function validateUpdate(body) {
  const updateSchema = await cloneJSON(taskDtos.updateTaskDto) // copy so we can modify safely
  validateAgainstSchema(body, updateSchema)
}

module.exports = { validateIncomingData }
