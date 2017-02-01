import ENV from '../config/environment';

export function initialize () 
{
	ENV.APP.supportedLanguages = 
	[
		{ name: 'Italy', description: 'Italiano', html: '<span class="flag-icon flag-icon-it"></span>' },
		{ name: 'France', description: 'Francia', html: '<span class="flag-icon flag-icon-fr"></span>' },
		{ name: 'English', description: 'Inglese', html: '<span class="flag-icon flag-icon-gb"></span>', selected: true},
		{ name: 'Japanese', description: 'Giapponese', html: '<span class="flag-icon flag-icon-jp"></span>' },
		{ name: 'Chinese', description: 'Cinese', html: '<span class="flag-icon flag-icon-ch"></span>' },
		{ name: 'Russian', description: 'Russo', html: '<span class="flag-icon flag-icon-ru"></span>' },
		{ name: 'Egypt', description: 'Egitto', html: '<span class="flag-icon flag-icon-eg"></span>' },
		{ name: 'Ghana', description: 'Ghana', html: '<span class="flag-icon flag-icon-gh"></span>' },
		{ name: 'Guinea', description: 'Guinea', html: '<span class="flag-icon flag-icon-gn"></span>' },
		{ name: 'Nigeria', description: 'Nigeria', html: '<span class="flag-icon flag-icon-ng"></span>' }
	];
}

export default
{
	name: 'flags',
	initialize
};
