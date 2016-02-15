/* eslint node: true */
'use strict'

module.exports = {
  name: 'ember-snip',

  included: function(app) {
    app.import('vendor/ember-snip/register-version.js')
  }
}
