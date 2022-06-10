import React, { FC } from 'react';
import styled from 'styled-components';
import { useModal } from '../contexts/modal';

const Backdrop = styled.div`
	position: fixed;
	z-index: 10;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32px 16px;
`;

const ElementContainer = styled.div`
	overflow-y: auto;
	max-height: 100%;
	max-width: 100%;
`;

const Modal: FC<{}> = () => {
	const { _element, _options, closeModal } = useModal();
	const { backdropClickClose, escKeyClose } = _options;

	function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
		event.stopPropagation();
		if (backdropClickClose) closeModal();
	}

	function handleElementContainerClick(event: React.MouseEvent<HTMLDivElement>) {
		event.stopPropagation();
	}

	React.useEffect(() => {
		if (!escKeyClose) return;

		function keyboardEvent(event: KeyboardEvent) {
			const key = event.key.toLowerCase();
			if (key === 'esc') {
				closeModal();
			}
		}

		document.body.addEventListener('keydown', keyboardEvent);
		return () => document.body.removeEventListener('keydown', keyboardEvent);
	}, [closeModal, escKeyClose]);

	if (!_element) return null;

	return (
		<Backdrop onClick={handleBackdropClick}>
			<ElementContainer onClick={handleElementContainerClick}>{_element}</ElementContainer>
		</Backdrop>
	);
};

export default Modal;
