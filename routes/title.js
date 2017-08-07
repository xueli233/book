const http = require('http');
const Book = require('../models/title');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
//使用模块,可以解决gbk乱码
const superagent = require('superagent');
require('superagent-charset')(superagent);
const express = require('express');
const app = express();
//异步执行模块
const async = require('async');

const URL  = 'http://www.zwdu.com/book/8634/';
const URL_PREFIX = 'http://www.zwdu.com';

let port = process.env.PORT || 8080;
let config = require('../config');
mongoose.connect(config.database);
let id = 0;//计数

/**
 *  主函数
 * */
function main(url, res) {
  id =  url.match(/\d+/)[0];//使用正则,提取到书名id值
  //先判断,数据是否存在
  Book.findOne({
    id: id
  }, function(err, user) {
    //如果错误,抛出
    if (err) throw err;
    //如果存在,返回
    if (user)return res.json({success:false,message:'数据已存在'});
    fetchChaper(url,res);
  });
}
/**
 * 获取章节
 * */
function fetchChaper(url, response) {
  superagent.get(url)
    .charset('gbk')
    .end((err, res) => {
      let $ = cheerio.load(res.text);
      let urls = [];
      let title = [];
      let fmImg = $('#fmimg img').attr('src');
      $('#list dd').each((i, v) => {
        if (i < chapters) {
          title.push($(v).find('a').text());
          urls.push(URL_PREFIX + $(v).find('a').attr('href'));
        }
      });
      //抓每个链接的内容
      async.mapLimit(urls, 5, (url, callback) => {
        fetchUrl(url, callback, id)
      }, (err, content) => {
        //保存数据库
        if (err) throw err;
        let book = new Book({
          id,
          fmImg,
          data: {
            title,
            content,
          }
        });
        book.save(err => {
          if (err) throw err;
          return response.json({success:true,message:'数据保存成功'});
        });
      });
  });
}
/**
 * 获取章节内容
 * */
const chapters  = 56;
function fetchUrl(url, callback,id) {
  superagent.get(url)
    .charset('gbk')
    .end((err, res)=>{
      if(err) throw err;
      let $ = cheerio.load(res.text)
      const arr = [];
      const content = $('#content').text();
      callback(null, content);
    })
}

//启动服务
app.get('/',(req,res)=>{
  main(URL,res);
})
//监听商品
app.listen(3378,()=>{
  console.log('server listening on 3378');
});