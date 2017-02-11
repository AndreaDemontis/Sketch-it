import Ember from 'ember';

export default Ember.Component.extend(
{
	tagName: 'confirmButton',

	open: false,

	click: function () 
	{
		if (this.get("disabled"))
		{
			return;
		}
		
		if (this.get("open")) 
		{
			this.sendAction();
		}

		if (!this.get("open"))
		{
			this.$("button").attr('class', 'open');

			this.set("open", true);
		}
	},

	actions:
	{
		outClick: function () 
		{
			if (this.get("open"))
			{
				this.$("button").attr('class', '');

				this.set("open", false);
			}
		}
	}

});
