import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import React from 'react';
import styled from 'styled-components';
import Looks from '@material-ui/icons/Looks';
import MusicNote from '@material-ui/icons/MusicNote';
import { useModal } from '../../../contexts/modal';
import MulticolorModal from '../../../components/modals/multicolor';
import { useLamps } from '../../../contexts/lamps';
import { makeStyles } from '@material-ui/core';
import { useMusicMode } from '../../../contexts/music-mode';

const Root = styled.div`
	position: fixed;
	right: 16px;
	bottom: 16px;
`;

type FloatingMenuProps = React.PropsWithoutRef<{}>;

type FloatingMenuComponent = React.FunctionComponent<FloatingMenuProps>;

const FloatingMenu: FloatingMenuComponent = () => {
	const classes = useStyles();
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
		openModal(<MulticolorModal />);
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
					classes={{
						fab: musicMode ? classes.fab : '',
					}}
					onClick={handleMusicListenerClick}
				/>
			</SpeedDial>
		</Root>
	);
};

const useStyles = makeStyles(() => ({
	fab: {
		'backgroundColor': '#FFAEBC',
		'&:hover': {
			backgroundColor: '#FFAEBC',
		},
	},
}));

export default FloatingMenu;
