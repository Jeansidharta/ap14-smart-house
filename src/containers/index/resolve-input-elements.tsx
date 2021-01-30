import Select from '../../components/reusable/select';
import { TextField } from '@material-ui/core';
import SelectRGB from '../../components/reusable/select-rgb';

export type InputCommonProps = {
	onChange: (val: string | number | null) => void, 
}

export const NumberInput = (required: boolean, label: string, min?: number, max?: number) => {
	return (({ onChange }) => {
		return <TextField
			required={required}
			inputProps={{
				min,
				max,
				type: 'number',
			}}
			label={label}
			onChange={event => onChange(event.target.value ? Number(event.target.value) : null)}
		/>;
	}) as React.FunctionComponent<InputCommonProps>;
}

export const StringInput = (required: boolean, label: string) => {
	return (({ onChange }) => {
		return <TextField
			required={required}
			label={label}
			onChange={event => onChange(event.target.value)}
			type="text"
		/>;
	}) as React.FunctionComponent<InputCommonProps>;
}

export const SelectInput = (required: boolean, label: string, options: string[]) => {
	return (({ onChange }) => {
		return <Select
			required={required}
			label={label}
			options={options}
			onChangeValue={val => onChange(val as string)}
		/>;
	}) as React.FunctionComponent<InputCommonProps>
}

export const RGBInput = () => {
	return (({ onChange }) => {
		return <SelectRGB
			onChange={val => (
				val ? onChange(val.red * 0x010000 + val.green * 0x000100 + val.blue) : onChange(null)
			)}
		/>
	}) as React.FunctionComponent<InputCommonProps>;
}

export const Effect = SelectInput(false, 'Effect type', ['smooth', 'sudden']);

export function getMethodInputs (methodName: string) {
	if (methodName === 'get_prop') {
		return [
			StringInput(true, 'Prop'),
		];
	} else if (methodName === 'set_ct_abx') {
		return [
			NumberInput(true, 'Temperature', 1700, 6500),
			Effect,
			NumberInput(false, 'Duration', 30),
		];
	} else if (methodName === 'set_rgb') {
		return [
			RGBInput(),
			Effect,
			NumberInput(false, 'duration', 30),
		];
	} else if (methodName === 'set_hsv') {
		return [
			NumberInput(true, 'Hue', 0, 359),
			NumberInput(true, 'Saturation', 0, 100),
			Effect,
			NumberInput(false, 'Duration', 30),
		];
	} else if (methodName === 'set_bright') {
		return [
			NumberInput(true, 'Brightness', 1, 100),
			Effect,
			NumberInput(false, 'Duration', 30),
		];
	} else if (methodName === 'set_power') {
		return [
			SelectInput(true, 'Power mode', ['on', 'off']),
			Effect,
			NumberInput(false, 'Duration', 30),
			NumberInput(true, 'TODO', 0, 5),
		];
	} else if (methodName === 'toggle') {
		return [];
	} else if (methodName === 'set_default') {
		return [];
	} else if (methodName === 'start_cf') {
		return [
			NumberInput(true, 'Count', 0),
			NumberInput(true, 'After effect', 0, 2),
			StringInput(true, 'Control flow argument'),
		];
	} else if (methodName === 'stop_cf') {
		return [];
	} else if (methodName === 'set_scene') {
		return [
			SelectInput(true, 'Scene type', ['color', 'hsv', 'ct', 'auto_delay_off']),
			NumberInput(false, 'Value', 0),
			NumberInput(false, 'Value 2', 0),
			NumberInput(false, 'Value 3', 0),
		];
	} else if (methodName === 'cron_add') {
		return [
			NumberInput(true, 'Time (minutes)', 0),
		];
	} else if (methodName === 'cron_get') {
		return [];
	} else if (methodName === 'cron_del') {
		return [];
	} else if (methodName === 'set_adjust') {
		return [
			SelectInput(true, 'Adjust type', ['increase', 'decrease', 'circle']),
			SelectInput(true, 'Prop', ['color', 'ct', 'bright']),
		];
	} else if (methodName === 'set_music') {
		return [
			SelectInput(true, 'Music state', ['on', 'off']),
		];
	} else if (methodName === 'set_name') {
		return [
			StringInput(true, 'Name'),
		];
	} else if (methodName === 'adjust_bright') {
		return [
			NumberInput(true, 'Brightness percentage', -100, 100),
			NumberInput(false, 'Duration', 0),
		];
	} else if (methodName === 'adjust_ct') {
		return [
			NumberInput(true, 'Temperature percentage', -100, 100),
			NumberInput(false, 'Duration', 0),
		];
	} else if (methodName === 'adjust_color') {
		return [
			NumberInput(true, 'Color percentage', -100, 100),
			NumberInput(false, 'Duration', 0),
		];
	} else return null;
}