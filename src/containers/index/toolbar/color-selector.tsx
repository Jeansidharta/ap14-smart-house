import React from 'react';
import styled from 'styled-components';
import HSV2RGB from 'hsv-rgb';
import StripColor from '../../../components/reusable/strip-color';

const Root = styled.div`
`;

const MAX_HUE = 360;
const MAX_SATURATION = 100;
const MAX_VALUE = 100;

type ColorSelectorProps = React.PropsWithoutRef<{
	onChange?: (hue: number, saturation: number) => void,
}>;

type ColorSelectorComponent = React.FunctionComponent<ColorSelectorProps>;

const ColorSelector: ColorSelectorComponent = ({
	onChange = () => {},
}) => {
	const [hue, setHue] = React.useState(0);
	const [saturation, setSaturation] = React.useState(0);

	function handleSaturationChange (x: number) {
		const newSaturation = x * MAX_SATURATION;
		setSaturation(newSaturation);
		onChange(hue, newSaturation);
	}

	function handleHueChange (x: number) {
		const newHue = x * MAX_HUE;
		setHue(newHue);
		onChange(newHue, saturation);
	}

	return (
		<Root>
			<StripColor
				onChange={handleSaturationChange}
				getColor={React.useMemo(() => x => HSV2RGB(hue, x * MAX_SATURATION, MAX_VALUE), [hue])}
			/>
			<StripColor
				onChange={handleHueChange}
				getColor={React.useMemo(() => x => HSV2RGB(x * MAX_HUE, MAX_SATURATION, MAX_VALUE), [])}
			/>
		</Root>
	);
}

export default ColorSelector;