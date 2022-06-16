module.exports = app => ({
  async getName() {
    return await app.$model.user.findAll()
  },
  async getAge() {
    return 123
  }
})
