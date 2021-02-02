import React from 'react';
import styled from 'styled-components';
import { useLamps } from '../../../contexts/lamps';

const Root = styled.button<{ isSelected: boolean }>`
	background-color: ${props => props.isSelected ? 'rgba(0, 0, 0, 0.3)' : ''};
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	min-height: 32px;
	width: 32px;
	border: 0;
	cursor: pointer;
`;

type GroupButtonProps = React.PropsWithoutRef<{
	lampIds: number[],
}>;

type GroupButtonComponent = React.FunctionComponent<GroupButtonProps>;

const GroupButton: GroupButtonComponent = ({ lampIds, children }) => {
	const { isLampSetAsTarget, setTargetLamps } = useLamps();

	const isSelected = lampIds.every(id => isLampSetAsTarget(id));

	function handleClick () {
		setTargetLamps(lampIds);
	}

	return (
		<Root isSelected={isSelected} onClick={handleClick}>
			{children}
		</Root>
	);
}

export default GroupButton;