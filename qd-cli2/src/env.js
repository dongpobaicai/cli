// 环境变量配置

const template_list = [
  {
    name: "webpack-demo1",
    description: "webpack模板一",
    type: "github",
    web_url: "github:dongpobaicai/webpack-demo",
    created_at: "2021/11/30 12:00:00",
    pushed_at: "2021/11/30 14:30:00",
  },
  {
    name: "webpack-demo2",
    description: "webpack模板二",
    type: "github",
    web_url: "github:dongpobaicai/webpack-demo",
    created_at: "2021/11/30 12:00:00",
    pushed_at: "2021/11/30 14:30:00",
  },
];
const moduleNameMap = {
  webpack1: template_list[0],
  webpack2: template_list[1],
};
module.exports = {
  moduleNameMap: moduleNameMap,
};
