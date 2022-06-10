const locateRouter = require('./locate')
const userRouter = require('./user')

function route(app) {

    app.use('/locate', locateRouter)

    app.use('/user', userRouter)
}

module.exports = route