`import Ember from 'ember'`

FaButtonComponent = Ember.Component.extend

	tagName: 'fa-button'

	actions:

		click: ->

			@.sendAction()


`export default FaButtonComponent`
