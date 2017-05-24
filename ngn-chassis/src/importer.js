class ChassisImporter {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	importStylesheet (path) {
		let { utils } = this.chassis
		return utils.isDirectory(path) ? utils.parseDirectory(path) : utils.parseStylesheet(path)
	}
}

module.exports = ChassisImporter
