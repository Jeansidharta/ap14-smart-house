import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import React from 'react';
import styled from 'styled-components';
import Looks from '@material-ui/icons/Looks';
import { useModal } from '../../../contexts/modal';
import MulticolorModal from '../../../components/modals/multicolor';
import { useLamps } from '../../../contexts/lamps';

const Root = styled.div`
	position: fixed;
	right: 16px;
	bottom: 16px;
`;

type FloatingMenuProps = React.PropsWithoutRef<{}>;

type FloatingMenuComponent = React.FunctionComponent<FloatingMenuProps>;

const FloatingMenu: FloatingMenuComponent = () => {
	const { targetLamps } = useLamps();
	const [isOpen, setIsOpen] = React.useState(false);
	const { openModal } = useModal();

	function handleOpen () {
		setIsOpen(true);
	}

	function handleClose () {
		setIsOpen(false);
	}

	function handleOpenMulticolor () {
		openModal(<MulticolorModal />);
		setIsOpen(false);
	}

	return (
		<Root>
			<SpeedDial
				ariaLabel='SpeedDial example'
				icon={<SpeedDialIcon />}
				hidden={targetLamps.length === 0}
				onClose={handleClose}
				onOpen={handleOpen}
				open={isOpen}
				direction='up'
			>
				<SpeedDialAction
					icon={<Looks />}
					tooltipTitle='Tuts tuts'
					onClick={handleOpenMulticolor}
				/>
			</SpeedDial>
		</Root>
	);
};

export default FloatingMenu;
