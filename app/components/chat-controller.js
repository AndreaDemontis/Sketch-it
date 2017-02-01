import Ember from 'ember';

export default Ember.Component.extend(
{

	classNames: ['chatController'],

	message: '',

	messages: [],

	didInsertElement: function () 
	{
		Ember.run.scheduleOnce('afterRender', this, function() 
		{
			this.send('scrollDown');
		});
	},

	actions: 
	{

		scrollDown: function () 
		{
			var ScrollableArea = this.$(".chatContent");
			ScrollableArea.animate({ scrollTop: ScrollableArea.height() }, "0");
		},

		sendMessage: function () 
		{
			this.set('message', '');
		}

	}

});
