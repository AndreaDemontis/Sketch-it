import Ember from 'ember';

var InputsSelectItemComponent = Ember.Component.extend
({

	tagName: 'li',

	selected: false,

	content: null,

	hasDescription: Ember.computed('content', function ()
	{

		return this.get('content').description != null && this.get('content').description !== undefined;

	}),

	click: function ()
	{

		this.sendAction('action', this.get('content'));

	}

});	

export default InputsSelectItemComponent;
