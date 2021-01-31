import React from 'react';
import styled from 'styled-components';
import RawLampIcon from '@material-ui/icons/WbIncandescent';
import { useModal } from '../../../contexts/modal';
import SetTargetLampModal from '../../modals/set-target-lamps';

const Root = styled.div`
	width: 100%;
	background-color: lightblue;
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	padding: 16px;
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
			<LampIcon onClick={handleClick} />
		</Root>
	);
}

export default Header;