import React, { FC, useMemo } from 'react';
import { useLamps } from '../../../contexts/lamps';

import hsv2Rgb from 'hsv-rgb';
import { colorTemperature2rgb } from 'color-temperature';

const TOTAL_BRIGHTNESS_STAGES = 10;
const TICK_SIZE = 0.05;

function number2hex(num: number) {
	return num.toString(16).padStart(2, '0');
}

export const SVGStripLight: FC<{
	x: number;
	y: number;
	lampId: number;
	onSelect?: () => void;
}> = ({ lampId, x, y, onSelect = () => {} }) => {
	const { findLampById, isLampSetAsTarget } = useLamps();

	const lamp = findLampById(lampId);

	const lampColor = useMemo(() => {
		if (!lamp) return 'transparent';
		let color: string;
		if (lamp.colorMode === 'rgb') color = lamp.rgb.toString(16).padStart(6, '0');
		else if (lamp.colorMode === 'hsv') {
			const [red, green, blue] = hsv2Rgb(lamp.hue, lamp.saturation, 100);
			color = `${number2hex(red)}${number2hex(green)}${number2hex(blue)}`;
		} else {
			const { blue, green, red } = colorTemperature2rgb(lamp.colorTemperature);
			color = `${number2hex(red)}${number2hex(green)}${number2hex(blue)}`;
		}
		return '#' + color;
	}, [lamp]);

	const brightnessStage = useMemo(() => {
		if (!lamp) return 0;

		if (!lamp.isPowerOn) return 0;

		for (let i = 0; i < TOTAL_BRIGHTNESS_STAGES; i++) {
			const stageThreshold = (100 / TOTAL_BRIGHTNESS_STAGES) * i;
			if (stageThreshold > lamp.bright) return i;
		}

		return TOTAL_BRIGHTNESS_STAGES;
	}, [lamp]);

	const ticks = useMemo(() => {
		const ticks: React.ReactNode[] = [];
		for (let i = 0; i < brightnessStage; i++) {
			ticks.push(
				<use
					key={i}
					fill="black"
					href="#ticks"
					x={x - TICK_SIZE * i}
					y={y - 3 - TICK_SIZE * i}
					width={10 + 2 * TICK_SIZE * i}
					height={10 + 2 * TICK_SIZE * i}
				/>,
			);
		}
		return ticks;
	}, [brightnessStage]);

	const musicNote = useMemo(() => {
		if (!lamp || !lamp.isMusicModeOn) return null;
		return <use href="#music-note" x={x + 2.5} y={y + 11} width="5" height="5" />;
	}, [lamp]);

	return (
		<>
			<rect
				onClick={onSelect}
				x={x - 2}
				y={y - 6}
				width="14"
				height="18"
				stroke={isLampSetAsTarget(lampId) ? 'green' : 'transparent'}
				fill="white"
				style={{ cursor: 'pointer' }}
			/>
			{musicNote}
			{ticks}
			<use fill={lampColor} href="#lampstand" x={x} y={y} width="10" height="10" />
		</>
	);
};
