import React, { FC } from 'react';
import styled from 'styled-components';
import type { Coords } from '../../../libs/hooks/use-mouse-drag';
import { useMouseDrag } from '../../../libs/hooks/use-mouse-drag';

const Root = styled.div``;

const Canvas = styled.canvas`
	cursor: pointer;
	width: 100%;
	height: 20px;
`;

const CanvasContainer = styled.div`
	position: relative;
	display: flex;
	aligh-itens: center;
`;

const Slider = styled.div`
	width: 5px;
	height: 150%;
	left: 0;
	top: 50%;
	transform: translate(-50%, -50%);
	position: absolute;
	background-color: black;
	pointer-events: none;
`;

const CANVAS_HEIGHT = 1;

const StripColor: FC<{
	onChange?: (newValue: number) => void;
	getColor: (percentX: number) => readonly [number, number, number];
	defaultValue?: number;
}> = ({ onChange = () => {}, getColor, defaultValue }) => {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
	const sliderRef = React.useRef<HTMLDivElement | null>(null);

	useMouseDrag(canvasRef, { onMouseChange: handleMouseChange });

	function handleMouseChange({ x: clientX }: Coords) {
		const canvas = canvasRef.current!;
		const { left, width } = canvas.getBoundingClientRect();
		const x = Math.max(Math.min(Math.round(clientX - left), width), 0);
		const percentage = x / canvasRef.current!.width;
		sliderRef.current!.style.left = `${x}px`;
		onChange(percentage);
	}

	React.useEffect(() => {
		if (!defaultValue) return;
		const x = Math.floor(
			defaultValue * Math.floor(canvasRef.current!.getBoundingClientRect().width),
		);
		sliderRef.current!.style.left = `${x}px`;
	}, []);

	React.useEffect(() => {
		const canvas = canvasRef.current!;
		canvas.width = canvas.getBoundingClientRect().width;
		const ctx = canvas.getContext(`2d`);

		if (!ctx) return console.error(`Failed to get canvas context`);

		const imageData = ctx.createImageData(canvas.width, CANVAS_HEIGHT);
		const { data } = imageData;
		for (let x = 0; x < canvas.width; x++) {
			const dataIndex = x * 4;
			const [red, green, blue] = getColor(x / canvas.width);
			data[dataIndex + 0] = Math.max(Math.min(Math.round(red), 255), 0);
			data[dataIndex + 1] = Math.max(Math.min(Math.round(green), 255), 0);
			data[dataIndex + 2] = Math.max(Math.min(Math.round(blue), 255), 0);
			data[dataIndex + 3] = 255;
		}
		ctx.putImageData(imageData, 0, 0);
	}, [getColor]);

	return (
		<Root>
			<CanvasContainer>
				<Canvas width={100} height={CANVAS_HEIGHT} ref={canvasRef} />
				<Slider ref={sliderRef} />
			</CanvasContainer>
		</Root>
	);
};

export default StripColor;
