import { FormControl, Select as MUISelect, InputLabel, MenuItem } from '@mui/material';
import React, { FC } from 'react';

type Option =
	| { text: string; value: string | number | null; id?: undefined }
	| { text: string; value: unknown; id: string }
	| string;

const Select: FC<
	React.ComponentProps<typeof MUISelect> & {
		options: readonly Option[];
		onChangeValue?: (newValue: never) => void;
		label?: string;
		fullWidth?: boolean;
		className?: string;
		defaultValue?: string;
	}
> = ({
	options,
	onChangeValue = () => {},
	label,
	className,
	fullWidth = false,
	defaultValue = ``,
	...props
}) => {
	const [selectedId, setSelectedId] = React.useState<string>(defaultValue);

	function handleChange(newValue: unknown) {
		const option = options.find(option => parseOption(option).id === newValue);
		if (!option) throw new Error(`wtf, my option disappeared`);

		const { value, id } = parseOption(option);
		onChangeValue(value as unknown as never);
		setSelectedId(id.toString());
	}

	function parseOption(option: Option) {
		if (typeof option === `string`) return { text: option, value: option, id: option };
		if (option.id === undefined) {
			return { text: option.text, value: option.value as string | number, id: option.value! };
		} else return { text: option.text, id: option.id, value: option.value };
	}

	return (
		<FormControl className={className} fullWidth={fullWidth}>
			<InputLabel>{label}</InputLabel>
			<MUISelect
				{...props}
				fullWidth={fullWidth}
				value={selectedId}
				onChange={event => handleChange(event.target.value)}
			>
				{options.map(option => {
					const { text, id } = parseOption(option);
					return (
						<MenuItem key={id} value={id}>
							{text}
						</MenuItem>
					);
				})}
			</MUISelect>
		</FormControl>
	);
};

export default Select;
