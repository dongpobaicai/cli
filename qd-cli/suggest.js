var helloSuggest = function() {
  console.log('欢迎您使用清大视光一键打包发布工具')
}
var buildSuggest = function() {
  console.log('正在打包中')
}
var buildSuccess = function() {
  console.log('打包成功撒花')
}
module.exports = {
  helloSuggest,
  buildSuggest,
  buildSuccess
}