import React, { FC } from 'react';
import styled from 'styled-components';
import BrightnessSlider from '../../../components/reusable/brightness-slider';
import Button from '../../../components/reusable/button';
import ColorSelector from '../../../components/reusable/color-selector';
import { useLamps } from '../../../contexts/lamps';
import { useMusicMode } from '../../../contexts/music-mode';
import { useSettings } from '../../../contexts/settings';
import { useDebounce } from '../../../libs/hooks/use-debounce';
import { useSendCommand } from '../../../libs/hooks/use-send-command';

const Root = styled.div`
	padding: 0 16px;
	width: 100%;
	max-width: 300px;
	margin: 1rem 0;
	display: flex;
	flex-direction: column;
	row-gap: 32px;
`;

const OnOffContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 8px;
	margin: 8px 0;
	width: 100%;
`;

const Toolbar: FC<{}> = () => {
	const {
		settings: { colorMode },
	} = useSettings();
	const { targetLamps, mediumTargetLampsColor } = useLamps();
	const sendCommand = useSendCommand();
	const oldBrightness = React.useRef(0);
	const { settings } = useSettings();
	const { musicMode } = useMusicMode();

	const debounceTime = musicMode ? 100 : 1000;

	React.useEffect(() => {
		oldBrightness.current = 0;
	}, [targetLamps.toString()]);

	const handleBrightness = useDebounce(async (newValue: number) => {
		const oldValue = oldBrightness.current;
		oldBrightness.current = newValue;

		if (newValue === 0) await sendCommand(targetLamps, `set_power`, [`off`, `sudden`, 30, 0]);
		else {
			if (oldValue === 0) await sendCommand(targetLamps, `set_power`, [`on`, `sudden`, 30, 0]);
			await sendCommand(targetLamps, `set_bright`, [newValue]);
		}
	}, debounceTime);

	const handleColorChange = useDebounce(async (hue: number, saturation: number) => {
		await sendCommand(targetLamps, `set_hsv`, [hue, saturation]);
	}, debounceTime);

	const handleTemperatureChange = useDebounce(async (temperature: number) => {
		await sendCommand(targetLamps, `set_ct_abx`, [temperature]);
	}, debounceTime);

	const handleRGBChange = useDebounce(async (r: number, g: number, b: number) => {
		await sendCommand(targetLamps, `set_rgb`, [r * 0x010000 + g * 0x000100 + b, `smooth`, 200]);
	}, debounceTime);

	async function handleLampOff() {
		await sendCommand(targetLamps, `set_power`, [`off`, `sudden`, 30, 0]);
	}

	async function handleLampOn() {
		await sendCommand(targetLamps, `set_power`, [`on`, `sudden`, 30, 0]);
	}

	const handleRandomColorClick = useDebounce(async () => {
		const hue = Math.floor(Math.random() * 359);
		await sendCommand(targetLamps, `set_hsv`, [hue, 100]);
	}, 1000);

	if (targetLamps.length === 0) return null;

	return (
		<Root>
			<ColorSelector
				onChangeHSV={handleColorChange}
				onChangeTemperature={handleTemperatureChange}
				onChangeRGB={handleRGBChange}
				colorMode={colorMode}
			/>
			<BrightnessSlider onChange={handleBrightness} />
			{settings.showOnOff && (
				<OnOffContainer>
					<Button
						backgroundColor={theme => theme.colors.error.main}
						textColor="white"
						fullWidth
						onClick={handleLampOff}
					>
						Off
					</Button>
					<Button
						backgroundColor={theme => theme.colors.success.main}
						textColor="white"
						fullWidth
						onClick={handleLampOn}
					>
						On
					</Button>
				</OnOffContainer>
			)}
			{settings.showRandomColorButton && (
				<Button
					backgroundColor={`rgb(${mediumTargetLampsColor[0]}, ${mediumTargetLampsColor[1]}, ${mediumTargetLampsColor[2]})`}
					fullWidth
					style={{ margin: '8px 0' }}
					onClick={handleRandomColorClick}
				>
					Cor aleatória
				</Button>
			)}
		</Root>
	);
};

export default Toolbar;
