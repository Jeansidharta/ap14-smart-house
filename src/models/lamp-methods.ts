export const MethodNames = [
	'get_prop',
	'set_ct_abx',
	'set_rgb',
	'set_hsv',
	'set_bright',
	'set_power',
	'toggle',
	'set_default',
	'start_cf',
	'stop_cf',
	'set_scene',
	'cron_add',
	'cron_get',
	'cron_del',
	'set_adjust',
	'set_music',
	'set_name',
	'adjust_bright',
	'adjust_ct',
	'adjust_color',
] as const;

export type MethodNames = typeof MethodNames[number]