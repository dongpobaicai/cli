### 创建自定义命令
在package.json里面添加如下代码
```js
{
  bin: {
    qd-cli: './index'
  }
}
```
执行npm link，将当前命令加入到全局环境

### 常见的命令参数
pull 拉下代码
publish 一键发布