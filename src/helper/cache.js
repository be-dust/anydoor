const {cache} = require('../config/defaultConfig')
function refresh (stats, res) {
	const {maxAge, expires, cacheControl, lastModified, etag} = cache
	if (expires) {
		res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString())
	}
	if (cacheControl) {
		res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
	}
	if (lastModified) {
		// stats.mtime 修改时间
		res.setHeader('Last-Modified', stats.mtime.toUTCString())
	}
	if (etag) {
		res.setHeader('ETag', `${stats.size} - ${stats.mtime}`)
	}
}

module.exports = function isFresh(stats, req, res) {
	refresh(stats, res)
	const lastModified = req.headers['if-modified-since']
	const etag = req.headers['if-none-match']

	// 没有缓存
	if (!lastModified && !etag) {
		return false
	}
	// 不能使用缓存
	if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
		return false
	}
	// 不能使用缓存
	if (etag && etag !== res.getHeader('ETag')) {
		return false
	}

	return true
}