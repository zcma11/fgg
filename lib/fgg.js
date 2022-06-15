const Koa = require('koa')
const { initRouter, initController } = require('./fgg-loader')

class Fgg {
  constructor(config) {
    const app = (this.$app = new Koa(config))
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
