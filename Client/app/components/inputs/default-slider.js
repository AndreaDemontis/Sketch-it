import Ember from 'ember';

var DefaultSliderComponent = Ember.Component.extend
({

	tagName: 'slider',

	// - Slider initial value
	currentValue: 50,

	init: function ()
	{

		this._super();

		this.set("currentValue", this.get("min"));
	},

	haveText: Ember.computed('label', function ()
	{

		return this.get("label") !== undefined;
		
	})

});

export default DefaultSliderComponent;
