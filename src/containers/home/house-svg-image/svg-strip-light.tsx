import React, { FC } from 'react';
import { useLamps } from '../../../contexts/lamps';

import hsv2Rgb from 'hsv-rgb';
import { colorTemperature2rgb } from 'color-temperature';

const TOTAL_BRIGHTNESS_STAGES = 10;
const TICK_SIZE = 0.05;

export const SVGStripLight: FC<{
	x: number;
	y: number;
	lampId: number;
	onSelect?: () => void;
}> = ({ lampId, x, y, onSelect = () => {} }) => {
	const { findLampById, isLampSetAsTarget } = useLamps();

	const lamp = findLampById(lampId);

	function calculateLampColor() {
		function number2hex(num: number) {
			return num.toString(16).padStart(2, '0');
		}

		if (!lamp) return 'transparent';
		if (lamp.colorMode === 'rgb') {
			return `#${lamp.rgb.toString(16).padStart(6, '0')}`;
		} else if (lamp.colorMode === 'hsv') {
			const [red, green, blue] = hsv2Rgb(lamp.hue, lamp.saturation, 100);
			return `#${number2hex(red)}${number2hex(green)}${number2hex(blue)}`;
		} else {
			const { blue, green, red } = colorTemperature2rgb(lamp.colorTemperature);
			return `#${number2hex(red)}${number2hex(green)}${number2hex(blue)}`;
		}
	}

	function calculateLampBrightnessStage() {
		if (!lamp) return 0;
		if (!lamp.isPowerOn) return 0;
		return Math.floor((lamp.bright / 100) * TOTAL_BRIGHTNESS_STAGES);
	}

	function renderTicks() {
		const brightnessStage = calculateLampBrightnessStage();
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
	}

	function renderMusicNote() {
		if (!lamp || !lamp.isMusicModeOn) return null;
		return <use href="#music-note" x={x + 2.5} y={y + 11} width="5" height="5" />;
	}

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
			{renderMusicNote()}
			{renderTicks()}
			<use fill={calculateLampColor()} href="#lampstand" x={x} y={y} width="10" height="10" />
		</>
	);
};
