const fs = require('fs')
const path = require('path')
const KoaRouter = require('koa-router')
const { Sequelize } = require('sequelize')
const schedule = require('node-schedule')

const readList = (dir, load) => {
  if (!fs.existsSync(dir)) return
  const files = fs.readdirSync(dir)
  files.forEach(filename => {
    const file = path.resolve(dir, filename)
    if (fs.lstatSync(file).isFile()) {
      const routeList = require(file)
      const root = filename.replace('.js', '').toLowerCase()

      load(root, routeList)
    }
  })
}

const initRouter = app => {
  const router = new KoaRouter()
  const dir = path.resolve(process.cwd(), 'routes')

  readList(dir, (root, routeList) => {
    routeList = typeof routeList === 'function' ? routeList(app) : routeList

    Object.keys(routeList).forEach(route => {
      const cb = routeList[route]
      const [method, rule] = route.split(' ')
      // /index
      route = root === 'index' ? rule : '/' + root + (rule === '/' ? '' : rule)
      console.log(`正在映射 [${method}] ${route}`)

      router[method](route, async ctx => {
        app.ctx = ctx
        await cb(app)
      })
    })
  })

  return router
}

const initController = () => {
  const dir = path.resolve(process.cwd(), 'controller')
  const controllers = {}
  readList(dir, (root, controller) => {
    controllers[root] = controller
  })

  return controllers
}

const initServices = app => {
  const services = {}
  const dir = path.resolve(process.cwd(), 'services')
  readList(dir, (root, service) => {
    services[root] = service(app)
  })

  return services
}

const loadConfig = app => {
  const dir = path.resolve(process.cwd(), 'config')
  readList(dir, (_, config) => {
    app.$db = new Sequelize(config.db)
    app.$model = {}
    const modelDir = path.resolve(process.cwd(), 'model')
    readList(modelDir, (modelName, { schema, options }) => {
      app.$model[modelName] = app.$db.define(modelName, schema, options)
    })

    const middleware = config.middleware
    middleware.forEach(m => {
      app.$app.use(require(path.resolve(process.cwd(), 'middleware', m)))
    })

    app.$db.sync()
  })
}

const initSchedule = () => {
  const dir = path.resolve(process.cwd(), 'schedule')
  readList(dir, (name, { interval, handler }) => {
    schedule.scheduleJob(name, interval, handler)
  })
}

module.exports = {
  initRouter,
  initController,
  initServices,
  loadConfig,
  initSchedule
}
