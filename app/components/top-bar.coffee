`import Ember from 'ember'`

Electron = require 'electron'

TopBarComponent = Ember.Component.extend

	tagName: 'div'
	classNames: [ 'topbar' ]

	# - Window hinstance
	window: Electron.remote.getCurrentWindow()

	# - Options
	canMinimize: true
	canClose: true
	showTitle: true
	userLogged: false
	hasNotifications: true

	actions:

		appClose: ->

			@get('window').close();

		appMinimize: ->

			@get('window').minimize();

		userNotifications: ->

			return

			

`export default TopBarComponent`
