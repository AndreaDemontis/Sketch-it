`import DS from 'ember-data'`

User = DS.Model.extend 

	username: DS.attr 'string'
	password: DS.attr 'string'

`export default User`
