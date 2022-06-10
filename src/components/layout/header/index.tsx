import React, { FC } from 'react';
import styled from 'styled-components';

import MoreVert from '@mui/icons-material/MoreVert';
import Replay from '@mui/icons-material/Replay';
import EmojiObjects from '@mui/icons-material/EmojiObjects';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Keyboard from '@mui/icons-material/Keyboard';
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

const RightSide = styled.div``;

const LeftSide = styled.div``;

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

const CommandsButton = styled(Keyboard)`
	margin: 1rem 0.5rem;
	cursor: pointer;
`;

const ShoppingButton = styled(ShoppingCart)`
	margin: 1rem 0.5rem;
	cursor: pointer;
`;

const Header: FC<{}> = () => {
	const [longPressTimeoutHandler, setLongPressTimeoutHandler] = React.useState<number | null>(null);
	const { fetchLamps, mediumTargetLampsColor } = useLamps();
	const { openModal } = useModal();

	function handleOptionsOpen() {
		openModal(<SettingsModal />);
	}

	function longPress() {
		setLongPressTimeoutHandler(null);
		openModal(<LampSyncTimeoutModal />);
	}

	function shortPress() {
		fetchLamps();
	}

	function handleReloadDown() {
		const handler = setTimeout(longPress, LONG_PRESS_DELAY) as unknown as number;
		setLongPressTimeoutHandler(handler);
	}

	function handleReloadUp() {
		if (longPressTimeoutHandler !== null) {
			shortPress();
			clearTimeout(longPressTimeoutHandler);
		}
	}

	return (
		<Root
			style={{
				backgroundColor: `rgb(${mediumTargetLampsColor[0]}, ${mediumTargetLampsColor[1]}, ${mediumTargetLampsColor[2]})`,
			}}
		>
			<LeftSide>
				<Link href="/">
					<LightsButton />
				</Link>
				<Link href="/commands">
					<CommandsButton />
				</Link>
				<Link href="/shopping">
					<ShoppingButton />
				</Link>
			</LeftSide>
			<RightSide>
				<ReloadButton onMouseDown={handleReloadDown} onMouseUp={handleReloadUp} />
				<MoreButton onClick={handleOptionsOpen} />
			</RightSide>
		</Root>
	);
};

export default Header;
