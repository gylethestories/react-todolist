// 内置http模块，提供了http服务器和客户端功能
var http = require("http");

// 内置文件处理模块
var fs = require("fs");

// 创建一个将流数据写入文件的WriteStream对象
var outstream = fs.createWriteStream("./list.html");

// 存储文章标题的数组
var titles = [];

// 请求参数JSON
var options = {
  hostname: "www.baidu.com", // 这里别加http://，否则会出现ENOTFOUND错误
  port: 80,
  path: "", // 子路径
  method: "GET",
};

// 请求并获得数据
var req = http.request(options, function (resp) {
  console.log("状态码resp.statusCode=" + resp.statusCode);
  console.log("响应头resp.headers=" + JSON.stringify(resp.headers));
  resp.setEncoding("utf8");

  resp.on("data", function (chunk) {
    console.log("响应内容:" + chunk);

    // 匹配链接的正则表达式
    var reg = /<a\s(?:\w*?=".*?"\s)*(?:href=")(.*?)(?:")(?:\s\w*?=".*?")*>(.+?)<\/a>/g;
    var res;
    while ((res = reg.exec(chunk)) != null) {
      //console.log("link="+res + '\n'); // 全部匹配的文字
      //console.log("href="+res[1] + '\n'); // 子匹配 链接
      //console.log("text="+res[2] + '\n'); // 子匹配 文字部分

      var href = res[1];
      var regHref = /http:[/][/]www.cnblogs.com[/]xiandedanteng[/]p[/](\d+).html/g;
      if (href.match(regHref)) {
        var text = res[2];
        console.log("text=" + text + "\n");
        titles.push(text);
      }
    }

    outstream.write(titles.join("\n"), "utf8");
    console.log("文件写入完毕。");
  });
});

// 超时处理
req.setTimeout(5000, function () {
  req.abort();
});

// 出错处理
req.on("error", function (err) {
  if (err.code == "ECONNRESET") {
    console.log("socket端口连接超时。");
  } else {
    console.log("请求发生错误，err.code:" + err.code);
  }
});

// 请求结束
req.end();
