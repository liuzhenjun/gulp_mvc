/*
* author: lzj
* data: 20210518
* 跟后台打交道的api都封装在此
*/
define(['jquery'], function ($) {
  return {
    getUser: function (cb) {
      // 发送ajax请求，后台返回数据后，调用cb函数。
      $.ajax({
        url: '/api/course',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: cb
      });
    }
  };
});
