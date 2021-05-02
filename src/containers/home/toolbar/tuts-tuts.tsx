import { Slider, Switch } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLamps } from '../../../contexts/lamps';
import { useSendCommand } from '../../../libs/hooks/use-send-command';
import { getRandomInt } from '../../../libs/math';

const Root = styled.div``;

const SliderContainer = styled.div`
	display: grid;
	grid-template-columns: max-content auto max-content;
	column-gap: 1rem;
`;

type TutsTutsProps = React.PropsWithoutRef<{
	minFreq: number;
	maxFreq: number;
}>;

type TutsTutsComponent = React.FunctionComponent<TutsTutsProps>;

const TutsTuts: TutsTutsComponent = ({ maxFreq, minFreq }) => {
	const { targetLamps } = useLamps();
	const [sendCommand] = useSendCommand();
	const [isTutsTutsOn, setIsTutsTutsOn] = useState(false);
	const [tutsTutsAreIndependent, setTutsTutsAreIndependent] = useState(false);
	const [tutsFrequencia, setTutsFrequencia] = useState(1000);
	const [intervalHandle, setIntervalHandle] = useState<number | null>(null);

	function handleTutsTutsChange(_event: React.ChangeEvent<HTMLElement>, checked: boolean) {
		setIsTutsTutsOn(checked);
		triggerTutsTutsInterval(checked, tutsTutsAreIndependent, tutsFrequencia);
	}

	function handleTutsTutsIndependentChange(
		_event: React.ChangeEvent<HTMLElement>,
		checked: boolean,
	) {
		setTutsTutsAreIndependent(checked);
		triggerTutsTutsInterval(isTutsTutsOn, checked, tutsFrequencia);
	}

	function handleTutsFrequencia(_event: React.ChangeEvent<{}>, newValue: number | number[]) {
		if (newValue instanceof Array) {
			console.warn(`wtf did I just receive`);
			return;
		}
		const newFreq = newValue * 1000;
		setTutsFrequencia(newFreq);
		triggerTutsTutsInterval(isTutsTutsOn, tutsTutsAreIndependent, newFreq);
	}

	function triggerTutsTutsInterval(
		tutsTuts: boolean,
		tutsTutsAreIndependent: boolean,
		tutsFrequencia: number,
	) {
		clearInterval(intervalHandle || 0);
		if (tutsTuts) {
			let intervalHandler;
			if (tutsTutsAreIndependent) {
				intervalHandler = () => {
					targetLamps.forEach(targetLamp =>
						sendCommand([targetLamp], `set_hsv`, [
							getRandomInt(0, 360),
							getRandomInt(0, 101),
							`sudden`,
							30,
						]),
					);
				};
			} else {
				intervalHandler = () => {
					sendCommand(targetLamps, `set_hsv`, [
						getRandomInt(0, 360),
						getRandomInt(0, 101),
						`sudden`,
						30,
					]);
				};
			}
			const newIntervalHandle = setInterval(intervalHandler, tutsFrequencia);
			setIntervalHandle((newIntervalHandle as unknown) as number);
		} else {
			setIntervalHandle(null);
		}
	}

	useEffect(() => {
		return () => clearInterval(intervalHandle || 0);
	}, [intervalHandle]);

	useEffect(() => {
		triggerTutsTutsInterval(isTutsTutsOn, tutsTutsAreIndependent, tutsFrequencia);
	}, [targetLamps.toString()]);

	return (
		<Root>
			Tuts tuts
			<Switch
				checked={isTutsTutsOn}
				onChange={handleTutsTutsChange}
				name="setTutsTuts"
				color="primary"
			/>
			<br />
			Tuts tuts independentes
			<Switch
				checked={tutsTutsAreIndependent}
				onChange={handleTutsTutsIndependentChange}
				name="setTutsTutsIndependent"
				color="primary"
			/>
			<br />
			Tutsfrequencia:
			<SliderContainer>
				{minFreq}s
				<Slider
					min={minFreq}
					max={maxFreq}
					valueLabelDisplay="auto"
					defaultValue={1}
					step={0.1}
					onChange={handleTutsFrequencia}
				/>
				{maxFreq}s
			</SliderContainer>
		</Root>
	);
};

export default TutsTuts;
