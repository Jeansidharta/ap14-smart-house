import { Slider } from '@material-ui/core';
import BrightnessHigh from '@material-ui/icons/BrightnessHigh';
import BrightnessLow from '@material-ui/icons/BrightnessLow';
import React from 'react';
import styled from 'styled-components';
import { useLamps } from '../../../contexts/lamps';
import { useDebounce } from '../../../libs/hooks/use-debounce';
import { useSendCommand } from '../../../libs/hooks/use-send-command';
import ColorSelector from './color-selector';
import TemperatureSelector from './temperature-selector';
import TutsTuts from './tuts-tuts';

const Root = styled.div`
	padding: 0 16px;
	width: 100%;
	max-width: 300px;
`;

const SliderContainer = styled.div`
	display: grid;
	grid-template-columns: max-content auto max-content;
	column-gap: 1rem;
`;

type ToolbarProps = React.PropsWithoutRef<{
}>;

type ToolbarComponent = React.FunctionComponent<ToolbarProps>;

const Toolbar: ToolbarComponent = ({  }) => {
	const { targetLamps } = useLamps();
	const [sendCommand] = useSendCommand();
	const oldBrightness = React.useRef(0);

	React.useEffect(() => {
		oldBrightness.current = 0;
	}, [targetLamps.toString()]);

	const handleBrightness = useDebounce(async (_event: React.ChangeEvent<{}>, newValue: number | number[]) => {
		if (newValue instanceof Array) {
			console.log('wtf did I just receive');
			return;
		}
		const oldValue = oldBrightness.current;
		oldBrightness.current = newValue;

		if (newValue === 0) await sendCommand(targetLamps, 'set_power', ['off', 'sudden', 30, 0]);
		else {
			if (oldValue === 0) await sendCommand(targetLamps, 'set_power', ['on', 'sudden', 30, 0]);
			await sendCommand(targetLamps, 'set_bright', [newValue]);
		}
	}, 1000);

	const handleColorChange = useDebounce(async (hue: number, saturation: number) => {
		await sendCommand(targetLamps, 'set_hsv', [hue, saturation]);
	}, 1000);

	const handleTemperatureChange = useDebounce(async (temperature: number) => {
		console.log(temperature);
		await sendCommand(targetLamps, 'set_ct_abx', [temperature]);
	}, 1000);

	if (targetLamps.length === 0) return null;

	return (
		<Root>
			<TemperatureSelector onChange={handleTemperatureChange} />
			<ColorSelector onChange={handleColorChange} />
			<SliderContainer>
				<BrightnessLow />
				<Slider onChange={handleBrightness} />
				<BrightnessHigh />
			</SliderContainer>
			<TutsTuts
				minFreq={0.2}
				maxFreq={5}
			/>
		</Root>
	);
}

export default Toolbar;