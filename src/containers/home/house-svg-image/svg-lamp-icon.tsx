import React, { FC } from 'react';
import { useLamps } from '../../../contexts/lamps';

import hsv2Rgb from 'hsv-rgb';
import { colorTemperature2rgb } from 'color-temperature';

const TOTAL_BRIGHTNESS_STAGES = 30;
const TICK_SIZE = 0.05;

const SVGLampIcon: FC<{
	x: number;
	y: number;
	lampId: number;
}> = ({ lampId, x, y }) => {
	const { findLampById } = useLamps();

	const lamp = findLampById(lampId);

	function calculateLampColor() {
		function number2hex(num: number) {
			return num.toString(16).padStart(2, '0');
		}

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
	}

	function calculateLampBrightnessStage() {
		if (!lamp) return 0;

		if (!lamp.isPowerOn) return 0;

		for (let i = 0; i < TOTAL_BRIGHTNESS_STAGES; i++) {
			const stageThreshold = (100 / TOTAL_BRIGHTNESS_STAGES) * i;
			if (stageThreshold > lamp.bright) return i;
		}

		return TOTAL_BRIGHTNESS_STAGES;
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
					y={y - TICK_SIZE * i}
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
			<use fill={calculateLampColor()} href="#light" x={x} y={y} width="10" height="10" />
			{renderMusicNote()}
			{renderTicks()}
		</>
	);
};

export default SVGLampIcon;
