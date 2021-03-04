import React from 'react';
import StripColor from '../strip-color';
import { colorTemperature2rgb } from 'color-temperature';
import { Temperature } from '.';

const MIN_TEMPERATURE = 1700;
const MAX_TEMPEARTURE = 6500;

type SelectTemperatureProps = React.PropsWithoutRef<{
	defaultValue?: Temperature,
	onChange?: (rgb: Temperature) => void,
}>;

type SelectTemperatureComponent = React.FunctionComponent<SelectTemperatureProps>;

const SelectTemperature: SelectTemperatureComponent = ({
	defaultValue,
	onChange = () => {},
}) => {
	function handleColorTemperatureChange (x: number) {
		const temperature = x * (MAX_TEMPEARTURE - MIN_TEMPERATURE) + MIN_TEMPERATURE;
		const roundedTemperature = Math.max(MIN_TEMPERATURE, Math.min(MAX_TEMPEARTURE, Math.round(temperature)));
		onChange(roundedTemperature);
	}

	const getTempeartureFunc = React.useMemo(() => (x: number) => {
		const colorTemperature = x * (MAX_TEMPEARTURE - MIN_TEMPERATURE) + MIN_TEMPERATURE;
		const { red, green, blue } = colorTemperature2rgb(colorTemperature);
		return [red, green, blue] as const;
	}, []);

	return <StripColor
		onChange={handleColorTemperatureChange}
		getColor={getTempeartureFunc}
		defaultValue={((defaultValue || MIN_TEMPERATURE) - MIN_TEMPERATURE) / (MAX_TEMPEARTURE - MIN_TEMPERATURE)}
	/>
}

export default SelectTemperature;