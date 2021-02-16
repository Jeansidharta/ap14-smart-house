import React from 'react';
import Select from '../../components/reusable/select';
import { TextField } from '@material-ui/core';
import SelectRGB from '../../components/reusable/select-rgb';

export type InputCommonProps = {
	onChange: (val: string | number | null) => void,
};

export const numberInput = (required: boolean, label: string, min?: number, max?: number) => {
	return (({ onChange }) => {
		return <TextField
			required={required}
			inputProps={{
				min,
				max,
				type: `number`,
			}}
			label={label}
			onChange={event => onChange(event.target.value ? Number(event.target.value) : null)}
		/>;
	}) as React.FunctionComponent<InputCommonProps>;
};

export const stringInput = (required: boolean, label: string) => {
	return (({ onChange }) => {
		return <TextField
			required={required}
			label={label}
			onChange={event => onChange(event.target.value)}
			type='text'
		/>;
	}) as React.FunctionComponent<InputCommonProps>;
};

export const selectInput = (required: boolean, label: string, options: string[]) => {
	return (({ onChange }) => {
		return <Select
			required={required}
			label={label}
			options={options}
			onChangeValue={val => onChange(val as string)}
		/>;
	}) as React.FunctionComponent<InputCommonProps>;
};

export const rgbInput = () => {
	return (({ onChange }) => {
		return <SelectRGB
			onChange={val =>
				val ? onChange(val.red * 0x010000 + val.green * 0x000100 + val.blue) : onChange(null)}
		/>;
	}) as React.FunctionComponent<InputCommonProps>;
};

export const Effect = selectInput(false, `Effect type`, [`smooth`, `sudden`]);

export function getMethodInputs (methodName: string) {
	if (methodName === `get_prop`) {
		return [stringInput(true, `Prop`)];
	} else if (methodName === `set_ct_abx`) {
		return [
			numberInput(true, `Temperature`, 1700, 6500),
			Effect,
			numberInput(false, `Duration`, 30),
		];
	} else if (methodName === `set_rgb`) {
		return [
			rgbInput(),
			Effect,
			numberInput(false, `duration`, 30),
		];
	} else if (methodName === `set_hsv`) {
		return [
			numberInput(true, `Hue`, 0, 359),
			numberInput(true, `Saturation`, 0, 100),
			Effect,
			numberInput(false, `Duration`, 30),
		];
	} else if (methodName === `set_bright`) {
		return [
			numberInput(true, `Brightness`, 1, 100),
			Effect,
			numberInput(false, `Duration`, 30),
		];
	} else if (methodName === `set_power`) {
		return [
			selectInput(true, `Power mode`, [`on`, `off`]),
			Effect,
			numberInput(false, `Duration`, 30),
			numberInput(true, `TODO`, 0, 5),
		];
	} else if (methodName === `toggle`) {
		return [];
	} else if (methodName === `set_default`) {
		return [];
	} else if (methodName === `start_cf`) {
		return [
			numberInput(true, `Count`, 0),
			numberInput(true, `After effect`, 0, 2),
			stringInput(true, `Control flow argument`),
		];
	} else if (methodName === `stop_cf`) {
		return [];
	} else if (methodName === `set_scene`) {
		return [
			selectInput(true, `Scene type`, [`color`, `hsv`, `ct`, `auto_delay_off`]),
			numberInput(false, `Value`, 0),
			numberInput(false, `Value 2`, 0),
			numberInput(false, `Value 3`, 0),
		];
	} else if (methodName === `cron_add`) {
		return [numberInput(true, `Time (minutes)`, 0)];
	} else if (methodName === `cron_get`) {
		return [];
	} else if (methodName === `cron_del`) {
		return [];
	} else if (methodName === `set_adjust`) {
		return [
			selectInput(true, `Adjust type`, [`increase`, `decrease`, `circle`]),
			selectInput(true, `Prop`, [`color`, `ct`, `bright`]),
		];
	} else if (methodName === `set_music`) {
		return [selectInput(true, `Music state`, [`on`, `off`])];
	} else if (methodName === `set_name`) {
		return [stringInput(true, `Name`)];
	} else if (methodName === `adjust_bright`) {
		return [
			numberInput(true, `Brightness percentage`, -100, 100),
			numberInput(false, `Duration`, 0),
		];
	} else if (methodName === `adjust_ct`) {
		return [
			numberInput(true, `Temperature percentage`, -100, 100),
			numberInput(false, `Duration`, 0),
		];
	} else if (methodName === `adjust_color`) {
		return [
			numberInput(true, `Color percentage`, -100, 100),
			numberInput(false, `Duration`, 0),
		];
	} else return null;
}
