import React from 'react';
import styled from 'styled-components';
import { useLamps } from '../../contexts/lamps';
import { LAMP_ID_JEAN, LAMP_ID_MIDDLE, LAMP_ID_RAFA, LAMP_ID_TV, LAMP_ID_WINDOW } from '../../constants/lamp-ids';
import { toast } from 'react-toastify';

const Root = styled.div`
	padding: 16px;
	background-color: white;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.h1`
	font-size: 24px;
	margin: 0 0 16px 0;
`;

const Svg = styled.svg`
	width: 250px;
	height: auto;
`;

const RoomRect = styled.rect<{ color: string }>`
	stroke: ${props => props.color};
	cursor: pointer;
`;

type SetTargetLampModalProps = React.PropsWithoutRef<{
}>;

type SetTargetLampModalComponent = React.FunctionComponent<SetTargetLampModalProps>;

const SetTargetLampModal: SetTargetLampModalComponent = ({  }) => {
	const { addTargetLamp, removeTargetLamp, isLampSetAsTarget, findLampById } = useLamps();

	function handleClick (lampId: number) {
		if (!findLampById(lampId)) return toast.error('Esta lâmpada está desligada');
		if (isLampSetAsTarget(lampId)) removeTargetLamp(lampId);
		else addTargetLamp(lampId);
	}

	function calculateLampColor (lampId: number) {
		if (!findLampById(lampId)) return 'rgba(255, 0, 0, 1)';
		else if (isLampSetAsTarget(lampId)) return 'rgba(0, 255, 0, 0.5)';
		else return 'white';
	}

	return (
		<Root>
			<Title>Selecione as lâmpadas</Title>
			<Svg
				// xmlns="http://www.w3.org/2000/svg"
				viewBox="-1 -1 102 162"
				width="102"
				height="162"
				stroke="black"
				fill="none"
			>
				<defs>
					<svg viewBox="13 5 72 95" id="bed" stroke="black" fill="none" strokeLinecap="round" strokeWidth="3">
						<rect y="6" x="14" width="70" height="80" rx="1" />
						<rect y="15" x="23" width="20" height="16" rx="1" />
						<rect y="15" x="56" width="20" height="16" rx="1" />
						<line x1="14" y1="38" x2="84" y2="38" />
						<line x1="29" y1="86" x2="29" y2="96" />
						<line x1="69" y1="86" x2="69" y2="96" />
					</svg>
					<svg id="light" fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
						<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
							<path d="M4710.9,4436.2v-583.8H4998h287.1v583.8V5020H4998h-287.1V4436.2z"/>
							<path d="M2008.3,3999.8l-223.9-174.2l91.9-114.8c49.8-65.1,210.5-269.9,354.1-457.5c145.5-187.6,271.8-338.8,279.5-335c28.7,9.6,440.2,329.2,440.2,340.7c0,15.3-689.1,909.2-704.4,913C2238,4174,2130.8,4097.4,2008.3,3999.8z"/>
							<path d="M7402.1,3733.7c-187.6-245-344.5-453.6-348.3-465.1c-9.6-21.1,400-344.5,436.4-344.5c11.5,0,178,202.9,369.4,451.7l350.3,451.7l-227.8,176.1c-124.4,95.7-229.7,174.2-231.6,174.2C7746.6,4177.8,7591.6,3976.8,7402.1,3733.7z"/>
							<path d="M4768.3,3105.9c-826.9-70.8-1611.6-534-2057.6-1215.4c-476.6-725.4-589.5-1602.1-315.8-2423.2c90-269.9,273.7-631.6,545.5-1070c403.9-648.9,505.3-853.7,591.4-1171.4c70.8-258.4,91.9-430.7,95.7-742.6l1.9-277.5H4998h1368.5l-1.9,124.4c-5.8,246.9,30.6,624,78.5,819.2c86.1,352.2,193.3,576.1,587.6,1209.7c380.9,612.5,543.6,953.2,637.4,1345.6c181.8,748.4,42.1,1542.7-382.8,2185.9C6737.9,2713.6,5752.2,3190.2,4768.3,3105.9z M5405.7,2491.5c440.2-88,851.7-312,1165.7-633.6c373.2-384.7,589.5-934.1,589.5-1508.3c0-354.1-63.2-620.2-227.8-966.6c-89.9-185.7-143.6-279.4-486.2-847.9c-386.6-635.5-551.3-1052.7-614.4-1554.2l-23-181.9l-817.3-5.7l-817.3-3.8v72.7c0,120.6-72.7,484.2-134,675.7c-78.5,239.3-281.4,652.7-488.1,993.4c-342.6,562.7-400,664.2-490,851.7c-168.4,354.1-227.8,608.7-227.8,980c0,685.2,319.6,1332.2,849.8,1722.7C4199.9,2464.7,4820,2612.1,5405.7,2491.5z"/>
							<path d="M337.3,1645.5c-5.7-13.4-38.3-137.8-74.6-277.5c-47.9-183.8-59.3-256.5-44-264.2c88.1-32.5,1092.9-292.9,1100.6-285.2c5.7,3.8,42.1,128.2,80.4,271.8c47.9,178,63.2,268,49.8,275.6c-11.5,7.7-206.7,61.2-432.6,122.5c-225.9,59.3-470.9,124.4-541.7,143.6C377.5,1658.9,343,1662.7,337.3,1645.5z"/>
							<path d="M9088.4,1517.3c-302.4-80.4-553.2-151.2-557-155c-7.6-9.6,132.1-530.2,145.5-543.6c7.7-9.6,1077.6,269.9,1110.2,289c11.5,7.7-118.7,532.1-137.8,549.3C9643.5,1660.8,9392.7,1599.6,9088.4,1517.3z"/>
							<path d="M3926.2-4483.3V-4780H4998h1071.9v296.7v296.7H4998H3926.2V-4483.3z"/>
						</g>
					</svg>
				</defs>
				{/* Paredes externas */}
				<rect y="0" x="0" width="100" height="160" />

				{/* Quarto Rafa */}
				<RoomRect fill="white" y="1" x="1" width="38" height="58" onClick={() => handleClick(LAMP_ID_RAFA)} color={calculateLampColor(LAMP_ID_RAFA)} />
				<rect y="0" x="0" width="40" height="60" />
				{/* <use href="#bed" x="9" y="5" width="20" height="20"/> */}
				<use href="#light" x="13" y="22" width="10" height="10" />

				{/* Quarto Jean */}
				<RoomRect fill="white" y="101" x="1" width="38" height="58"  onClick={() => handleClick(LAMP_ID_JEAN)} color={calculateLampColor(LAMP_ID_JEAN)} />
				<rect y="100" x="0" width="40" height="60" />
				{/* <use href="#bed" x="10" y="135" width="20" height="20" transform="rotate(180 19.999999523162842 144.63157653808594)"/> */}
				<use href="#light" x="13" y="125" width="10" height="10" />

				{/* Parede corredor */}
				<line x1="40" y1="80" x2="40" y2="100" />

				{/* Parede banheiro */}
				<line x1="20" y1="60" x2="20" y2="100" />

				{/* Sala */}
				<RoomRect fill="white" stroke="none" y="1" x="41" width="58" height="49" onClick={() => handleClick(LAMP_ID_TV)} color={calculateLampColor(LAMP_ID_TV)} />
				<RoomRect fill="white" stroke="none" y="51" x="41" width="58" height="59" onClick={() => handleClick(LAMP_ID_MIDDLE)} color={calculateLampColor(LAMP_ID_MIDDLE)} />
				<RoomRect fill="white" stroke="none" y="111" x="41" width="58" height="48" onClick={() => handleClick(LAMP_ID_WINDOW)} color={calculateLampColor(LAMP_ID_WINDOW)} />
				<use href="#light" x="65" y="125" width="10" height="10" />
				<use href="#light" x="65" y="70" width="10" height="10" />
				<use href="#light" x="65" y="15" width="10" height="10" />
			</Svg>
		</Root>
	);
}

export default SetTargetLampModal;