//以下代码会执行在node环境下
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const cleanCss = require('gulp-clean-css');
const watch = require('gulp-watch');
const sourcemap = require('gulp-sourcemaps');
const rev = require('gulp-rev'); //加版本号
const imagemin = require('gulp-imagemin'); //图片压缩
const babel = require('gulp-babel'); //es6转换
const eslint = require('gulp-eslint'); //校验
const uglify = require('gulp-uglify'); //js压缩gulp-rev-collector
const revCollector = require('gulp-rev-collector'); //替换版本号gulp-rev-collector
const htmlmin = require('gulp-htmlmin'); //html压缩
const open = require('gulp-open'); //打开浏览器
const connect = require('gulp-connect'); //本地测试服务器
const proxy = require('http-proxy-middleware'); //本地测试服务器中间件
const modRewrite = require('connect-modrewrite'); //本地测试服务器中间件
const configRevReplace = require('gulp-requirejs-rev-replace'); //本地测试服务器
const tmodjs = require('gulp-tmodx'); // 将arttemparater转成js文件

gulp.task('html3', done => {
	console.log('gulp default task');
	done();
});

gulp.task('default', gulp.parallel('html3', done => {
	console.log('gulp test after');
	done();
}));

//把assets目录中的所有文件拷贝到dist目录
gulp.task('copyAssets', done => {
	gulp.src(['./src/assets/**/*.*', './src/lib/**'], {
    read: true,
    base: './src'
  })
	.pipe(gulp.dest('./dist/assets/'));

	// gulp.src(['./src/assets/**/*.*', './src/assets/**/*.*'], {
	// 		read: true,
 //      base: './src'
	// 	})
	// 	.pipe(gulp.dest('./dist/'));

	done();
});

var copyPathArr = ['./src/lib/**/*', './src/asset/**/*', './src/*.ico'];
gulp.task('copy', function(e) {
  return gulp.src(copyPathArr, { base: './src' }).pipe(gulp.dest('./dist/'));
});

/*
 * 1. scss文件进行编译 css文件
 * 2. css文件和scss编译后的代码合并到main.css文件中去
 * 3. css自动添加前缀css3
 * 4. css进行压缩
 * 5. 如果开发阶段，需要增加sourcemap
 * 5. 给最终的main.css文件添加版本号
 * npm install -g yarn
 * yarn add -D gulp-sass
 */
//开发环境用的
gulp.task('style:dev', done => {
	return gulp.src(['./src/styles/**/*.{css,scss}', '!./src/styles/main.css'])
		.pipe(sourcemap.init()) //init
		.pipe(sass().on('error', sass.logError)) //对请求流中scss进行编译css代码
		.pipe(autoprefixer({
			//browsers: ['last 2 versions'], //浏览器版本
			cascade: true, //美化属性，默认true
			add: true, //是否添加前缀，默认true
			remove: true, //删除过时前缀，默认true
			flexbox: true //为flexbox属性添加前缀，默认true
		}))
		.pipe(concat('main.css')) //css文件合并
		.pipe(cleanCss({
			//压缩css
			compatibility: 'ie8',
			//保留所有特殊前缀，当你使用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能会删除你的部分前缀
			keepSpecialComments: '*'
		}))
		.pipe(sourcemap.write())
		.pipe(gulp.dest('./src/styles'));

	done();
});

//最终部署到产品用的
gulp.task('style', done => {
	return gulp.src(['./src/styles/**/*.{css,scss}', '!./src/styles/main.css'])
		.pipe(sass().on('error', sass.logError)) //对请求流中scss进行编译css代码
		.pipe(autoprefixer({
			overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'], //浏览器版本
			cascade: true, //美化属性，默认true
			add: true, //是否添加前缀，默认true
			remove: true, //删除过时前缀，默认true
			flexbox: true //为flexbox属性添加前缀，默认true
		}))
		.pipe(concat('main.css')) //css文件合并
		.pipe(cleanCss({
			//压缩css
			compatibility: 'ie8',
			//保留所有特殊前缀，当你使用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能会删除你的部分前缀
			keepSpecialComments: '*'
		}))
		.pipe(rev())
		.pipe(gulp.dest('./dist/styles'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('src/styles'));

	done();
});

//照片压缩（如果执行有问题，用cnpm安装gulp-)
gulp.task('imageMin', done => {
	gulp.src('src/assets/*.{png,jpg,gif,ico}')
		.pipe(imagemin({
			optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
			multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
		}))
		.pipe(gulp.dest('dist/assets'));
	done();
});

//js处理
gulp.task('js', done => {
	//1. es6进行代码转换
	//2. eslint js代码进行格式化校验
	//3. js进行压缩
	//4. js要进行打版本号
	gulp.src(['src/js/**/*.js'])
		.pipe(eslint()) //进行校验
		// format（）将lint结果输出到控制台。
		// 或者使用eslint.formatEach（）（参见文档）。
		.pipe(eslint.format()) //错误消息进行格式化输出
		// 使进程退出时具有错误代码（1）
		// lint错误，最后将流和管道返回failAfterError。
		.pipe(eslint.failAfterError()) //如果校验失败，结束当前的任务
		.pipe(babel({
			presets: ['env']
		})) //babel
    .pipe(uglify())
    .pipe(rev())
		.pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('src/js/'));

	done();
});

//替换脚本
gulp.task('revjs', done => {
  gulp.src(['dist/js/**/*.js'])
  .pipe(configRevReplace({
    manifest: gulp.src('src/js/rev-manifest.json')
  }))
  .pipe(gulp.dest('dist/js/'));
  done();
});

// 替换目标html文件中的css版本文件名，js版本的文件名,html 压缩
gulp.task('html', done => {
  gulp
    .src(['./src/**/*.json', './src/**/*.html', '!./src/template/**']) // - 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(revCollector({ replaceReved: true })) // - 执行html文件内css文件名的替换和js文件名替换
    .pipe(
      htmlmin({
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        // collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
      })
    )
    .pipe(gulp.dest('./dist/')); // - 替换后的文件输出的目录

    done();
});

// 配置测试服务器
gulp.task('devServer', done => {
  connect.server({
    root: ['./src'], // 网站根目录
    port: 38900, // 端口
    livereload: true,
    middleware: function(connect, opt) {
      return [
        modRewrite([
          // 设置代理
          '^/api/(.*)$ http://127.0.0.1:31000/api/$1 [P]'
        ])
      ];
    }
  });
  done();
});

// 启动浏览器打开地址
// gulp.task('open', ['devServer'], function() {
//   gulp.src(__filename).pipe(open({ uri: 'http://localhost:38900/index.html' }));
// });
gulp.task('open', gulp.series('devServer', done => {
  gulp.src(__filename).pipe(open({ uri: 'http://localhost:38900/index.html' }));
  done();
}));

// 打包前的清理工作
gulp.task('clean', done => {
  gulp.src(['dist/js/**','dist/styles/**'],{read: false})
  .pipe(clean({force: true}));
	done();
});

// 创建一个任务，把模板生成js文件，相当于把模板进行预编译
gulp.task('tpl', done => {
  gulp.src('src/template/**/*.html')
  .pipe(
    tmodjs({
      base: 'src/template',
      combo: true,
      output: 'src/js/template'
    })
  );
  done();
});

//最终任务
gulp.task('dist', gulp.series('clean', 'tpl', 'copy', gulp.parallel('style', 'imageMin', 'js'), 'html', 'revjs'));

//gulp 监控
gulp.task('dev', gulp.parallel('open', done => {
  //监控scss或者css变化，并自动调用style样式、
  gulp.watch(['src/styles/css/**', 'src/styles/scss/**'], done => {
    connect.reload();
    done();
  });

  gulp.watch('src/template/**/*.html', gulp.parallel('tpl'));

  done();
}));

//gulpsourcemap
