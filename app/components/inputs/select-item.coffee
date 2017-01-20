`import Ember from 'ember'`

InputsSelectItemComponent = Ember.Component.extend

	tagName: 'li'

	selected: false

	content: null

	hasDescription: Ember.computed 'content', ->

		(@get 'content').description != null && (@get 'content').description != undefined

	click: ->

		@.sendAction 'action', @.get 'content'

		

`export default InputsSelectItemComponent`
