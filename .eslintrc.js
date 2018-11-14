module.exports = {
	"extends": ["eslint:recommended"], // 使用推荐的规则
	// 自定义规则 0:off, 1:warn, 2:error
	"rules": {
		"no-console": ["error", {
			"allow": ["warn", "error", "info"]// 允许console.warn console.error console.info
		}]
	},
	"parser": "babel-eslint", //配置解析器
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "script"
	},
	// 指定全局变量
	"globals": {
		// "window": true
	},
	// 指示当前环境
	"env": {
		"node": true,
		"es6": true,
		"mocha": true
	}
}