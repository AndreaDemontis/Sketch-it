`import Ember from 'ember'`

DefaultRadiobuttonComponent = Ember.Component.extend

	tagName: 'radiobutton'

	getId: Ember.computed 'name', 'value', ->

		return @.get('name') + '/' + @get('value')


`export default DefaultRadiobuttonComponent`
