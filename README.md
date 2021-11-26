# 打包部署相关内容

## vue-cli2 + webpack 配置详解 大致项目结构

├─qd-cli
└─vue-cli2
├─build // 打包代码
└─config // 环境配置

### 打线上包 `node build/build.js`

```js
// 项目node，npm检测
require("./check-versions")();
// 设置当前环境变量
process.env.NODE_ENV = "production";

rm(
  path.join(config.build.assetsRoot, config.build.assetsSubDirectory),
  (err) => {
    // 删除打包目录下的静态资源
    if (err) throw err;
    webpack(webpackConfig, function (err, stats) {
      // 执行webpack  并打印stats
    });
  }
);
```

### 线上配置文件 `webpack.prod.conf.js`

```js
export default {
  // 对css的提取出一个单独文件，减少打包次数
  styleLoaders: function () {
    // 针对每一种情况处理
    var cssLoader = {
      loader: "css-loader",
      options: {
        minimize: process.env.NODE_ENV === "production", // 是否压缩
        sourceMap: options.sourceMap, // 是否开启sourceMap
      },
    };

    function generateLoaders() {
      // 执行顺序从右到左，依次
      // 提取 css-loader less-loader / sass-loader
      // 不提取 vue-style-loader  css-loader  less-loader / sass-loader
      // vue-style-loader  将css以style标签方式，插入到html中
    }
    return {
      css: generateLoaders(),
      postcss: generateLoaders(),
      less: generateLoaders("less"),
      sass: generateLoaders("sass", { indentedSyntax: true }),
      // scss: generateLoaders('sass'),
      scss: generateLoaders("sass").concat({
        loader: "sass-resources-loader", // 可以在所有的scss文件或者vue文件运用全局的scss
        options: {
          resources: path.resolve(
            __dirname,
            "../src/assets/sass/variables.scss"
          ), //这里按照你的文件路径填写
        },
      }),
      stylus: generateLoaders("stylus"),
      styl: generateLoaders("stylus"),
    };
  },
};
```

```js
// 基本配置提取出来
var baseWebpackConfig = {
  entry: "./src/main.js", // 入口文件
  output: {}, // 打包目录，publich路径，输出文件名
  resolve: {}, // 快捷文件目录缩写
  module: {}, // 将各种资源转化为js的loader
};
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
    }),
  },
  devtool: false, // 线上环境关闭调试工具
  output: {}, // 和baseConfig进行合并
  externals: { // 全局变量配置，通过cdn引入
    vue: "vue",
  }, 
  plugins: [  // js压缩 css提取 css 压缩
    new webpack.DefinePlugin({  // 环境变量预设值，防止读取时为空
      "process.env": env,
    }),
  ], 
});
```

## qd-cli 自定义脚手架

## 脚手架安装，目前支持两种方式

### 本地代码直接关联

1. 在脚手架目录下，执行 `npm install`
2. 创建自定义命令， 在 package.json 里面添加如下代码

```js
{
  bin: {
    qd-cli: './index'
  }
}
```

3. 安装好执行 `npm link`，将当前命令加入到全局环境
4. 接着可以执行命令，比如在项目目录下运行 `qd-cli publish`

### 全局安装 npm 包

## 目前可运行脚手架

- qd-cli
