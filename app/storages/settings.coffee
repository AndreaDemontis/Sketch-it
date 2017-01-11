`import StorageObject from 'ember-local-storage/local/object'`

Storage = StorageObject.extend()

Storage.reopenClass

	initialState: -> 

		audio:

			volume: 100
			mute: false


`export default Storage`