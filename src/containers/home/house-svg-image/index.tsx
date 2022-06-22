/* eslint-disable max-len */
import React, { FC } from 'react';
import styled from 'styled-components';
import { useLamps } from '../../../contexts/lamps';
import { toast } from 'react-toastify';
import {
	LAMP_ID_RAFA,
	LAMP_ID_JEAN,
	LAMP_ID_TV,
	LAMP_ID_MIDDLE,
	LAMP_ID_WINDOW,
	LAMP_ID_STRIP_JEAN,
	LAMP_ID_HALL,
	LAMP_ID_STRIP_SALA,
} from '../../../constants/lamp-ids';
import SVGLampIcon from './svg-lamp-icon';
import { SVGStripLight } from './svg-strip-light';

const Root = styled.div``;

const Svg = styled.svg`
	width: 250px;
	height: auto;
	background-color: white;
`;

const RoomRect = styled.rect<{ color: string }>`
	stroke: ${props => props.color};
	cursor: pointer;
`;

const HouseSVGImage: FC<{}> = () => {
	const { findLampById, addTargetLamp, removeTargetLamp, isLampSetAsTarget } = useLamps();

	function handleClick(lampId: number) {
		console.log('Lamp clicked', lampId);
		if (!findLampById(lampId)) return toast.error(`Esta lâmpada está desligada`);
		if (isLampSetAsTarget(lampId)) removeTargetLamp(lampId);
		else return addTargetLamp(lampId);
	}

	function calculateRoomColor(lampId: number) {
		if (!findLampById(lampId)) return `rgba(255, 0, 0, 1)`;
		else if (isLampSetAsTarget(lampId)) return `rgba(0, 255, 0, 0.5)`;
		else return `white`;
	}

	return (
		<Root>
			<Svg
				// xmlns='http://www.w3.org/2000/svg'
				viewBox="-1 -1 102 162"
				width="102"
				height="162"
				stroke="black"
				fill="none"
			>
				<defs>
					<svg
						id="light"
						stroke="black"
						strokeWidth="500"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1000 1000"
						width="1000"
						height="1000"
						style={{ pointerEvents: 'none' }}
					>
						<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
							<path d="M4768.3,3105.9c-826.9-70.8-1611.6-534-2057.6-1215.4c-476.6-725.4-589.5-1602.1-315.8-2423.2c90-269.9,273.7-631.6,545.5-1070c403.9-648.9,505.3-853.7,591.4-1171.4c70.8-258.4,91.9-430.7,95.7-742.6l1.9-277.5H4998h1368.5l-1.9,124.4c-5.8,246.9,30.6,624,78.5,819.2c86.1,352.2,193.3,576.1,587.6,1209.7c380.9,612.5,543.6,953.2,637.4,1345.6c181.8,748.4,42.1,1542.7-382.8,2185.9C6737.9,2713.6,5752.2,3190.2,4768.3,3105.9z" />
							<path d="M3926.2-4483.3V-4780H4998h1071.9v296.7v296.7H4998H3926.2V-4483.3z" />
						</g>
					</svg>
					<svg
						id="ticks"
						stroke="black"
						strokeWidth="500"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1000 1000"
						width="1000"
						height="1000"
						style={{ pointerEvents: 'none' }}
					>
						<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
							<path d="M4710.9,4436.2v-583.8H4998h287.1v583.8V5020H4998h-287.1V4436.2z" />
							<path d="M2008.3,3999.8l-223.9-174.2l91.9-114.8c49.8-65.1,210.5-269.9,354.1-457.5c145.5-187.6,271.8-338.8,279.5-335c28.7,9.6,440.2,329.2,440.2,340.7c0,15.3-689.1,909.2-704.4,913C2238,4174,2130.8,4097.4,2008.3,3999.8z" />
							<path d="M7402.1,3733.7c-187.6-245-344.5-453.6-348.3-465.1c-9.6-21.1,400-344.5,436.4-344.5c11.5,0,178,202.9,369.4,451.7l350.3,451.7l-227.8,176.1c-124.4,95.7-229.7,174.2-231.6,174.2C7746.6,4177.8,7591.6,3976.8,7402.1,3733.7z" />
							<path d="M337.3,1645.5c-5.7-13.4-38.3-137.8-74.6-277.5c-47.9-183.8-59.3-256.5-44-264.2c88.1-32.5,1092.9-292.9,1100.6-285.2c5.7,3.8,42.1,128.2,80.4,271.8c47.9,178,63.2,268,49.8,275.6c-11.5,7.7-206.7,61.2-432.6,122.5c-225.9,59.3-470.9,124.4-541.7,143.6C377.5,1658.9,343,1662.7,337.3,1645.5z" />
							<path d="M9088.4,1517.3c-302.4-80.4-553.2-151.2-557-155c-7.6-9.6,132.1-530.2,145.5-543.6c7.7-9.6,1077.6,269.9,1110.2,289c11.5,7.7-118.7,532.1-137.8,549.3C9643.5,1660.8,9392.7,1599.6,9088.4,1517.3z" />
						</g>
					</svg>
					<svg
						id="music-note"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="35 0 149 219"
						width="149"
						height="219"
						fill="black"
					>
						<path d="M170.975,49.667c-1.143-1.672-2.298-3.205-3.433-4.553c-8.974-10.66-24.952-19.393-42.742-23.36c-11.391-2.542-24.952-14.857-29.21-19.383c-2.644-2.822-7.118-3.252-10.324-0.602c-1.741,1.44-2.647,3.658-2.648,5.918l-0.005,10.175l-0.005,9.994c0,0,0,0,0,0l-0.06,124.317c-4.072-1.647-8.464-2.516-12.995-2.518c-19.083,0-34.617,15.526-34.626,34.61c-0.009,19.094,15.517,34.635,34.611,34.645c0.001,0,0.015,0,0.016,0c19.085,0,34.619-15.526,34.627-34.611v0c0,0,0,0,0,0l0.054-112.369c3.936,1.326,8.534,2.349,13.901,2.827c20.538,1.829,34.369,5.939,43.527,12.933c6.839,5.223,7.11,7.762,7.215,8.324c0,0.013,0,0.026,0,0.039c0.011,0.786,0.699,1.396,1.485,1.396l6.119,0.004v0v0l2.8,0.001c2.596,0.001,4.701-2.102,4.702-4.697V92.71C183.992,77.021,179.493,62.137,170.975,49.667z M69.553,211.41L69.553,211.41L69.553,211.41L69.553,211.41z" />
					</svg>
					<svg
						id="lampstand"
						xmlns="http://www.w3.org/2000/svg"
						width="44"
						height="81"
						viewBox="28 0 44 81"
						stroke="black"
						fill="none"
						style={{ cursor: 'pointer', pointerEvents: 'none' }}
					>
						<path
							strokeWidth="2"
							strokeLinecap="round"
							fill="black"
							d=" M 40 0 h 20 L 70 20 h -40 z M 43 22 v 13 M 50 22 v 58 M 40 80 h 20"
						/>
						<circle r="3" cx="43" cy="35" fill="black" />
					</svg>
				</defs>
				{/* Paredes externas */}
				<rect y="0" x="0" width="100" height="160" />

				{/* ----------------------- Quarto Rafa ----------------------- */}
				<RoomRect
					fill="white"
					y="1"
					x="1"
					width="38"
					height="58"
					onClick={() => handleClick(LAMP_ID_RAFA)}
					color={calculateRoomColor(LAMP_ID_RAFA)}
				/>
				<rect y="0" x="0" width="40" height="60" />
				<SVGLampIcon lampId={LAMP_ID_RAFA} x={13} y={22} />

				{/* ----------------------- Quarto Jean ----------------------- */}
				<RoomRect
					fill="white"
					y="101"
					x="1"
					width="38"
					height="58"
					onClick={() => handleClick(LAMP_ID_JEAN)}
					color={calculateRoomColor(LAMP_ID_JEAN)}
				/>
				<rect y="100" x="0" width="40" height="60" />
				<SVGStripLight
					onSelect={() => handleClick(LAMP_ID_STRIP_JEAN)}
					lampId={LAMP_ID_STRIP_JEAN}
					x={25}
					y={145}
				/>
				<SVGLampIcon lampId={LAMP_ID_JEAN} x={13} y={125} />

				{/* ------------------------ Corredor ------------------------  */}
				{/* Parede Corredor Sala */}
				<line x1="40" y1="80" x2="40" y2="100" />
				{/* Parede Corredor Banheiro */}
				<line x1="20" y1="60" x2="20" y2="100" />
				<RoomRect
					fill="white"
					y="61"
					x="21"
					width="18"
					height="38"
					onClick={() => handleClick(LAMP_ID_HALL)}
					color={calculateRoomColor(LAMP_ID_HALL)}
				/>

				{/* --------------------------- Sala --------------------------- */}
				<RoomRect
					fill="white"
					stroke="none"
					y="1"
					x="41"
					width="58"
					height="49"
					onClick={() => handleClick(LAMP_ID_TV)}
					color={calculateRoomColor(LAMP_ID_TV)}
				/>
				<RoomRect
					fill="white"
					stroke="none"
					y="51"
					x="41"
					width="58"
					height="59"
					onClick={() => handleClick(LAMP_ID_MIDDLE)}
					color={calculateRoomColor(LAMP_ID_MIDDLE)}
				/>
				<RoomRect
					fill="white"
					stroke="none"
					y="111"
					x="41"
					width="58"
					height="48"
					onClick={() => handleClick(LAMP_ID_WINDOW)}
					color={calculateRoomColor(LAMP_ID_WINDOW)}
				/>
				<SVGStripLight
					onSelect={() => handleClick(LAMP_ID_STRIP_SALA)}
					lampId={LAMP_ID_STRIP_SALA}
					x={85}
					y={10}
				/>
				<SVGLampIcon lampId={LAMP_ID_WINDOW} x={65} y={125} />
				<SVGLampIcon lampId={LAMP_ID_MIDDLE} x={65} y={70} />
				<SVGLampIcon lampId={LAMP_ID_TV} x={65} y={15} />
				<SVGLampIcon lampId={LAMP_ID_HALL} x={25} y={75} />
			</Svg>
		</Root>
	);
};

export default HouseSVGImage;
