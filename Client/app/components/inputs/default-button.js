import Ember from 'ember';

var DefaultButtonComponent = Ember.Component.extend
({

	tagName: 'default-button',

	actions:
	{
		click: function ()
		{

			this.sendAction();

		}
	}

});

export default DefaultButtonComponent;
