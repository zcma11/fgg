module.exports = app => ({
  'get /': app.$ctrl.user.index,
  'get /detail': app.$ctrl.user.detail
})
