import Ember from 'ember';

var InputsDefaultSelectComponent = Ember.Component.extend
({

	tagName: 'selectQuery',

	// - Options
	menuOpened: false,
	search: true,

	// - Data
	data: [],
	searchValue: "",

	currentSelected: Ember.computed('data.@each.selected', function () 
	{
		var items = this.get('data');

		return items.find(function (elem) 
		{
			return elem.selected;
		});
	}),

	// - Filtered data
	items: Ember.computed('data', 'searchValue', function ()
	{
		var that = this;

		return this.get('data').filter(function (val)
		{

			var currName = val.name.toLowerCase();
			var searchQuery = that.get('searchValue').toLowerCase();

			return currName.includes(searchQuery);
		});
	}),

	init: function ()
	{

		this._super();
	},


	actions:
	{

		outClick: function ()
		{

			if (this.get('menuOpened'))
			{
				this.send('toggleMenu');
			}

		},

		selected: function (elem)
		{

			var items = this.get('data');

			for(var i = 0; i < items.length; ++i)
			{
				this.set('data.' + i + '.selected', items[i] === elem);
			}

			this.send('toggleMenu');

			this.sendAction('action', elem);
		},

		toggleMenu: function ()
		{

			this.set('searchValue', "");

			var menuOpened = this.get('menuOpened');

			if (menuOpened)
			{
				this.$('.optionsMenu').stop().fadeOut(200);
			}
			else
			{
				this.$('.optionsMenu').stop().fadeIn(200);
			}

			this.set('menuOpened', !menuOpened);

		}

	}

});

export default InputsDefaultSelectComponent;
