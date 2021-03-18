import React from 'react';
import styled from 'styled-components';

import MoreVert from '@material-ui/icons/MoreVert';
import Replay from '@material-ui/icons/Replay';
import EmojiObjects from '@material-ui/icons/EmojiObjects';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import { useModal } from '../../../contexts/modal';
import SettingsModal from '../../modals/settings';
import { useLamps } from '../../../contexts/lamps';
import LampSyncTimeoutModal from '../../modals/lamp-sync-timeout/indext';
import Link from 'next/link';

const LONG_PRESS_DELAY = 500; // milisseconds

const Root = styled.div`
	width: 100%;
	background-color: ${props => props.theme.colors.primary.main};
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const RightSide = styled.div`
`;

const LeftSide = styled.div`
`;

const MoreButton = styled(MoreVert)`
	margin: 1rem 0.5rem;
	cursor: pointer;
`;

const ReloadButton = styled(Replay)`
	margin: 1rem 0.5rem;
	cursor: pointer;
`;

const LightsButton = styled(EmojiObjects)`
	margin: 1rem 0.5rem;
	cursor: pointer;
`;

const ShoppingButton = styled(ShoppingCart)`
	margin: 1rem 0.5rem;
	cursor: pointer;
`;

type HeaderProps = React.PropsWithoutRef<{
}>;

type HeaderComponent = React.FunctionComponent<HeaderProps>;

const Header: HeaderComponent = () => {
	const [longPressTimeoutHandler, setLongPressTimeoutHandler] = React.useState<number | null>(null);
	const { fetchLamps } = useLamps();
	const { openModal } = useModal();

	function handleOptionsOpen () {
		openModal(<SettingsModal />);
	}

	function longPress () {
		setLongPressTimeoutHandler(null);
		openModal(<LampSyncTimeoutModal />);
	}

	function shortPress () {
		fetchLamps();
	}

	function handleReloadDown () {
		const handler = setTimeout(longPress, LONG_PRESS_DELAY) as unknown as number;
		setLongPressTimeoutHandler(handler);
	}

	function handleReloadUp () {
		if (longPressTimeoutHandler !== null) {
			shortPress();
			clearTimeout(longPressTimeoutHandler)
		}
	}

	return (
		<Root>
			<LeftSide>
				<Link href='/'><LightsButton /></Link>
				<Link href='/shopping'><ShoppingButton /></Link>
			</LeftSide>
			<RightSide>
				<ReloadButton
					onMouseDown={handleReloadDown}
					onMouseUp={handleReloadUp}
				/>
				<MoreButton onClick={handleOptionsOpen} />
			</RightSide>
		</Root>
	);
};

export default Header;
