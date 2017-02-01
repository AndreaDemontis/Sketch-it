import Ember from 'ember';
var Electron = require('electron');

var TopBarComponent = Ember.Component.extend
({

	tagName: 'div',
	classNames: [ 'topbar' ],
	classNameBindings: [ 'topbarBorder' ],

	// - Window hinstance
	window: Electron.remote.getCurrentWindow(),

	// - Options
	topbarBorder: false,
	canMinimize: true,
	canClose: true,
	showTitle: true,
	userLogged: false,
	hasNotifications: true,

	actions:
	{

		appClose: function () 
		{
			this.get('window').close();
		},

		appMinimize: function () 
		{
			this.get('window').minimize();
		},

		userNotifications: function () 
		{
			return;
		}
	}
});


export default TopBarComponent;