import { colorTemperature2rgb } from 'color-temperature';
import React from 'react';
import styled from 'styled-components';
import StripColor from '../../../components/reusable/strip-color';

const Root = styled.div`
`;

const MIN_TEMPERATURE = 1700;
const MAX_TEMPEARTURE = 6500;

type TemperatureSelectorProps = React.PropsWithoutRef<{
	onChange?: (temperature: number) => void,
}>;

type TemperatureSelectorComponent = React.FunctionComponent<TemperatureSelectorProps>;

const TemperatureSelector: TemperatureSelectorComponent = ({
	onChange = () => {},
}) => {
	function ct2RGB (x: number) {
		const { red, green, blue } = colorTemperature2rgb(x * 2 * (MAX_TEMPEARTURE - MIN_TEMPERATURE) + MIN_TEMPERATURE);
		return [red, green, blue] as [number, number, number];
	}

	function handleColorTemperatureChange (x: number) {
		const temperature = Math.max(Math.min(Math.round(x * (MAX_TEMPEARTURE - MIN_TEMPERATURE) + MIN_TEMPERATURE), 6500), 0);
		onChange(temperature);
	}

	return (
		<Root>
			<StripColor
				onChange={handleColorTemperatureChange}
				getColor={React.useMemo(() => ct2RGB, [])}
			/>
		</Root>
	);
}

export default TemperatureSelector;