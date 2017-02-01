import Ember from 'ember';

var FaButtonComponent = Ember.Component.extend
({

	tagName: 'fa-button',

	actions:
	{
		click: function () 
		{
			this.sendAction();
		}
	}
});

export default FaButtonComponent;
