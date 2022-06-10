import React, { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { useWebsocket } from '../contexts/websocket';
import SignalCellular4Bar from '@mui/icons-material/SignalCellular4Bar';
import SignalCellularConnectedNoInternet4Bar from '@mui/icons-material/SignalCellularConnectedNoInternet4Bar';

const Root = styled.div`
	position: fixed;
	background-color: red;
	bottom: 0px;
	left: 16px;
	padding: 8px 8px 16px 8px;
	border-radius: 8px 8px 0 0;
	border: 1px solid rgba(0, 0, 0, 0.4);
	box-shadow: 2px -2px 8px rgba(0, 0, 0, 0.4);
	width: 42px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const WebsocketService: FC<{}> = ({}) => {
	const theme = useTheme();
	const { isWebsocketConnected } = useWebsocket();

	return (
		<Root
			style={{
				backgroundColor: isWebsocketConnected
					? theme.colors.success.main
					: theme.colors.warning.main,
			}}
		>
			{isWebsocketConnected ? <SignalCellular4Bar /> : <SignalCellularConnectedNoInternet4Bar />}
		</Root>
	);
};

export default WebsocketService;
