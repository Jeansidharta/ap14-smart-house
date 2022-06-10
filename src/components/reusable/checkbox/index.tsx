import { FormControlLabel, Checkbox as MUICheckbox } from '@mui/material';
import React, { FC, PropsWithChildren } from 'react';

const Checkbox: FC<
	PropsWithChildren<{
		onChangeValue?: (value: boolean) => void;
		label: string;
		value?: boolean;
	}> &
		React.ComponentProps<typeof MUICheckbox>
> = ({ onChangeValue = () => {}, label, value, ...props }) => {
	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.checked;
		onChangeValue(value);
	}

	return (
		<FormControlLabel
			control={<MUICheckbox {...props} onChange={handleChange} checked={value} />}
			label={label}
		/>
	);
};

export default Checkbox;
