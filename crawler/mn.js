const puppeteer = require('puppeteer');
const { mn } = require('./config/default');
const srcToImg = require('./srcToimg');

(async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto('https://image.baidu.com/')
	console.log('go to https://image.baidu.com/')

	// 设置爬取目标页面的范围
	await page.setViewport({
		width: 1920,
		height: 1080
	})
	console.log('reset viewport')

	await page.focus('#kw')
	await page.keyboard.sendCharacter('狗')
	await page.click('.s_search')
	console.log('go to search list')

	page.on('load', async () => {
		console.log('page loading done, start fetch...');
		// evaluate 把字符串当做js来执行， 创建一个可以执行chrome的command line中的命令的环境
		const srcs = await page.evaluate(() => {
			/* eslint-disable*/
			const images = document.querySelectorAll('img.main_img')
			return Array.prototype.map.call(images, img => img.src)
		})
		console.log(`get ${srcs.length} images, start download`)
		srcs.forEach(async (src) => {
			// sleep 降低频次以防止触发反爬虫
			await page.awaitFor(200)
			await srcToImg(src, mn)
		})

		await browser.close()
	})
})()