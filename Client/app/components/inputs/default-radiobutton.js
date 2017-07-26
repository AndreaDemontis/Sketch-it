import Ember from 'ember';

var DefaultRadiobuttonComponent = Ember.Component.extend
({

	tagName: 'radiobutton',

	getId: Ember.computed('name', 'value', function ()
	{

		return this.get('name') + '/' + this.get('value');

	})

});

export default DefaultRadiobuttonComponent;
