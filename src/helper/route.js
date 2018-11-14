
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const util = require('util')
const stat = util.promisify(fs.stat)
const readdir = util.promisify(fs.readdir)
const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)
const template = Handlebars.compile(source.toString())
const mime = require('./mime')
const compress = require('./compress')
const range = require('./range')
const isFresh = require('./cache')

module.exports = async function(req, res, filePath, config) {
	try {
		const stats = await stat(filePath)
		//*如果是文件
		if (stats.isFile()) {
			const contentType = mime(filePath)
			res.setHeader('Content-Type', contentType)
			// fs.readFile是异步但是相对于流的方式还是比较慢的
			// fs.readFile(filePath, (err, data) => {
			// 	res.end(data)
			// })
			if (isFresh(stats, req, res)) {
				res.statusCode = 304
				res.end()
				return
			}
			let rs
			const {code, start, end} = range(stats.size, req, res)
			if (code == 200) {
				res.statusCode = 200
				rs = fs.createReadStream(filePath)
			} else {
				res.statusCode = 206
				rs = fs.createReadStream(filePath, {start, end})
			}
			if (filePath.match(config.compress)) {
				// 对流压缩
				rs = compress(rs, req, res)
			}
			rs.pipe(res)
		}
		//*如果是文件夹
		else if (stats.isDirectory()) {
			const files = await readdir(filePath)
			res.statusCode = 200
			res.setHeader('Content-Type', 'text/html')
			const dir = path.relative(config.root, filePath)
			console.info('=============')
			console.info('cwd:', process.cwd())
			console.info('filePath:', filePath)
			console.info('dir:', dir)
			const data = {
				title: path.basename(filePath),
				dir: dir ? `/${dir}`: ``,
				files: files.map(file => {
					return {
						file,
						icon: mime(file)
					}
				})
			}
			res.end(template(data))
		}
	} catch (e) {
		console.error(e)
		res.statusCode = 404
		res.setHeader('Content-Type', 'text/plain')
		res.end(`${filePath} is not a directory or file\n ${e.toString()}`)
		return
	}
}