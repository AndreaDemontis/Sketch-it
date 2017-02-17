import Ember from 'ember';

export default Ember.Component.extend(
{
	tagName: 'confirmButton',

	open: false,

	click: function (e) 
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

		e.stopPropagation();
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
