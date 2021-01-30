import { TextField } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
	display: flex;
`;
;
type rgbObject = {
	red: number,
	green: number,
	blue: number,
};

type SelectRGBProps = React.PropsWithoutRef<{
	onChange?: (value: rgbObject | null) => void,
}>;

type SelectRGBComponent = React.FunctionComponent<SelectRGBProps>;

const SelectRGB: SelectRGBComponent = ({
	onChange = () => {},
}) => {
	const [red, setRed] = React.useState<number | null>(null);
	const [green, setGreen] = React.useState<number | null>(null);
	const [blue, setBlue] = React.useState<number | null>(null);

	function triggerOnChange () {
		if (red !== null && green !== null && blue !== null) {
			onChange({ red, green, blue });
		} else {
			onChange(null);
		}
	}

	function makeHandler (stateSetter: (state: number | null) => void) {
		return (event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;
			const number = Number(value);
			if (isNaN(number) || !isFinite(number)) {
				stateSetter(null);
			} else {
				stateSetter(number);
			}
		}
	}

	React.useEffect(() => {
		triggerOnChange();
	}, [red, green, blue]);

	return (
		<Root>
			<TextField
				type='number'
				inputProps={{ min: 0, max: 255 }}
				onChange={makeHandler(setRed)}
				label='Red'
			/>
			<TextField
				type='number'
				inputProps={{ min: 0, max: 255 }}
				onChange={makeHandler(setGreen)}
				label='Green'
			/>
			<TextField
				type='number'
				inputProps={{ min: 0, max: 255 }}
				onChange={makeHandler(setBlue)}
				label='Blue'
			/>
		</Root>
	);
}

export default SelectRGB;