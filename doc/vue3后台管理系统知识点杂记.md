# 后台管理系统杂记

## 项目规划

![内容](.\images\2.png)

![image-20210710225931995](.\images\3.png)

![image-20210710225941747](.\images\4.png)

![image-20210710230047290](.\images\5.png)

![image-20210710230142884](.\images\6.png)

![image-20210710231358055](.\images\7.png)

![image-20210710231439285](.\images\8.png)

![image-20210710231613499](.\images\9.png)

![image-20230130144514685](.\images\10.png)

![image-20230130144932304](.\images\11.png)

![image-20210711101054603](.\images\12.png)

![image-20230208145637286](.\images\13.png)



## 前端架构设计(managerSysterm)

### 创建项目

`yarn create @vite/app 项目名称`

### 安装依赖

![image-20210711112019775](.\images\14.png)

![image-20210711113601766](.\images\15.png)

![image-20210711163318578](.\images\16.png)

### 环境变量配置

`const env=import.meta.env.MODE || 'production'`得到当前环境 production 或者dev test

![image-20230131094214747](.\images\17.png)

可以通过.env.dev文件更改名称

![image-20230131091407413](.\images\18.png)

### 路由配置

![image-20230131092324632](.\images\19.png)

![image-20230131111436525](.\images\20.png)

![image-20230131093542863](.\images\21.png)

#### 路由跳转的三种方式

router-link

```html
<router-link to="/login">去登录</router-link>
```

传统跳转

```js
<template>
	<el-button @click="goHome">回首页</el-button>
</template>

<script>
export default{
	name:'login',
  methods:{
    goHome(){
      this.$router.push('/welcome')
    }
  }
}
</script>
```

Composition API跳转

```js
<script setup>
import { useRouter } from 'vue-router'
let router = useRouter()
const goHome = ()=>{
  router.push('/welcome')
}
</script>
```

vite创建的项目 import必须带上文件后缀才能识别到

![image-20230131093915626](.\images\22.png)

### mock配置

- 可以用来解除测试对象对外部服务的依赖，使得测试用例可以独立运行
- 替换外部服务调用或一些速度较慢的操作，提升测试用例的运行速度
- 模拟异常逻辑，异常逻辑往往很难触发，通过Mock可以人为的控制触发异常逻辑

用[fastmock](https://www.fastmock.site/)模拟开发时的api，在[mock.js](http://mockjs.com/examples.html)查看示例规范，控制接口返回随机数据

![image-20230131095045878](.\images\23.png)

![image-20230131100115138](.\images\24.png)

![image-20230131100217475](.\images\25.png)

config里控制全局mock开关，可以在具体请求中设置mock开关

![image-20230131095109362](.\images\26.png)

![image-20230131095133236](.\images\27.png)

![image-20230201103318607](.\images\28.png)

### 请求封装

![image-20230131102625780](.\images\29.png)

![image-20230131103958670](.\images\30.png)

![image-20230131104258469](.\images\31.png)



全局挂载 main.js里 `app.config.globalProperties.$request = request`

api统一管理 `app.config.globalProperties.$api = api;`

![image-20230201093828730](.\images\32.png)

### storage封装

![image-20230131104614111](.\images\33.png)

### Vuex状态管理

![image-20230201094442345](.\images\34.png)

![image-20230201094457905](.\images\35.png)

![image-20230201094539923](.\images\36.png)

![image-20230201094605451](.\images\37.png)

### 关于架构师的知识延伸

#### 架构师作用

- 系统设计
- 技术布局
- 疑难问题攻克
- 前端规范制定
- 前端工程化实践
- 指导中高级工程师

#### 系统架构设计需要考虑哪些？

- 手动构建或基于Cli构建基础项目
- 提前设计好项目整体架构能力
  - 目录结构
  - 工具函数（后期随着业务复杂，不断添加）
  - 开发规范（Eslint）
  - 多套环境
  - Mock
  - Cookie/Storage/Axios等插件封装
  - 路由封装
  - 系统整体布局
- CodeReview流程
- Git提交规范
- VSCode配置规范
- 开发独有的脚手架
- 工程化（自动构建、自动部署CI/CD）
#### 业务方面需要考虑哪些？
  - 动态路由
  - 菜单、按钮权限、数据权限
  - 业务模块封装
  - 组件提取
  - UI框架设计
  - 数据埋点设计
  - 通用后台方案
  - H5架构方案
  - 小程序架构方案

## Koa架构设计（managerServer）

Koa是一门基于Node的后端框架

### 安装koa脚手架，开启koa服务器

```
cnpm install -g koa-generator 
# or 
yarn global add koa-generator 
```

`koa2 项目名`创建koa项目

`yarn install  yarn start` 开启服务，默认端口3000

![image-20230131145607725](.\images\38.png)

![image-20230131150558592](.\images\39.png)

路由说明：

![image-20230131150630408](.\images\40.png)

### 使用log4.js进行日志规范

类比于java里的log4.java 可以打印日志 方便日后排查

`yarn add log4js -D`安装

配置log4js

![image-20230131152332367](.\images\41.png)

![image-20230131152410633](.\images\42.png)

![image-20230131152515334](.\images\43.png)

### MongoDB数据库

[下载](https://www.mongodb.com/try/download/community)

![image-20210714155921035](.\images\44.png)

命令行输入`mongod --version`如果找不到就需要配置系统环境变量

如果没有db（表示数据存储的文件夹）目录，可以在data下面创建一个

bin 目录中打开 cmd 窗口输入  `mongod --dbpath=..\data\db`

以管理员身份打开cmd窗口 进入bin文件下输入

`mongod.exe --config "C:\Program Files\MongoDB\Server\5.0\bin\mongod.cfg" --install --serviceName "MongoDB"`

![image-20230131163612141](.\images\45.png)

将MongoDB 添加到系统服务中（服务的删除执行命令：sc delete MongoDB）

![image-20230131163744828](.\images\46.png)

检查 浏览器输入http://localhost:27017 返回字符串 则表明可以正常访问

### Mongo基础入门

![image-20210714162032514](.\images\47.png)

![image-20210714162101949](.\images\48.png)

下面的db.collection，collection指集合名字

![image-20210714165359085](.\images\49.png)

![image-20210714165427536](.\images\50.png)

![image-20210714165646195](.\images\51.png)

用可视化客户端操作也可以

![image-20230131165730797](.\images\52.png)

##### mongoose 连接数据库进行增删改查

![image-20230201100826602](.\images\53.png)

![image-20230201100850097](.\images\54.png)

![image-20230201100933179](.\images\55.png)

![image-20230201100955115](.\images\56.png)

![image-20230201101729202](.\images\57.png)

![image-20230201171155253](.\images\58.png)

### mongo语法

1. User.findOne() // 查询一条数据

2. User.find() // 查询所有符合条件的数据

3. User.find().skip().limit() // 专门用于数据分页

4. User.countDocuments({}) // 统计总数量

5. User.updateMany() // 更新用户信息

6. { userId: { $in: [100001,100002] } // 判断userId在[100001,100002]中间

7. { $or: [{ userName:‘jack’ }, { userEmail:‘jack@imooc.com’ }] } // 或 条件判断

8. { $inc: { sequence_value: 1 } // 更新值 +1

9. 根据ID查找并更新

   ```
   Menu.findByIdAndUpdate(_id, params)
   ```

10. 根据ID查找并删除

    ```
    Menu.findByIdAndRemove(_id)
    ```

11. 查找表中parentId包含[id]的数据，并批量删除

    ```
    Menu.deleteMany({ parentId: { $all: [_id] } })
    ```

`$all` 指的是表中某一列包含[id]的数据，例如：parentId:[1,3,5] 包含 [3]

`$in`指的是表中某一列在[id]这个数组中，例如：_id:3 在[1,3,5]中**Mongo返回字段的四种方式**

1. ‘userId userName userEmail state role deptId roleList’
2. { userId:1,_id:0 }
3. select(‘userId’)
4. select({ userId:1,_id:0 })

```js
User.findOne({ userName,userPwd }, 'userId userName userEmail state role deptId roleList')
// Or

User.findOne({ userName,userPwd }, { userId:1,_id:0 })

// Or
User.findOne({ userName,userPwd }).select('userId userName userEmail')

// Or
User.findOne({ userName,userPwd }).select({ userId:1,_id:0 })
```

### 接口文档设计

![image-20230131173439591](.\images\59.png)

### 工具函数封装

![image-20230131174733368](.\images\60.png)

![image-20230131174746725](.\images\61.png)

### Koa掌握

关键提炼：

1、基础语法大多跟JS语法一致，但是要了解Koa的特性，比如洋葱模型，接口请求

2、日志规范、MVC、Mongose集成

## 业务开发

（页面布局=>页面交互=>服务端接口=>接口联调）

### 用户登录

![image-20230201100629168](.\images\62.png)

#### 后台开发

routes\users.js

![image-20230201102253655](.\images\63.png)

![image-20230201102343912](.\images\64.png)

### 首页菜单

![image-20230201152912521](.\images\65.png)

### 用户管理

#### 查询

![image-20230202105832312](.\images\66.png)

#### 删除

![image-20230202114320289](.\images\67.png)

![image-20230202114452944](.\images\68.png)

![](.\images\69.png)

#### 编辑

![image-20230202150818126](.\images\70.png)

#### 新增

在mysql里可以直接去给一个组件设置为自动增长，但是mongodb数据库不可以 需要手动实现

新建一个counter集合 更新值

![image-20230202154925620](.\images\71.png)

#### md5

**安全性**

用户注册：密码基于md5摘要算法实现。也可基于其它算法（RSA或AES）再前端进行加密传输。

安全性保障措施：

1. 使用https协议，添加数字证书，确保信息安全
2. 使用加密算法，对重要信息进行加密处理。
   - 对称加密：DES、AES、RC5、RC6
   - 非对称加密：RSA、DSA
   - 摘要算法：md5（简单密码容易暴力破解）

**完善用户登录功能**

1. 登录和注册功能，对于加密信息保持一致。

### 菜单管理

渲染菜单树形结构

![image-20230203105424356](.\images\72.png)

![image-20230203105444510](.\images\73.png)

### RBAC权限模型

Role-Base-Access-Control

**用户**分配角色 -> **角色**分配权限 -> **权限**对应菜单、按钮

用户登录以后，根据对应角色，拉取用户的所有权限列表，对菜单、按钮进行动态渲染。

### 动态路由

![image-20230206114237576](.\images\74.png)

![image-20230206114302195](.\images\75.png)

### 工作流

![image-20230205161741858](.\images\76.png)

## 低代码

![image-20230208093645956](.\images\77.png)

![image-20230208093801677](.\images\78.png)



## JWT

拓展：

- 市面上常见的登录鉴权方案（淘宝、百度、抖音，微信、qq 等）
- 扫码登录的原理
- token 对比 cookie的优势、token 的缺点是什么？如何解决这个缺点？

---



是一种跨域认证解决方式，存在客户端，可以对多个服务器

session key做不到单点登录（对多个服务器），jwt token可以

### 原理

![image-20210717231112068](.\images\79.png)

![image-20210717231226431](.\images\80.png)

![image-20210717231305923](.\images\81.png)

![image-20210717231333845](.\images\82.png)

![image-20230201160101907](.\images\83.png)

![image-20230201160114062](.\images\84.png)

![image-20230201160141589](.\images\85.png)

![image-20210717231526157](.\images\86.png)

### 知识拓展—传统登录做法是如何记住用户身份信息

登录看似一个简单的功能，实际上随着业务的增多、公司规模扩大，对登录的要求会越来越高。过去在JSP/ASP/PHP时代，可能服务端写个session就搞定了，前端一个登录接口即可。但现在考虑到单点登录、身份加密、OAuth授权。

#### SessionID

http本身是无状态的，服务端和前端通信是互相不认识的，为了能够记住每个访问的用户身份，引入了Session概念，它是一张服务端缓存技术。当用户访问服务端时，服务端会生成一个SessionId作为唯一标识保存在内存中，并写入用户浏览器cookie中，当用户下次访问时，会携带这个cookie，服务端根据SessionId来判断用户身份。

#### Cookie

Cookie是前端浏览器的特性，跟Session有相似之处，但一般我们都不用SessionId作为唯一身份。当用户登录以后，服务端会返回一个userId作为用户唯一值，前端获取到登录信息后，可自行写入Cookie或者由服务端写入Cookie，下次访问页面时，可判断Cookie信息来识别用户身份，但是这种Cookie方式不安全。

#### JWT

JWT是一种综合技术方案，即能保证安全，又能使用简单，同时具有时效性，目前也是主流的技术方案。具体用法可参考本周总结部分。

#### OAuth

OAuth本身是一种单点登录协议，当公司体量大了以后，会存在很多业务系统，但是不可能每套系统都做一遍登录功能，因此可通过OAuth做登录授权，一次登录即可访问全战系统，最有名的当属微信的授权登录。大家访问公众号的时候，如果想要获取用户头像等信息就需要做微信登录授权，就是基于OAuth协议。

### jsonwebtoken库

服务器里安装 `yarn add jsonwebtoken -S`

时间如果是数字类型 单位默认是s，字符串类型 单位默认是ms，也可以直接写'2days' '10h' '7d'

![image-20210718084732503](.\images\87.png)

![image-20230201162220939](.\images\88.png)

### 步骤

服务器里安装 `yarn add jsonwebtoken -S`

login登录后服务器响应数据里加上token返回给客户端

![image-20230201162829072](.\images\89.png)

客户端之后的请求，请求拦截里设置，拿到获取的token，带着请求一起发送

![image-20230201163556735](.\images\90.png)

测试 服务器某个请求验证token

```js
//请求/leave/count，验证token
router.get('/leave/count', (ctx) => {
  console.log('=>', ctx.request.headers)
  const token = ctx.request.headers.authorization.split(' ')[1];
  // 验证token 'imooc'为之前设置的密钥
  const payload = jwt.verify(token, 'imooc')
  ctx.body = payload;
})
```

![image-20230201164232969](.\images\91.png)

### 续签思路

![image-20230201165203870](.\images\92.png)

### 中间件

服务器安装 `yarn add koa-jwt -S`

中间件：启动入口时提前去加载它

```js
//任何接口过来都会先校验token是否有效，unless里放白名单：不需要校验的请求
app.use(koajwt({ secret: 'imooc' }).unless({
  path: [/^\/api\/users\/login/]
}))
// logger
app.use(async (ctx, next) => {
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  // 所有中间件(上面bodyparser json logger都是中间件)经过next()进行串连起来 koajwt中间件验证过期后会抛出异常 catch可以捕捉到
  await next().catch((err) => {
    if (err.status == '401') {
      //token过期中间件会把状态码设为401
      ctx.status = 200;
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw err;
    }
  })
})
```

### res._doc

![image-20230203103500897](.\images\93.png)

## Vue3知识点

vue3不推荐挂载全局，因为Vue3没有this对象，但是提供了其它挂载方式

![image-20230201110242496](.\images\94.png)

![image-20230201110532874](.\images\95.png)

在vite.config.js里配置

![image-20230201153019437](.\images\96.png)

### setup两种语法

![image-20230201110344690](.\images\97.png)

![image-20230201110410182](.\images\98.png)

### element-plus

在main.js里可以控制element-plus组件的初始大小

`app.use(router).use(store).use(ElementPlus, { size: 'small' }).mount('#app')`

Element Plus 为 `app.config.globalProperties` 添加了全局方法 `$message`，因此在 vue 实例中可以使用当前页面中的调用方式调用 `Message`

![image-20230201220250097](.\images\99.png)

![image-20230201220311923](.\images\100.png)

### ref 和 reactive

ref定义的变量 后续.value的值去修改，reactive适合定义对象

```js
const showModal = ref(false)
showModal.value = true

// 普通类型建议用ref声明
//1. boolean/int
let showModal = ref(false);
showModal.value = true;

let applyList = ref([])
applyList.value = [{...}]
// 这种情况比较特殊，查询详情的时候，我们最好也用ref，因为我们要给详情直接赋值                    
let detail = ref({})
detail.value = {name:"jack"}
// 如果用reactive，必须这么写
let detail = reactive({})
detail.name = "jack"
// 下面这么写是错误的
detail = {name:"jack"} // 这种方式会覆盖响应式对象，切忌

//一般reactive用在表单中
let leaveForm = reactive({})
<el-form :model="leaveForm"></el-form>
```

### 全局对象

![image-20230202154723854](.\images\101.png)

![image-20230202154737042](.\images\102.png)

### 全局指令

![image-20230205222738265](.\images\103.png)

### v-model

![image-20230208100222552](.\images\104.png)

![image-20230208100341352](.\images\105.png)

![image-20230208100404909](.\images\106.png)

## 待完善点

- 按钮权限控制（目前只在user.vue中试水了下v-has的使用）
- 审批流业务 当管理层本人申请时情况

