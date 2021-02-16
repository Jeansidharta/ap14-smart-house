import React from 'react';
import styled from 'styled-components';

import Kitchen from '@material-ui/icons/Kitchen';
import Tv from '@material-ui/icons/Tv';
import GroupButton from './group-button';
import {
	LAMP_ID_JEAN,
	LAMP_ID_MIDDLE,
	LAMP_ID_RAFA,
	LAMP_ID_TV,
	LAMP_ID_WINDOW,
} from '../../../constants/lamp-ids';

const Root = styled.div`
	width: 100%;
	background-color: lightblue;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

type HeaderProps = React.PropsWithoutRef<{
}>;

type HeaderComponent = React.FunctionComponent<HeaderProps>;

const Header: HeaderComponent = () => {
	return (
		<Root>
			<GroupButton lampIds={[LAMP_ID_JEAN]}>
				J
			</GroupButton>
			<GroupButton lampIds={[LAMP_ID_RAFA]}>
				R
			</GroupButton>
			<GroupButton lampIds={[LAMP_ID_MIDDLE, LAMP_ID_WINDOW]}>
				<Kitchen />
			</GroupButton>
			<GroupButton lampIds={[LAMP_ID_TV]}>
				<Tv />
			</GroupButton>
			<GroupButton lampIds={[
				LAMP_ID_JEAN,
				LAMP_ID_RAFA,
				LAMP_ID_TV,
				LAMP_ID_MIDDLE,
				LAMP_ID_WINDOW,
			]}
			>
				All
			</GroupButton>
		</Root>
	);
};

export default Header;
