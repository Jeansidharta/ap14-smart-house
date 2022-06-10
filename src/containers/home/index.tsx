import React, { FC } from 'react';
import styled from 'styled-components';
import Toolbar from './toolbar';
import FloatingMenu from './floating-menu';
import HouseSVGImage from './house-svg-image';
import Head from 'next/head';

const Root = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	padding: 16px;
	min-height: 650px;
`;

const ControlPage: FC<{}> = () => {
	return (
		<Root>
			<Head>
				<title>Controle Remoto</title>
			</Head>
			<HouseSVGImage />
			<Toolbar />
			<FloatingMenu />
		</Root>
	);
};

export default ControlPage;
