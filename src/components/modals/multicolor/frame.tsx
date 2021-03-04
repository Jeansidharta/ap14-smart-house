import { TextField } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import type { FrameData } from '.';
import BrightnessSlider from '../../reusable/brightness-slider';
import Select from '../../reusable/select';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import Close from '@material-ui/icons/Close';
import ColorSelector from '../../reusable/color-selector';
import { useDebounce } from '../../../libs/hooks/use-debounce';
import hsv2rgb from 'hsv-rgb';
import rgb2hsv from 'rgb-hsv';
import { useEffectUpdate } from '../../../libs/hooks/use-effect-update';

const Root = styled.div`
	padding: 16px 16px 0 16px;
	margin: 16px;
	background-color: ${props => props.theme.colors.gray.light};
	width: 100%;
	border-radius: 8px;
	display: grid;
	row-gap: 8px;
`;

const IconButton = styled.button`
	background-color: transparent;
	padding: 4px;
	border: 0;
`;

const IconButtonsContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	margin-top: 4px;
`;

const FrameIndex = styled.h2`
	margin: 0;
	text-align: center;
	font-size: 18px;
`;

type FrameProps = React.PropsWithoutRef<{
	initialFrameData: FrameData,
	onChangeFrameData?: (newFrameData: Partial<FrameData>) => void,
	onDeleteFrame?: () => void,
	onCopyFrame?: () => void,
	index: number,
}>;

type FrameComponent = React.FunctionComponent<FrameProps>;

type ColorMode = 'hsv' | 'rgb' | 'temperature' | 'sleep' | null;

function colorMode2Number (colorMode: ColorMode) {
	if (colorMode === `rgb`) return 1;
	else if (colorMode === `temperature`) return 2;
	else if (colorMode === `hsv`) return 3;
	else if (colorMode === 'sleep') return 7;
	else return null;
}

function number2ColorMode (number: 1 | 2 | 3 | 7 | null): ColorMode {
	if (number === 1) return `rgb`;
	else if (number === 2) return `temperature`;
	else if (number === 3) return `hsv`;
	else if (number === 7) return `sleep`;
	else return null;
}

const Frame: FrameComponent = ({
	initialFrameData,
	onChangeFrameData = () => {},
	onDeleteFrame = () => {},
	onCopyFrame = () => {},
	index,
}) => {
	const [duration, setDuration] = React.useState<number>(initialFrameData.duration || 50);
	const [brightness, setBrightness] = React.useState<number>(initialFrameData.brightness || 100);
	const [colorMode, setColorMode] = React.useState<ColorMode | null>(
		number2ColorMode(initialFrameData.mode || null),
	);
	const [value, setValue] = React.useState<number>(0);

	function generateFrameData (): Partial<FrameData> {
		return {
			brightness,
			duration,
			mode: colorMode2Number(colorMode) || undefined,
			value,
		};
	}

	const handleBrightnessChange = useDebounce((newBrightnes: number) => {
		setBrightness(newBrightnes);
	}, 100);

	const handleDurationChange = useDebounce((event: React.ChangeEvent) => {
		const newDuration = Number((event.target as HTMLInputElement).value);
		setDuration(newDuration);
	}, 100);

	function handleChangeColorMode (newValue: ColorMode) {
		setColorMode(newValue);
	}

	const handleChangeValue = useDebounce((newValue: number) => {
		setValue(newValue);
	}, 100);

	useEffectUpdate(() => {
		onChangeFrameData(generateFrameData());
	}, [duration, brightness, colorMode, value]);

	function renderColorSelector () {
		function handleChangeHSV (hue: number, saturation: number) {
			const [r, g, b] = hsv2rgb(hue, saturation, 100);
			handleChangeRGB(r, g, b);
		}
		function handleChangeColorTemperature (temperature: number) {
			handleChangeValue(temperature);
		}
		function handleChangeRGB (r: number, g: number, b: number) {
			handleChangeValue(r * 0x10000 + g * 0x100 + b);
		}
		function getDefaultValue () {
			function number2RGB (number: number) {
				const red = Math.floor(number / 0x10000);
				const green = Math.floor((number - red * 0x10000) / 0x100);
				const blue = Math.floor(number - red * 0x10000 - green * 0x100);
				return { red, green, blue };
			}

			if (colorMode === 'rgb') {
				return number2RGB(initialFrameData.value || 0);
			} else if (colorMode === 'hsv') {
				const rgb = number2RGB(initialFrameData.value || 0);
				const [hue, saturation] = rgb2hsv(rgb.red, rgb.green, rgb.blue);
				return { hue, saturation };
			} else if (colorMode === 'temperature') {
				return initialFrameData.value || 0;
			} else return undefined;
		}

		if (colorMode === `sleep` || colorMode === null) {
			return null;
		} else {
			return <ColorSelector
				onChangeHSV={handleChangeHSV}
				onChangeTemperature={handleChangeColorTemperature}
				onChangeRGB={handleChangeRGB}
				colorMode={colorMode}
				defaultValue={getDefaultValue()}
			/>;
		}
	}

	return (
		<Root>
			<FrameIndex>Frame {index + 1}</FrameIndex>
			<BrightnessSlider
				onChange={handleBrightnessChange}
				defaultValue={React.useMemo(() => initialFrameData.brightness, [])}
			/>
			<TextField
				fullWidth
				label='duration (ms)'
				onChange={handleDurationChange}
				defaultValue={React.useMemo(() => initialFrameData.duration, [])}
				type='number'
				inputProps={{ min: `50` }}
			/>
			<Select
				fullWidth
				onChangeValue={handleChangeColorMode}
				defaultValue={React.useMemo(() => number2ColorMode(initialFrameData.mode || null)?.toString(), [])}
				label='Modo de cor'
				options={[
					{ text: `RGB`, value: `rgb` },
					{ text: `HSV`, value: `hsv` },
					{ text: `Color Temperature`, value: `temperature` },
					{ text: `Sleep`, value: `sleep` },
				]}
			/>
			{renderColorSelector()}
			<IconButtonsContainer>
				<IconButton onClick={onCopyFrame}>
					<FileCopyOutlined fontSize='small' />
				</IconButton>
				<IconButton onClick={onDeleteFrame}>
					<Close />
				</IconButton>
			</IconButtonsContainer>
		</Root>
	);
};

export default Frame;
