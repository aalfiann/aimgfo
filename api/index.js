'use strict'

const fastify = require('fastify')

function build () {
  const app = fastify({
    logger: true
  })

  app.get('/', async (req, res) => {
    return {status:'success',code:res.statusCode,message:'Welcome to API ImgFo.'}
  })

  app.post('/', async (req, res) => {
    // const { name = 'World' } = req.body.name
    // req.log.info({ name }, 'hello world!')
    // return `Hello ${name}!`
    const { body } = req
    return `Hello ${body.name}`
  })

  return app
}

module.exports = build