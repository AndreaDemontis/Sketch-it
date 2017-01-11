export function initialize(container) 
{
	var store = container.lookup('service:store');

	// User initialization
	store.createRecord('user', { 'username':'Guest', 'password': 'dc647eb65e6711e155375218212b3964', 'id': 0 });
}

export default 
{
	name: 'server-data',
	initialize
};
