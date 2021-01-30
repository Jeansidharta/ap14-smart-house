import { FormControlLabel, Checkbox as MUICheckbox } from '@material-ui/core';
import React from 'react';

type CheckboxProps = React.PropsWithChildren<{
	onChange?: (value: boolean) => void,
	label: string,
	value?: boolean,
}> & Omit<React.ComponentProps<'label'>, 'onChange'>;

type CheckboxComponent = React.FunctionComponent<CheckboxProps>;

const Checkbox: CheckboxComponent = ({
	onChange = () => {},
	label,
	value,
}) => {
	function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.checked;
		onChange(value);
	}

	return (
		<FormControlLabel
			control={
				<MUICheckbox
					onChange={handleChange}
					checked={value}
				/>
			}
			label={label}
		/>
	);
}

export default Checkbox;