import { FormControlLabel, Checkbox as MUICheckbox } from '@material-ui/core';
import React from 'react';

type CheckboxProps = React.PropsWithChildren<{
	onChangeValue?: (value: boolean) => void,
	label: string,
	value?: boolean,
}> & React.ComponentProps<typeof MUICheckbox>;

type CheckboxComponent = React.FunctionComponent<CheckboxProps>;

const Checkbox: CheckboxComponent = ({
	onChangeValue = () => {},
	label,
	value,
	...props
}) => {
	function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.checked;
		onChangeValue(value);
	}

	return (
		<FormControlLabel
			control={
				<MUICheckbox
					{...props}
					onChange={handleChange}
					checked={value}
				/>
			}
			label={label}
		/>
	);
};

export default Checkbox;
