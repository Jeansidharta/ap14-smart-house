import React from 'react';
import styled from 'styled-components';
import hsv2rgb from 'hsv-rgb';
import StripColor from '../../../components/reusable/strip-color';
import { colorTemperature2rgb } from 'color-temperature';
import { useSettings } from '../../../contexts/settings';

const Root = styled.div`
`;

const MAX_HUE = 360;
const MAX_SATURATION = 100;
const MAX_VALUE = 100;
const MAX_RED = 255;
const MAX_GREEN = 255;
const MAX_BLUE = 255;
const MIN_TEMPERATURE = 1700;
const MAX_TEMPEARTURE = 6500;

type ColorSelectorProps = React.PropsWithoutRef<{
	onChangeHSV?: (hue: number, saturation: number) => void,
	onChangeRGB?: (red: number, green: number, blue: number) => void,
	onChangeTemperature?: (temperature: number) => void,
}>;

type ColorSelectorComponent = React.FunctionComponent<ColorSelectorProps>;

const ColorSelector: ColorSelectorComponent = ({
	onChangeHSV = () => {},
	onChangeRGB = () => {},
	onChangeTemperature = () => {},
}) => {
	const [hue, setHue] = React.useState(0);
	const [saturation, setSaturation] = React.useState(0);
	const { settings } = useSettings();
	const rgbValue = React.useRef<{ r: number, g: number, b: number }>({ r: 0, g: 0, b: 0 });

	function handleSaturationChange (x: number) {
		const newSaturation = x * MAX_SATURATION;
		setSaturation(newSaturation);
		onChangeHSV(hue, newSaturation);
	}

	function handleHueChange (x: number) {
		const newHue = x * MAX_HUE;
		setHue(newHue);
		onChangeHSV(newHue, saturation);
	}

	function getRGB () {
		const rgb = rgbValue.current;
		const r = Math.floor(rgb.r * MAX_RED);
		const g = Math.floor(rgb.g * MAX_GREEN);
		const b = Math.floor(rgb.b * MAX_BLUE);
		return [r, g, b] as const;
	}

	function handleRedChange (red: number) {
		rgbValue.current.r = red;
		const rgb = getRGB();
		onChangeRGB(...rgb);
	}

	function handleGreenChange (green: number) {
		rgbValue.current.g = green;
		const rgb = getRGB();
		onChangeRGB(...rgb);
	}

	function handleBlueChange (blue: number) {
		rgbValue.current.b = blue;
		const rgb = getRGB();
		onChangeRGB(...rgb);
	}

	function handleColorTemperatureChange (x: number) {
		const temperature = Math.max(
			Math.min(Math.round(x * (MAX_TEMPEARTURE - MIN_TEMPERATURE) + MIN_TEMPERATURE), 6500)
			, 0,
		);
		onChangeTemperature(temperature);
	}

	const getSaturationFunc = React.useMemo(
		() => (x: number) => hsv2rgb(hue, x * MAX_SATURATION, MAX_VALUE),
		[hue],
	);
	const getHueFunc = React.useMemo(
		() => (x: number) => hsv2rgb(x * MAX_HUE, MAX_SATURATION, MAX_VALUE),
		[],
	);
	const getRedFunc = React.useMemo(() => (x: number) => [x * MAX_RED, 0, 0] as const, []);
	const getGreenFunc = React.useMemo(() => (x: number) => [0, x * MAX_GREEN, 0] as const, []);
	const getBlueFunc = React.useMemo(() => (x: number) => [0, 0, x * MAX_BLUE] as const, []);

	const getTempeartureFunc = React.useMemo(() => (x: number) => {
		const colorTemperature = x * (MAX_TEMPEARTURE - MIN_TEMPERATURE) + MIN_TEMPERATURE;
		const { red, green, blue } = colorTemperature2rgb(colorTemperature);
		return [red, green, blue] as [number, number, number];
	}, []);

	function renderColorSelector () {
		if (settings.colorMode === `hsv`) {
			return <>
				<StripColor
					onChange={handleSaturationChange}
					getColor={getSaturationFunc}
				/>
				<StripColor
					onChange={handleHueChange}
					getColor={getHueFunc}
				/>
			</>;
		} else if (settings.colorMode === `rgb`) {
			return <>
				<StripColor
					onChange={handleRedChange}
					getColor={getRedFunc}
				/>
				<StripColor
					onChange={handleGreenChange}
					getColor={getGreenFunc}
				/>
				<StripColor
					onChange={handleBlueChange}
					getColor={getBlueFunc}
				/>
			</>;
		} else if (settings.colorMode === `temperature`) {
			return <StripColor
				onChange={handleColorTemperatureChange}
				getColor={getTempeartureFunc}
			/>;
		} else throw new Error(`Unknown color mode setting`);
	}

	return (
		<Root>
			{renderColorSelector()}
		</Root>
	);
};

export default ColorSelector;
