import InterfaceComponent from './interface.vue';

export default {
  id: 'draw-interface',
	name: 'Free Draw',
	description: 'Draw shapes with cursor or touch',
	icon: 'gesture',
	component: InterfaceComponent,
	types: ['uuid'],
	groups: ['file'],
	relational: true,
	options: [
		{
			field: 'folder',
			name: '$t:interfaces.system-folder.folder',
			type: 'uuid',
			meta: {
				width: 'full',
				interface: 'system-folder',
				note: '$t:interfaces.system-folder.field_hint',
			},
			schema: {
				default_value: undefined,
			},
		},
	],
	recommendedDisplays: ['image'],
};