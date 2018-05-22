'use strict'

const mergeTrees = require('broccoli-merge-trees')
const writeFile = require('broccoli-file-creator')
const version = require('./package.json').version

module.exports = {
  name: 'ember-snip',

  included: function(app) {
    this._super.included(app)

    app.import('vendor/ember-snip/register-version.js')
  },

  treeForVendor(vendorTree) {
    let registerVersionTree = writeFile(
      'ember-snip/register-version.js',
      `Ember.libraries.register('Ember Snip', '${version}')`,
    )

    return mergeTrees([vendorTree, registerVersionTree])
  },
}
