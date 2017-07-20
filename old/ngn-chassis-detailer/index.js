const DetailerProject = require('./detailer/project')

class Detailer {
  static get name () {
    return 'Detailer'
  }

  static get basePath () {
    return '../../ngn-chassis-detailer/detailer'
  }

  static init (name, basePath, project, utils) {
    return new DetailerProject(name, basePath, project, utils)
  }
}

module.exports = Detailer
