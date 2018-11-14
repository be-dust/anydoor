const {createGzip, createDeflate} = require('zlib')
module.exports = (rs, req, res) => {
	// 读浏览器支持的压缩方式
	const acceptEncoding = req.headers['accept-encoding']
	// b 限制单词边界 比如gzip就是gzip不能是别的单词
	if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
		return rs
	} else if (acceptEncoding.match(/\bgzip\b/)) {
		res.setHeader('Content-Encoding', 'gzip')
		return  rs.pipe(createGzip())
	} else if (acceptEncoding.match(/\bdeflate\b/)) {
		res.setHeader('Content-Encoding', 'deflate')
		return rs.pipe(createDeflate())
	}
}