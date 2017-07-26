import Ember from 'ember';

export default Ember.Component.extend
({
	classNames: [ 'fadeClass' ],
	
	didInsertElement: function () 
	{
		this.$(".fadeBody").fadeOut(0);
		this.$(".fadeBody").fadeIn(1000);
	}
});
