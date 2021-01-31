import { Slider } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import BrightnessLow from '@material-ui/icons/BrightnessLow';
import BrightnessHigh from '@material-ui/icons/BrightnessHigh';
import SelectLamps from '../../components/reusable/select-lamps';
import Button from '../../components/reusable/button';
import { useSendCommand } from '../../libs/use-send-command';
import { useDebounce } from '../../libs/use-debounce';
import { SelectHSV } from '../../components/reusable/select-hsv';
import { useEffectAsync } from '../../libs/useEffectAsync';

const Root = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

const SliderContainer = styled.div`
	display: grid;
	grid-template-columns: max-content auto max-content;
	column-gap: 1rem;
	margin: 2rem;
	width: 100%;
	max-width: 300px;
`;

const ButtonsContainer = styled.div`
	display: grid;
	grid-template-columns: max-content max-content;
	column-gap: 1rem;
`;

type ControlPageProps = React.PropsWithoutRef<{
}>;

type ControlPageComponent = React.FunctionComponent<ControlPageProps>;

const ControlPage: ControlPageComponent = ({
}) => {
	const [targetLamps, setTargetLamps] = React.useState<string[]>([]);
	const [sendCommand] = useSendCommand();
	const [targetBrightness, setTargetBrightness] = React.useState<number>(100);
	const [colors, setColors] = React.useState<{ hue: number, saturation: number }>({ hue: 0, saturation: 0 });

	useEffectAsync(async () => {
		await sendCommand(targetLamps, 'set_bright', [targetBrightness]);
	}, [targetBrightness]);

	useEffectAsync(async () => {
		await sendCommand(targetLamps, 'set_hsv', [colors.hue, colors.saturation]);
	}, [colors]);

	const handleBrightness = useDebounce((_event: React.ChangeEvent<{}>, newValue: number | number[]) => {
		if (newValue instanceof Array) {
			console.log('wtf did I just receive');
			return;
		}

		setTargetBrightness(newValue);
	}, 100);

	async function handleButtonClick (action: string) {
		await sendCommand(targetLamps, 'set_power', [action, 'sudden', 30, 0]);
	}

	return (
		<Root>
			<SliderContainer>
				<BrightnessLow />
				<Slider min={1} onChange={handleBrightness} />
				<BrightnessHigh />
			</SliderContainer>
			<ButtonsContainer>
				<Button content='off' onClick={() => handleButtonClick('off')} />
				<Button content='on' onClick={() => handleButtonClick('on')} />
			</ButtonsContainer>
			<SelectHSV onChange={useDebounce(setColors, 100)} />
			<SelectLamps onChange={setTargetLamps} />
		</Root>
	);
}

export default ControlPage;