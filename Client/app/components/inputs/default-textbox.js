import Ember from 'ember';

var DefaultTextboxComponent = Ember.Component.extend
({
	tagName: 'textbox',
	currValue: '',

	actions:
	{
		change: function () 
		{
			this.sendAction('onChange', this.get('currValue'));
		},

		enter: function () 
		{
			this.sendAction('onEnter', this.get('currValue'));
		}
	}
});

export default DefaultTextboxComponent;
