module.exports = async (ctx, next) => {
  console.log('123')
  await next()
}