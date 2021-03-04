import React from 'react';
import styled from 'styled-components';
import BrightnessSlider from '../../../components/reusable/brightness-slider';
import Button from '../../../components/reusable/button';
import ColorSelector from '../../../components/reusable/color-selector';
import { useLamps } from '../../../contexts/lamps';
import { useSettings } from '../../../contexts/settings';
import { useDebounce } from '../../../libs/hooks/use-debounce';
import { useSendCommand } from '../../../libs/hooks/use-send-command';

const Root = styled.div`
	padding: 0 16px;
	width: 100%;
	max-width: 300px;
	margin: 1rem 0l
`;

const OnOffContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 8px;
	margin: 8px 0;
	width: 100%;
`;

type ToolbarProps = React.PropsWithoutRef<{
}>;

type ToolbarComponent = React.FunctionComponent<ToolbarProps>;

const Toolbar: ToolbarComponent = () => {
	const { settings: { colorMode } } = useSettings();
	const { targetLamps } = useLamps();
	const [sendCommand] = useSendCommand();
	const oldBrightness = React.useRef(0);
	const { settings } = useSettings();

	React.useEffect(() => {
		oldBrightness.current = 0;
	}, [targetLamps.toString()]);

	const handleBrightness = useDebounce(
		async (newValue: number) => {
			const oldValue = oldBrightness.current;
			oldBrightness.current = newValue;

			if (newValue === 0) await sendCommand(targetLamps, `set_power`, [`off`, `sudden`, 30, 0]);
			else {
				if (oldValue === 0) await sendCommand(targetLamps, `set_power`, [`on`, `sudden`, 30, 0]);
				await sendCommand(targetLamps, `set_bright`, [newValue]);
			}
		},
		1000,
	);

	const handleColorChange = useDebounce(async (hue: number, saturation: number) => {
		await sendCommand(targetLamps, `set_hsv`, [hue, saturation]);
	}, 1000);

	const handleTemperatureChange = useDebounce(async (temperature: number) => {
		await sendCommand(targetLamps, `set_ct_abx`, [temperature]);
	}, 1000);

	const handleRGBChange = useDebounce(async (r: number, g: number, b: number) => {
		await sendCommand(targetLamps, `set_rgb`, [
			r * 0x010000 + g * 0x000100 + b,
			`smooth`,
			200,
		]);
	}, 1000);

	async function handleLampOff () {
		await sendCommand(targetLamps, `set_power`, [`off`, `sudden`, 30, 0]);
	}

	async function handleLampOn () {
		await sendCommand(targetLamps, `set_power`, [`on`, `sudden`, 30, 0]);
	}

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
			{settings.showOnOff && <OnOffContainer>
				<Button
					backgroundColor={theme => theme.colors.error.main}
					textColor='white'
					fullWidth
					onClick={handleLampOff}
				>
					Off
				</Button>
				<Button
					backgroundColor={theme => theme.colors.success.main}
					textColor='white'
					fullWidth
					onClick={handleLampOn}
				>
					On
				</Button>
			</OnOffContainer>}
			{/* <TutsTuts
				minFreq={0.2}
				maxFreq={5}
			/> */}
		</Root>
	);
};

export default Toolbar;
