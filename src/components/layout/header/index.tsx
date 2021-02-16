import React from 'react';
import styled from 'styled-components';

import MoreVert from '@material-ui/icons/MoreVert';
import { useModal } from '../../../contexts/modal';
import SettingsModal from '../../modals/settings';

const Root = styled.div`
	width: 100%;
	background-color: lightblue;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const MoreButton = styled(MoreVert)`
	margin: 1rem;
	cursor: pointer;
`;

type HeaderProps = React.PropsWithoutRef<{
}>;

type HeaderComponent = React.FunctionComponent<HeaderProps>;

const Header: HeaderComponent = () => {
	const { openModal } = useModal();

	function handleOptionsOpen () {
		openModal(<SettingsModal />);
	}

	return (
		<Root>
			<MoreButton onClick={handleOptionsOpen} />
		</Root>
	);
};

export default Header;
