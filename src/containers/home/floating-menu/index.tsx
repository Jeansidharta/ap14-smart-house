import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import React, { FC } from 'react';
import styled from 'styled-components';
import Looks from '@mui/icons-material/Looks';
import MusicNote from '@mui/icons-material/MusicNote';
import { useModal } from '../../../contexts/modal';
import MulticolorModal from '../../../components/modals/multicolor';
import { useLamps } from '../../../contexts/lamps';
import { useMusicMode } from '../../../contexts/music-mode';

const Root = styled.div`
	position: fixed;
	right: 16px;
	bottom: 16px;
`;

const FloatingMenu: FC<{}> = () => {
	const { musicMode, setMusicMode } = useMusicMode();
	const { targetLamps } = useLamps();
	const [isOpen, setIsOpen] = React.useState(false);
	const { openModal } = useModal();

	function handleOpen() {
		setIsOpen(true);
	}

	function handleClose() {
		setIsOpen(false);
	}

	function handleOpenMulticolor() {
		openModal(<MulticolorModal />, { backdropClickClose: false, escKeyClose: false });
		setIsOpen(false);
	}

	function handleMusicListenerClick() {
		setMusicMode(!musicMode);
	}

	return (
		<Root>
			<SpeedDial
				ariaLabel="SpeedDial example"
				icon={<SpeedDialIcon />}
				hidden={targetLamps.length === 0}
				onClose={handleClose}
				onOpen={handleOpen}
				open={isOpen}
				direction="up"
			>
				<SpeedDialAction icon={<Looks />} tooltipTitle="Tuts tuts" onClick={handleOpenMulticolor} />
				<SpeedDialAction
					icon={<MusicNote />}
					tooltipTitle="Music mode"
					onClick={handleMusicListenerClick}
				/>
			</SpeedDial>
		</Root>
	);
};

export default FloatingMenu;
