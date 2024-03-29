import React, { FC } from 'react';
import { RGB } from '.';
import StripColor from '../strip-color';

const MAX_RED = 255;
const MAX_GREEN = 255;
const MAX_BLUE = 255;

const SelectRGB: FC<{
	defaultValue?: RGB;
	onChange?: (rgb: RGB) => void;
}> = ({ defaultValue, onChange = () => {} }) => {
	const rgbValue = React.useRef<RGB>(defaultValue || { blue: 0, green: 0, red: 0 });

	const getRedFunc = React.useMemo(() => (x: number) => [x * MAX_RED, 0, 0] as const, []);
	const getGreenFunc = React.useMemo(() => (x: number) => [0, x * MAX_GREEN, 0] as const, []);
	const getBlueFunc = React.useMemo(() => (x: number) => [0, 0, x * MAX_BLUE] as const, []);

	function handleRedChange(red: number) {
		rgbValue.current.red = Math.max(0, Math.min(MAX_RED, Math.round(red * MAX_RED)));
		onChange({ ...rgbValue.current });
	}

	function handleGreenChange(green: number) {
		rgbValue.current.green = Math.max(0, Math.min(MAX_GREEN, Math.round(green * MAX_GREEN)));
		onChange({ ...rgbValue.current });
	}

	function handleBlueChange(blue: number) {
		rgbValue.current.blue = Math.max(0, Math.min(MAX_BLUE, Math.round(blue * MAX_BLUE)));
		onChange({ ...rgbValue.current });
	}

	return (
		<>
			<StripColor
				onChange={handleRedChange}
				getColor={getRedFunc}
				defaultValue={rgbValue.current.red / MAX_RED}
			/>
			<StripColor
				onChange={handleGreenChange}
				getColor={getGreenFunc}
				defaultValue={rgbValue.current.green / MAX_GREEN}
			/>
			<StripColor
				onChange={handleBlueChange}
				getColor={getBlueFunc}
				defaultValue={rgbValue.current.blue / MAX_BLUE}
			/>
		</>
	);
};

export default SelectRGB;
