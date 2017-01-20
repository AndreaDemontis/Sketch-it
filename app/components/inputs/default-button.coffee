`import Ember from 'ember'`

DefaultButtonComponent = Ember.Component.extend

	tagName: 'default-button'

	actions:

		click: ->

			@.sendAction()

`export default DefaultButtonComponent`
