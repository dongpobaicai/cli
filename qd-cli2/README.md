# 项目结构

├─bin // 命令集合，一个命令对应一个文件
└─src // 工具类集合

## 准备工作

- 将工具支持命令，以[key:value]结构配置 package.json 的 bin 属性下

```js
  "bin": {
    "qd": "bin/qd.js",
    "qd-init": "bin/qd-init.js",
    "qd-list": "bin/qd-list.js",
    "qd-search": "bin/qd-search.js"
  }
```

- 通过`npm link`在全局的npm\node_modules目录下创建**qd-cli2**的引用文件，每次命令有更新，都会同步更新到这个引用文件下

## 命令解析

`"qd": "bin/qd"` 运行 qd 进行的命令行提示

- program.version() 设置当前版本，并输出版本号
- program.usage()

`"qd-list": "bin/qd-list.js"` 查看当前可使用的项目模板

- `fetchTemplates` 获取模板数据
- 特殊展示模板列表

`"qd-search": "bin/qd-search.js"` 根据名称搜索项目模板

`"qd init webpack1 webpack-demo1"` 根据模板文件，快速生成项目

- `webpack1` 模板项目名称
- `webpack-demo1` 当前本地项目名称