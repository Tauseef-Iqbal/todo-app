const authDtos = {
  signUpDto: {
    username: { type: 'string', required: true, isEmpty: false },
    email: { type: 'string', required: true, isEmpty: false },
    password: { type: 'string', required: true, isEmpty: false },
  },
  loginDto: {
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
  },
}

module.exports = authDtos
