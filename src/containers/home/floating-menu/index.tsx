import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import React from 'react';
import styled from 'styled-components';
import Looks from '@material-ui/icons/Looks';
import { useModal } from '../../../contexts/modal';
import MulticolorModal from '../../../components/modals/multicolor';

const Root = styled.div`
	position: fixed;
	right: 16px;
	bottom: 16px;
`;

type FloatingMenuProps = React.PropsWithoutRef<{
	shouldAppear?: boolean;
}>;

type FloatingMenuComponent = React.FunctionComponent<FloatingMenuProps>;

const FloatingMenu: FloatingMenuComponent = ({ shouldAppear }) => {
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
				hidden={!shouldAppear}
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
