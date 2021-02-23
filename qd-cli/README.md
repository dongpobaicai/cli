
## 创建自定义命令

在 package.json 里面添加如下代码

```js
{
  bin: {
    qd-cli: './index'
  }
}
```

执行 npm link，将当前命令加入到全局环境

## 常见的命令参数

publish 一键发布


## 发布包步骤

1. npm login
2. npm publish
3. npm version patch (更新版本)