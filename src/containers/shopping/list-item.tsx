import React from 'react';
import styled from 'styled-components';
import { ShoppingListItem } from '../../models/shopping-list';

import Clear from '@mui/icons-material/Clear';
import { useMouseDrag } from '../../libs/hooks/use-mouse-drag';

const Root = styled.div`
	display: flex;
	justify-content: space-between;
	max-width: 300px;
	background-color: white;
	box-shadow: ${({ theme }) => theme.shadows.listItem.medium};
	padding: 8px 16px;
	border-radius: 8px;
	align-items: center;
	cursor: pointer;
	user-select: none;
	transition: transform 200ms;
	transform: rotate(0deg);
`;

const Name = styled.p`
	margin: 0;
	font-size: 24px;
`;

const DeleteButton = styled.button`
	background-color: transparent;
	border: 0;
	cursor: pointer;
	width: 32px;
	height: 32px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

type ListItemProps = React.PropsWithoutRef<{
	item: ShoppingListItem;
	onDelete?: () => void;
}>;

type ListItemComponent = React.FunctionComponent<ListItemProps>;

const ListItem: ListItemComponent = ({ item, onDelete }) => {
	const rootRef = React.useRef<HTMLDivElement | null>(null);

	useMouseDrag(rootRef, {
		onDrag: ({ deltaFromStartMousePosition }) => {
			const style = rootRef.current!.style;
			style.left = `${deltaFromStartMousePosition.x}px`;
			style.top = `${deltaFromStartMousePosition.y}px`;
		},
		onMouseDown: ({ x, y }) => {
			const { left, top } = rootRef.current!.getBoundingClientRect();
			const style = rootRef.current!.style;
			style.position = 'relative';
			style.transform = `rotate(${Math.random() > 0.5 ? '-' : ''}15deg)`;
			style.zIndex = `10`;
			const dx = x - left;
			const dy = y - top;
			style.transformOrigin = `${dx}px ${dy}px`;
		},
		onMouseUp: () => {
			const style = rootRef.current!.style;
			style.position = ``;
			style.transform = ``;
			style.left = ``;
			style.top = ``;
			style.zIndex = ``;
			style.transformOrigin = ``;
		},
	});

	return (
		<Root ref={rootRef}>
			<Name>{item.name}</Name>
			<DeleteButton onMouseDown={event => event.stopPropagation()} onClick={onDelete}>
				<Clear />
			</DeleteButton>
		</Root>
	);
};

export default ListItem;
