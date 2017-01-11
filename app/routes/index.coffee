`import Ember from 'ember'`
`import { storageFor } from 'ember-local-storage'`

IndexRoute = Ember.Route.extend

	appSettings: storageFor 'settings'

	activate: ->


	model: ->

		data = null

		return data



`export default IndexRoute`
