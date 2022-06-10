import React, { FC } from 'react';
import styled from 'styled-components';

import { Slider } from '@mui/material';
import BrightnessHigh from '@mui/icons-material/BrightnessHigh';
import BrightnessLow from '@mui/icons-material/BrightnessLow';

const Root = styled.div`
	display: grid;
	grid-template-columns: max-content auto max-content;
	column-gap: 1rem;
	align-items: center;
`;

const BrightnessSlider: FC<{
	onChange?: (newBrightness: number) => void;
	defaultValue?: number;
}> = ({ onChange = () => {}, defaultValue }) => {
	function handleChangeBrightness(_event: Event, newValue: number | number[]) {
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
				valueLabelDisplay="auto"
				defaultValue={defaultValue || 0}
			/>
			<BrightnessHigh />
		</Root>
	);
};

export default BrightnessSlider;
