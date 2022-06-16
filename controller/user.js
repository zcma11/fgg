module.exports = {
  index: async app => {
    app.ctx.body = '用户首页' + (await app.$service.user.getName())
  },
  detail: async app => {
    app.ctx.body = '用户详情' + (await app.$service.user.getAge())
  }
}
