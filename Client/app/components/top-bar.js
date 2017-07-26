import Ember from 'ember';
var Electron = require('electron');

var TopBarComponent = Ember.Component.extend
({

	tagName: 'div',
	classNames: [ 'topbar' ],
	classNameBindings: [ 'topbarBorder' ],

	server: Ember.inject.service('server'),

	// - Window hinstance
	window: Electron.remote.getCurrentWindow(),

	// - Options
	topbarBorder: false,
	canMinimize: true,
	canClose: true,
	showTitle: true,
	userLogged: false,
	hasNotifications: true,
	userPopup: false,
	cantLogout: false,

	click: function (event) 
	{
		event.stopPropagation();
	},

	actions:
	{

		appClose: function () 
		{
			this.get('window').close();
		},

		logOut: function () 
		{
			var server = this.get('server');

			server.disconnect();

			this.get('router').transitionTo('index');
		},

		appMinimize: function () 
		{
			this.get('window').minimize();
		},

		userNotifications: function () 
		{
			return;
		},

		openUserPopup: function () 
		{
			this.set('userPopup', !this.get('userPopup'));
		}
	}
});


export default TopBarComponent;