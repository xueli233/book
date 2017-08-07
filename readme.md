## mongodb,superagent,superagent-charset,express,cheerio 爬虫
## 文件系统
- models
> title.js
- book模型
  ```
  { 
    id:number,
    fmimg:string,
    title:array,
    content:array 
  }
  ```
- routes
  - title.js
- config.js
- server.js
### https模块-取得数据
- 问题1: `https`只能请求`https`网,且请求的数据,只能设置`utf-8`编码,无法设置`gbk`
  - 考虑使用`superagent`模块
- 问题2: 抓取到的文章链接,没有前缀
  - 方法一: 拼接上url,会造成`book/8634`重复;方法二:配置一个专用的网站`prefix`前缀
- 问题3: `superagent`爬取到的数据,无法赋值给全局变量,需要取得数据后,使用`async.mapLimit(arr,5,fn,fn)`,第一项arr链接都执行,5表示同时执行的个数
- 问题4: 爬回来的数据`text()`是中文,但是不好操作数据;`html()`是16进制数;
- 问题5: 数据重复保存,抓数据前行进行判断,本地是否已存在数据;
### mongoose 模块
- 引入
```
const mongoose = require('mongoose');
```
- 连接数据库
```angular2html
let port = process.env.PORT || 8080;
let config = require('../config'); //数据库地址
mongoose.connect(config.database);
```
- new一个Schema
```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Book', new Schema({
  id: Number,
  fmImg: String,
  data:{
    title: Array,
    content: Array,
  },
}));

```
- new一个book对象
```
let book = new Book({
  id,
  fmImg,
  data: {
    title,
    content,
  }
});

```
- 保存数据库
```
book.save( err =>{
  if(err) throw err;
  else return response;
});

```
- 查询数据库
```
Book.findOne({
  id: id
}, function(err, user) {}
```

## 


