import React from 'react';
import styled from 'styled-components';
import { Coords, useMouseDrag } from '../../../libs/use-mouse-drag';

const Root = styled.div`
`;

const Canvas = styled.canvas`
	cursor: pointer;
	width: 100%;
	height: 10px;
`;

const CanvasContainer = styled.div`
	position: relative;
`;

const Slider = styled.div`
	width: 2px;
	height: 15px;
	left: 0;
	top: 50%;
	transform: translate(-50%, -50%);
	position: absolute;
	background-color: black;
	pointer-events: none;
`;

const CANVAS_HEIGHT = 1;

type StripColorProps = React.PropsWithoutRef<{
	onChange?: (newValue: number) => void,
	getColor: (percentX: number) => [number, number, number]
}>;

type StripColorComponent = React.FunctionComponent<StripColorProps>;

const StripColor: StripColorComponent = ({
	onChange = () => {},
	getColor,
}) => {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
	const sliderRef = React.useRef<HTMLDivElement | null>(null);

	useMouseDrag(canvasRef, { onMouseChange: handleMouseChange });

	function handleMouseChange ({ x: clientX }: Coords) {
		const canvas = canvasRef.current!;
		const { left, width } = canvas.getBoundingClientRect();
		const x = Math.max(Math.min(Math.round(clientX - left), width), 0);
		const percentage = x / canvasRef.current!.width;
		sliderRef.current!.style.left = x + 'px';
		onChange(percentage);
	}

	React.useEffect(() => {
		const canvas = canvasRef.current!;
		canvas.width = canvas.getBoundingClientRect().width;
		const ctx = canvas.getContext('2d');

		if (!ctx) return console.error('Failed to get canvas context');

		const imageData = ctx.createImageData(canvas.width, CANVAS_HEIGHT);
		const data = imageData.data;
		for (let x = 0; x < canvas.width; x ++) {
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
}

export default StripColor;