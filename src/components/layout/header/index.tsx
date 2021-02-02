import React from 'react';
import styled from 'styled-components';
import RawLampIcon from '@material-ui/icons/WbIncandescent';
import { useModal } from '../../../contexts/modal';
import SetTargetLampModal from '../../modals/set-target-lamps';

import Kitchen from '@material-ui/icons/Kitchen';
import Tv from '@material-ui/icons/Tv';
import GroupButton from './group-button';
import { LAMP_ID_JEAN, LAMP_ID_MIDDLE, LAMP_ID_RAFA, LAMP_ID_TV, LAMP_ID_WINDOW } from '../../../constants/lamp-ids';

const Root = styled.div`
	width: 100%;
	background-color: lightblue;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const LampIcon = styled(RawLampIcon)`
	cursor: pointer;
`;

type HeaderProps = React.PropsWithoutRef<{
}>;

type HeaderComponent = React.FunctionComponent<HeaderProps>;

const Header: HeaderComponent = ({  }) => {
	const { openModal } = useModal();

	function handleClick () {
		openModal(<SetTargetLampModal />);
	}

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
			<GroupButton lampIds={[LAMP_ID_JEAN, LAMP_ID_RAFA, LAMP_ID_TV, LAMP_ID_MIDDLE, LAMP_ID_WINDOW]}>
				All
			</GroupButton>
			<LampIcon onClick={handleClick} />
		</Root>
	);
}

export default Header;