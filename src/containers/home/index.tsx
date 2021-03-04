import React from 'react';
import styled from 'styled-components';
import Toolbar from './toolbar';
import FloatingMenu from './floating-menu';
import HouseSVGImage from './house-svg-image';

const Root = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;
	padding: 16px;
`;

type ControlPageProps = React.PropsWithoutRef<{
}>;

type ControlPageComponent = React.FunctionComponent<ControlPageProps>;

const ControlPage: ControlPageComponent = () => {
	return (
		<Root>
			<HouseSVGImage />
			<Toolbar />
			<FloatingMenu />
		</Root>
	);
};

export default ControlPage;
