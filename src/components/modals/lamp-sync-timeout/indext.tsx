import React, { FC } from 'react';
import styled from 'styled-components';
import { useLampStateSyncer } from '../../../contexts/lamp-state-syncer';

const Root = styled.div`
	background-color: white;
	padding: 16px;
	border-radius: 8px;
	width: calc(100vw - 32px);
	max-width: 400px;
`;

const Title = styled.h1`
	text-align: center;
`;

const Button = styled.button<{ selected: boolean }>`
	width: 100%;
	margin: 0.5rem 0;
	border: 0;
	font-size: 16px;
	cursor: pointer;
	border-radius: 4px;
	transition: 200ms;
	${props =>
		props.selected
			? `
		background-color: ${props.theme.colors.primary.main};
	`
			: ''}
`;

const LampSyncTimeoutModal: FC<{}> = () => {
	const { updateShouldSync, lampStateSyncer, setLampStateSyncer } = useLampStateSyncer();

	function handleClick(syncInterval: number) {
		setLampStateSyncer({
			shouldSync: true,
			syncInterval,
		});
	}

	function handleToggle() {
		updateShouldSync(false);
	}

	const options = [
		{ text: `1s`, value: 1 },
		{ text: `2s`, value: 2 },
		{ text: `3s`, value: 3 },
		{ text: `5s`, value: 5 },
		{ text: `10s`, value: 10 },
		{ text: `20s`, value: 20 },
		{ text: `1 min`, value: 60 },
		{ text: `2 min`, value: 120 },
		{ text: `3 min`, value: 180 },
		{ text: `5 min`, value: 300 },
	];

	return (
		<Root>
			<Title>Intervalo de sincronização</Title>
			<Button selected={!lampStateSyncer.shouldSync} onClick={handleToggle}>
				Não sincronizar
			</Button>
			{options.map(({ text, value }) => (
				<Button
					key={value}
					selected={lampStateSyncer.shouldSync && lampStateSyncer.syncInterval === value}
					onClick={() => handleClick(value)}
				>
					{text}
				</Button>
			))}
		</Root>
	);
};

export default LampSyncTimeoutModal;
