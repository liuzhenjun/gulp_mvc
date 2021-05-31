// 一： 配置依赖的模块的路径
require.config({
  shim: {
    easyui: ['jquery'],
    easyuizc: ['jquery']
  },
  paths: {
    jquery: '/lib/jquery.min',
    api: '/js/service/api',
    tpl: '/js/template/template',
    easyui: '/lib/jquery-easyui-1.5.5.2/jquery.easyui.min',
    easyuizc: '/lib/jquery-easyui-1.5.5.2/locale/easyui-lang-zh_CN'
  }
});
// 二： 进行入口处理
require(['jquery', 'api', 'tpl', 'easyui', 'easyuizc'], function ($, api, tpl, easyui, easyuizc) {
  $(function () {
    $('#tt').on('click', function (e) {
      api.getUser(function (data) {
        var html = tpl('userlist', data);
        $('.box')
        .append(tpl('user/add','你好啊'))
        .append(html);
      });
    });

    $('#btn').on('click', function(e) {
      $('.dialog').dialog({title:'这是测试对话框！', width: 400, height: 400, modal: true, content: tpl('product/info', {title: '哈喽', list: ['laoma','laoliu']})});
    });
  });
});
