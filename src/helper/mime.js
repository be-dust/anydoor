const path = require('path')
const mimeTypes = {
	'css': 'text/css',
	'gif': 'img/gif',
	'html': 'text/html',
	'ico': 'image/x-icon',
	'jpeg': 'image/jpeg',
	'js': 'text/javascript',
	'json': 'application/json',
	'pdf': 'application/pdf',
	'png': 'image/png',
	'svg': 'image/svg+xml',
	'swf': 'application/x-shockwave-flash',
	'tiff': 'image/tiff',
	'txt': 'text/plain',
	'wav': 'audio/x-wav',
	'wma': 'audio/x-ms-wma',
	'wmv': 'video/x-ms-wmv',
	'xml': 'text/xml'
}
module.exports = (filePath) => {
	let ext = path.extname(filePath).split('.').pop().toLowerCase()// .jquery.min.js 这样去最后一个
	if (!ext) {
		ext = filePath
	}
	return mimeTypes[ext] || mimeTypes['txt']
}