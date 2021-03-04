import React from 'react';
import styled from 'styled-components';

import { Slider } from '@material-ui/core';
import BrightnessHigh from '@material-ui/icons/BrightnessHigh';
import BrightnessLow from '@material-ui/icons/BrightnessLow';

const Root = styled.div`
	display: grid;
	grid-template-columns: max-content auto max-content;
	column-gap: 1rem;
	align-items: center;
`;

type BrightnessSliderProps = React.PropsWithoutRef<{
	onChange?: (newBrightness: number) => void,
	defaultValue?: number,
}>;

type BrightnessSliderComponent = React.FunctionComponent<BrightnessSliderProps>;

const BrightnessSlider: BrightnessSliderComponent = ({
	onChange = () => {},
	defaultValue,
}) => {
	function handleChangeBrightness (_event: React.ChangeEvent<{}>, newValue: number | number[]) {
		if (newValue instanceof Array) {
			console.warn(`wtf did I just receive`);
			return;
		}
		onChange(newValue);
	}

	return (
		<Root>
			<BrightnessLow />
			<Slider
				onChange={handleChangeBrightness}
				valueLabelDisplay='auto'
				defaultValue={defaultValue || 0}
			/>
			<BrightnessHigh />
		</Root>
	);
};

export default BrightnessSlider;
