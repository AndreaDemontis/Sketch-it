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
			// - On render (initialize) scroll down
			this.send('scrollDown');
		});
	},

	messagesChanged: Ember.observer('messages.[]', function() 
	{
		// - On message scroll down
		this.send('scrollDown');
	}),

	actions: 
	{

		scrollDown: function () 
		{
			var height = 0;

			// - Get all message height
			$('.chatContent li').each(function(i, value)
			{
				height += parseInt($(this).height());
			});

			var ScrollableArea = this.$(".chatContent");

			// - Scroll to bottom
			ScrollableArea.animate({ scrollTop: height }, "0");
		},

		sendMessage: function () 
		{
			this.sendAction('action', this.get('message'));
			this.set('message', '');
		}

	}

});
