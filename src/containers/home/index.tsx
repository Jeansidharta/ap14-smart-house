import React from 'react';
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

type ControlPageProps = React.PropsWithoutRef<{}>;

type ControlPageComponent = React.FunctionComponent<ControlPageProps>;

const ControlPage: ControlPageComponent = () => {
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
