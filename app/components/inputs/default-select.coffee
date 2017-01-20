`import Ember from 'ember'`

InputsDefaultSelectComponent = Ember.Component.extend

	tagName: 'selectQuery'

	# - Options
	menuOpened: false
	search: true

	# - Data
	currentSelected: null
	data: []
	searchValue: ""

	# - Filtered data
	items: Ember.computed 'data', 'searchValue', ->

		(@get 'data').filter (val) =>

			currName = val.name.toLowerCase()
			searchQuery = (@get 'searchValue').toLowerCase()

			currName.includes(searchQuery)

	init: ->

		@._super()

		# - Initialize with first item
		@set 'currentSelected', @get 'items.0'


	actions:

		outClick: ->

			if @get 'menuOpened'

				@.send 'toggleMenu'

		selected: (elem) ->

			items = @get 'items'

			@set 'currentSelected', elem

			for i in [0...items.length] by 1

				@set 'items.' + i + '.selected', items[i] == elem

			@.send 'toggleMenu'

			@.sendAction 'action', elem

		toggleMenu: ->

			@set 'searchValue', ""

			menuOpened = @get 'menuOpened'

			if menuOpened
				@.$('.optionsMenu').stop().fadeOut 200
			else
				@.$('.optionsMenu').stop().fadeIn 200

			@set 'menuOpened', !menuOpened

`export default InputsDefaultSelectComponent`
