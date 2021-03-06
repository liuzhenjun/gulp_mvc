// Promise 对象
				/* 1. Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果 */
				// Promise对象代表一个异步操作，有三种状态：pending：进行中，fulfilled：已成功，也称resolved 和rejected：已失败
				let p = new Promise((resolve, reject) => {
					try{
						console.log('开始执行promise代码');
						throw new Error('自定义异常信息');
						setTimeout(() => {
							// 写一些 处理逻辑的代码
							resolve(123); // 处理事件，任务完成后，如果成功，直接调用resolve方法
						}, 1000);
					}catch(e){
						//TODO handle the exception
						reject(e);
					}
				});
				
				// 第一种写法
				p.then((data) => {
					console.log(data);
				}).catch(error => {
					console.log(error);
				});
				
				// 第二种写法
				p.then((data) => {
					console.log(data);
				},error => {
					console.log(error);
				});
				console.log('结束执行');
				
				const fs = require('fs');
				const path = require('path');
				let p2 = new Promise((resolve, reject) => {
					console.log('执行Promise的初始化');
					//读取es6_01.js的内容
					let fileData = fs.readFileSync(path.join(_dirname, 'es6_01.js'), 'utf8');
					resolve(fileData);
				});
				
				p2.then(data => {
					console.log(data);
					return {data,time:Date.now()};
				}).then(data => console.log(data));