import React from 'react';
import StripColor from '../strip-color';
import hsv2rgb from 'hsv-rgb';
import { HSV } from '.';

const MAX_HUE = 359;
const MAX_SATURATION = 100;
const MAX_VALUE = 100;

type SelectHSVProps = React.PropsWithoutRef<{
	defaultValue?: HSV,
	onChange?: (rgb: HSV) => void,
}>;

type SelectHSVComponent = React.FunctionComponent<SelectHSVProps>;

const SelectHSV: SelectHSVComponent = ({
	defaultValue,
	onChange = () => {},
}) => {
	const [hue, setHue] = React.useState(defaultValue?.hue || 0);
	const [saturation, setSaturation] = React.useState(defaultValue?.saturation || 0);

	function handleSaturationChange (x: number) {
		const newSaturation = Math.max(0, Math.min(MAX_SATURATION, Math.round(x * MAX_SATURATION)));
		setSaturation(newSaturation);
		onChange({ hue, saturation: newSaturation });
	}

	function handleHueChange (x: number) {
		const newHue = Math.max(0, Math.min(MAX_HUE, Math.round(x * MAX_HUE)));
		setHue(newHue);
		onChange({ hue: newHue, saturation });
	}

	const getSaturationFunc = React.useMemo(
		() => (x: number) => hsv2rgb(hue, x * MAX_SATURATION, MAX_VALUE),
		[hue],
	);
	const getHueFunc = React.useMemo(
		() => (x: number) => hsv2rgb(x * MAX_HUE, MAX_SATURATION, MAX_VALUE),
		[],
	);

	return (
		<>
			<StripColor
				onChange={handleSaturationChange}
				getColor={getSaturationFunc}
				defaultValue={saturation / MAX_SATURATION}
			/>
			<StripColor
				onChange={handleHueChange}
				getColor={getHueFunc}
				defaultValue={hue / MAX_HUE}
			/>
		</>
	);
}

export default SelectHSV;