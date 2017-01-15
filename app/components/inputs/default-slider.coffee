`import Ember from 'ember'`

DefaultSliderComponent = Ember.Component.extend

	tagName: 'slider'

	# - Slider initial value
	currentValue: 0

	init: ->

		@._super()

		@.set "currentValue", (@get "min")


	haveText: Ember.computed 'label', ->

		return @.get("label") != undefined

`export default DefaultSliderComponent`
