import React, { FC } from 'react';
import styled from 'styled-components';

import MoreVert from '@mui/icons-material/MoreVert';
import EmojiObjects from '@mui/icons-material/EmojiObjects';
import Keyboard from '@mui/icons-material/Keyboard';
import { useModal } from '../../../contexts/modal';
import SettingsModal from '../../modals/settings';
import { useLamps } from '../../../contexts/lamps';
import Link from 'next/link';

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

const LightsButton = styled(EmojiObjects)`
	margin: 1rem 0.5rem;
	cursor: pointer;
`;

const CommandsButton = styled(Keyboard)`
	margin: 1rem 0.5rem;
	cursor: pointer;
`;

const Header: FC<{}> = () => {
	const { mediumTargetLampsColor } = useLamps();
	const { openModal } = useModal();

	function handleOptionsOpen() {
		openModal(<SettingsModal />);
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
			</LeftSide>
			<RightSide>
				<MoreButton onClick={handleOptionsOpen} />
			</RightSide>
		</Root>
	);
};

export default Header;
