module.exports = {
  'get /': async app => {
    app.ctx.body = '首页'
  }
}
