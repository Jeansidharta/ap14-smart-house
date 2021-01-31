import React from 'react';
import HSV2RGB from 'hsv-rgb';
import RGB2HSV from 'rgb-hsv';
import styled from 'styled-components';
import Select from '../select';
import Crosshair from '@material-ui/icons/Add';
import { Coords, useMouseDrag } from '../../../libs/use-mouse-drag';

const CROSSHAIR_SIZE = 14;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 100;

const Root = styled.div`
	display: flex;
	flex-direction: column;
`;

const Canvas = styled.canvas`
	cursor: pointer;
`;

const InputsContainer = styled.div`
	display: flex;
	width: 100%;
	justify-conten: space-between;
`;

const Input = styled.input`
	width: 100%;
`;

const CanvasContainer = styled.div`
	position: relative;
	overflow: hidden;
	width: ${CANVAS_WIDTH}px;
	height: ${CANVAS_HEIGHT}px;
	border: 1px solid rgba(0, 0, 0, 0.5);
`;

const CrosshairContainer = styled.div`
	position: absolute;
	width: ${CROSSHAIR_SIZE}px;
	height: ${CROSSHAIR_SIZE}px;
	transform: translate(-50%, -50%);
	pointer-events: none;
`;

const MAX_HUE = 360;
const MAX_SATURATION = 100;
const MAX_VALUE = 100;

type HSVObject = {
	hue: number,
	saturation: number,
};

type SelectHSVProps = React.PropsWithoutRef<{
	onChange?: (value: HSVObject) => void,
}>;

type SelectHSVComponent = React.FunctionComponent<SelectHSVProps>;

export const SelectHSV: SelectHSVComponent = ({
	onChange = () => {},
}) => {
	const [colorMode, setColorMode] = React.useState<'rgb' | 'hsv'>('hsv');
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

	const currentColorRef = React.useRef<HSVObject>({ hue: 0, saturation: 0 });

	const crosshairRef = React.useRef<HTMLDivElement | null>(null);

	const hueRef = React.useRef<HTMLInputElement | null>(null);
	const saturationRef = React.useRef<HTMLInputElement | null>(null);
	const redRef = React.useRef<HTMLInputElement | null>(null);
	const greenRef = React.useRef<HTMLInputElement | null>(null);
	const blueRef = React.useRef<HTMLInputElement | null>(null);

	useMouseDrag(canvasRef, {
		onMouseChange: handleMouseChange
	});

	function coordsToHSV (x: number, y: number) {
		const canvas = canvasRef.current!;
		const hue = (x / canvas.width) * MAX_HUE;
		const saturation = MAX_SATURATION - (y / canvas.height) * MAX_SATURATION;
		return { hue, saturation };
	}

	function HSVToCoords (hue: number, saturation: number) {
		const canvas = canvasRef.current!;
		const x = (hue / MAX_HUE) * canvas.width;
		const y = canvas.height - (saturation / MAX_SATURATION) * canvas.height;
		return { x, y };
	}

	React.useEffect(() => {
		const canvas = canvasRef.current!;
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			console.error('Failed to get canvas context');
			return;
		}

		const imageData = ctx.createImageData(canvas.width, canvas.height);
		const data = imageData.data;
		for (let y = 0; y < canvas.height; y ++) {
			for (let x = 0; x < canvas.width; x ++) {
				const dataIndex = (x + y * canvas.width) * 4;
				const { hue, saturation } = coordsToHSV(x, y);
				const [red, green, blue] = HSV2RGB(hue, saturation, MAX_VALUE);
				data[dataIndex + 0] = red;
				data[dataIndex + 1] = green;
				data[dataIndex + 2] = blue;
				data[dataIndex + 3] = 255;
			}
		}
		ctx.putImageData(imageData, 0, 0);
	}, []);

	function handleMouseChange ({ x: clientX, y: clientY }: Coords) {
		const canvas = canvasRef.current!;
		const { top, left, width, height } = canvas.getBoundingClientRect();
		const x = Math.max(Math.min(clientX - left, width), 0);
		const y = Math.max(Math.min(clientY - top, height), 0);
		const hsvObject = coordsToHSV(x, y);
		currentColorRef.current = hsvObject;
		updateInputValues();
		updateCrosshairFromCoords(x, y);
		onChange(hsvObject);
	}

	function getHSVFromInputs () {
		if (colorMode === 'hsv') {
			const hue = Number(hueRef.current!.value);
			const saturation = Number(saturationRef.current!.value);
			return { hue, saturation };
		} else {
			const red = Number(redRef.current!.value);
			const green = Number(greenRef.current!.value);
			const blue = Number(blueRef.current!.value);
			const [hue, saturation] = RGB2HSV(red, green, blue);
			return { hue, saturation };
		}
	}

	function updateInputValues () {
		const { hue, saturation } = currentColorRef.current;
		if (colorMode === 'hsv') {
			hueRef.current!.value = Math.round(hue).toString();
			saturationRef.current!.value = Math.round(saturation).toString();
		} else {
			const [red, green, blue] = HSV2RGB(hue, saturation, 100);
			redRef.current!.value = Math.round(red).toString();
			greenRef.current!.value = Math.round(green).toString();
			blueRef.current!.value = Math.round(blue).toString();
		}
	}

	function handleInputChange () {
		const hsvObject = getHSVFromInputs();
		currentColorRef.current = hsvObject;
		updateCrosshairFromColor();
		onChange(hsvObject);
	}

	function updateCrosshairFromCoords (x: number, y: number) {
		const style = crosshairRef.current!.style;
		style.top = `${y}px`;
		style.left = `${x}px`;
	}

	function updateCrosshairFromColor () {
		const style = crosshairRef.current!.style;
		const { x, y } = HSVToCoords(currentColorRef.current.hue, currentColorRef.current.saturation);
		style.top = `${y}px`;
		style.left = `${x}px`;
	}

	React.useEffect(() => {
		updateInputValues();
	}, [colorMode]);

	return (
		<Root>
			<CanvasContainer>
				<Canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} />
				<CrosshairContainer ref={crosshairRef}>
					<Crosshair style={{ width: CROSSHAIR_SIZE, height: CROSSHAIR_SIZE }} />
				</CrosshairContainer>
			</CanvasContainer>
			<Select
				options={['rgb', 'hsv']}
				onChangeValue={mode => setColorMode(mode as typeof colorMode)}
				defaultValue={colorMode}
			/>
			<InputsContainer>
				{colorMode === 'hsv'
					? <>
						<Input
							type='number'
							min={0}
							max={359}
							placeholder='Hue'
							onChange={handleInputChange}
							ref={hueRef}
						/>
						<Input
							type='number'
							min={0}
							max={100}
							placeholder='Saturation'
							onChange={handleInputChange}
							ref={saturationRef}
						/>
					</> : <>
						<Input
							type='number'
							min={0}
							max={359}
							placeholder='Red'
							onChange={handleInputChange}
							ref={redRef}
						/>
						<Input
							type='number'
							min={0}
							max={100}
							placeholder='Green'
							onChange={handleInputChange}
							ref={greenRef}
						/>
						<Input
							type='number'
							min={0}
							max={100}
							placeholder='Blue'
							onChange={handleInputChange}
							ref={blueRef}
						/>
					</>
				}
			</InputsContainer>
		</Root>
	);
}