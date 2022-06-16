const Koa = require('koa')
const {
  initRouter,
  initController,
  initServices,
  initDatabase
} = require('./fgg-loader')

class Fgg {
  constructor(config) {
    const app = (this.$app = new Koa(config))
    initDatabase(this)
    this.$service = initServices(this)
    this.$ctrl = initController()
    this.$router = initRouter(this)
    app.use(this.$router.routes())
  }

  start(port) {
    this.$app.listen(port, () => {
      console.log(`service at ${port}`)
    })
  }
}

module.exports = Fgg
