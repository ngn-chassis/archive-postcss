const gutil = require('gulp-util')
const through = require('through2')
const postcss = require('postcss')

// TODO: update chassis filepath once it is available as a node-module
const chassis = require('../ngn-chassis/index.js')

module.exports = function (cfg) {
	cfg = cfg || {}

  let proc = postcss([chassis(cfg)])

	return through.obj((file, enc, cb) => {
		let filename = file.relative.split('/').pop()
		
		if (filename.startsWith('_')) {
			cb(null)
			return
		}
		
		if (file.isNull()) {
			cb(null, file)
			return
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-chassis', 'Streaming is not supported!'))
			return
		}

    proc.process(file.contents).then((res) => {
      file.contents = new Buffer(res.css)
      cb(null, file)
    }, (error) => {
			console.error(error)
			this.emit('error', new gutil.PluginError('gulp-chassis', 'Error processing CSS'))
		})
	})
}
