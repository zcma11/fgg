const fs = require('fs')
const path = require('path')
const KoaRouter = require('koa-router')

const readList = (dir, load) => {
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

      router[method](route, cb)
    })
  })

  return router
}

const initController = () => {
  const dir = path.resolve(process.cwd(), 'controller')
  const controllers = {}
  readList(dir, (root, routeList) => {
    controllers[root] = routeList
  })

  return controllers
}

module.exports = {
  initRouter,
  initController
}
