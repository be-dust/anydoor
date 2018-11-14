// totalSize 表示文件的大小
module.exports = (totalSize, req, res) => {
	const range = req.headers['range']
	if (!range) {
		return {code : 200}
	}
	const sizes = range.match(/bytes=(\d*)-(\d*)/)// 返回一个数组，sizes[0]表示匹配到的内容；sizes[1]表示第一个分组；sizes[2]表示第二个分组
	console.info('sizes', sizes)
	const end = sizes[2] || totalSize - 1
	const start = sizes[1] || totalSize - end

	if (start > end || start < 0 || end > totalSize) {
		return {code: 200}
	}
	res.setHeader('Accept-Ranges',  'bytes')
	res.setHeader('Content-Range', `bytes ${start} - ${end}/${totalSize}`)
	res.setHeader('Content-Length', end - start)
	return {
		code: 206,// partial content
		start: parseInt(start),
		end: parseInt(end)
	}
}