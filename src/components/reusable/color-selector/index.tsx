import React from 'react';
import styled from 'styled-components';
import rawHsv2rgb from 'hsv-rgb';
import rawRgb2hsv from 'rgb-hsv';
import { colorTemperature2rgb, rgb2colorTemperature } from 'color-temperature';
import SelectRGB from './select-rgb';
import SelectHSV from './select-hsv';
import SelectTemperature from './select-temperature';

const Root = styled.div`
	display: flex;
`;

const ColorSample = styled.div`
	width: 10px;
	height: 100%;
	margin-right: 8px;
	border: 1px solid rgba(0, 0, 0, 0.3);
`;

const ColorSelectorsContainer = styled.div`
	width: 100%;
`;

function hsv2rgb(hsv: HSV) {
	const [red, green, blue] = rawHsv2rgb(hsv.hue, hsv.saturation, 100);
	return limitRGB({ red, green, blue });
}

function rgb2hsv(rgb: RGB) {
	const [hue, saturation] = rawRgb2hsv(rgb.red, rgb.green, rgb.blue);
	return limitHSV({ hue, saturation });
}

const MAX_HUE = 359;
const MAX_SATURATION = 100;
const MAX_RED = 255;
const MAX_GREEN = 255;
const MAX_BLUE = 255;
const MIN_TEMPERATURE = 1700;
const MAX_TEMPEARTURE = 6500;

function limitTemperature(temperature: number) {
	return Math.min(MAX_TEMPEARTURE, Math.max(MIN_TEMPERATURE, Math.round(temperature)));
}

function limitRGB(rgb: RGB) {
	return {
		red: Math.min(MAX_RED, Math.max(0, Math.round(rgb.red))),
		green: Math.min(MAX_GREEN, Math.max(0, Math.round(rgb.green))),
		blue: Math.min(MAX_BLUE, Math.max(0, Math.round(rgb.blue))),
	};
}

function limitHSV(hsv: HSV) {
	return {
		hue: Math.min(MAX_HUE, Math.max(0, Math.round(hsv.hue))),
		saturation: Math.min(MAX_SATURATION, Math.max(0, Math.round(hsv.saturation))),
	};
}

export type RGB = { red: number; green: number; blue: number };
export type HSV = { hue: number; saturation: number };
export type Temperature = number;

type ColorMode = 'hsv' | 'rgb' | 'temperature';

type ColorSelectorProps = React.PropsWithoutRef<{
	onChangeHSV?: (hue: number, saturation: number) => void;
	onChangeRGB?: (red: number, green: number, blue: number) => void;
	onChangeTemperature?: (temperature: number) => void;
	colorMode: ColorMode;
	defaultValue?: RGB | HSV | Temperature;
}>;

function isDefaultTypeRGB(defaultValue?: ColorSelectorProps['defaultValue']): defaultValue is RGB {
	return Boolean(defaultValue && (defaultValue as any).red !== undefined);
}

function isDefaultTypeHSV(defaultValue?: ColorSelectorProps['defaultValue']): defaultValue is HSV {
	return Boolean(defaultValue && (defaultValue as any).hue !== undefined);
}

function isDefaultTypeTemperature(
	defaultValue?: ColorSelectorProps['defaultValue'],
): defaultValue is Temperature {
	return typeof defaultValue === 'number';
}

type ColorSelectorComponent = React.FunctionComponent<ColorSelectorProps>;

const ColorSelector: ColorSelectorComponent = ({
	onChangeHSV = () => {},
	onChangeRGB = () => {},
	onChangeTemperature = () => {},
	colorMode,
	defaultValue,
}) => {
	function parseDefaultValue() {
		let rgb: RGB = { red: 0, green: 0, blue: 0 };
		let temperature: Temperature = limitTemperature(0);
		let hsv: HSV = { hue: 0, saturation: 0 };
		if (isDefaultTypeTemperature(defaultValue)) {
			temperature = limitTemperature(defaultValue);
			rgb = limitRGB(colorTemperature2rgb(temperature));
			hsv = limitHSV(rgb2hsv(rgb));
		} else if (isDefaultTypeHSV(defaultValue)) {
			hsv = limitHSV(defaultValue);
			rgb = limitRGB(hsv2rgb(hsv));
			temperature = limitTemperature(rgb2colorTemperature(rgb));
		} else if (isDefaultTypeRGB(defaultValue)) {
			rgb = limitRGB(defaultValue);
			hsv = limitHSV(rgb2hsv(rgb));
			temperature = limitTemperature(rgb2colorTemperature(rgb));
		}
		return { rgb, temperature, hsv };
	}

	const parsedDefaultValue = React.useMemo(() => {
		const parsedDefaultValue = parseDefaultValue();
		return parsedDefaultValue;
	}, []);

	const colorSampleRef = React.useRef<null | HTMLDivElement>(null);
	const rgbValue = React.useRef<RGB>(parsedDefaultValue.rgb);
	const hsvValue = React.useRef<HSV>(parsedDefaultValue.hsv);
	const temperatureValue = React.useRef<number>(parsedDefaultValue.temperature);

	function updateColorSample(colorModeVar: ColorMode = colorMode) {
		const style = colorSampleRef.current!.style;
		let rgb: RGB;
		if (colorModeVar === 'hsv') {
			rgb = hsv2rgb(hsvValue.current);
		} else if (colorModeVar === 'rgb') {
			rgb = hsv2rgb(rgb2hsv(rgbValue.current));
		} else {
			rgb = colorTemperature2rgb(temperatureValue.current);
		}
		style.backgroundColor = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
	}

	React.useEffect(() => {
		updateColorSample();
	}, [colorMode]);

	function handleRGBChange(newRGB: RGB) {
		rgbValue.current = newRGB;
		updateColorSample();
		hsvValue.current = rgb2hsv(newRGB);
		temperatureValue.current = limitTemperature(rgb2colorTemperature(newRGB));
		onChangeRGB(newRGB.red, newRGB.green, newRGB.blue);
	}

	function handleHSVChange(newHSV: HSV) {
		hsvValue.current = newHSV;
		updateColorSample();
		rgbValue.current = hsv2rgb(newHSV);
		temperatureValue.current = limitTemperature(rgb2colorTemperature(rgbValue.current));
		onChangeHSV(newHSV.hue, newHSV.saturation);
	}

	function handleColorTemperatureChange(temperature: Temperature) {
		temperatureValue.current = temperature;
		updateColorSample();
		rgbValue.current = colorTemperature2rgb(temperature);
		hsvValue.current = rgb2hsv(rgbValue.current);
		onChangeTemperature(temperature);
	}

	function renderColorSelector() {
		if (colorMode === `hsv`) {
			return <SelectHSV onChange={handleHSVChange} defaultValue={hsvValue.current} />;
		} else if (colorMode === `rgb`) {
			return <SelectRGB onChange={handleRGBChange} defaultValue={rgbValue.current} />;
		} else if (colorMode === `temperature`) {
			return (
				<SelectTemperature
					onChange={handleColorTemperatureChange}
					defaultValue={temperatureValue.current}
				/>
			);
		} else throw new Error(`Unknown color mode setting`);
	}

	return (
		<Root>
			<ColorSample ref={colorSampleRef} />
			<ColorSelectorsContainer>{renderColorSelector()}</ColorSelectorsContainer>
		</Root>
	);
};

export default ColorSelector;
