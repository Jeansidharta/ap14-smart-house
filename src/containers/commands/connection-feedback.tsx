import React from 'react';
import styled, { useTheme } from 'styled-components';
import { WEBSOCKET_CONNECTION_STATE_NAME } from '../../libs/hooks/use-websocket';

const Root = styled.div`
	padding: 4px 16px;
	border-radius: 16px;
	color: white;
	cursor: help;
	box-shadow: ${props => props.theme.shadows.button.small.normal};
`;

type ConnectionFeedbackProps = React.PropsWithoutRef<{
	connectionState: WEBSOCKET_CONNECTION_STATE_NAME;
}>;

type ConnectionFeedbackComponent = React.FunctionComponent<ConnectionFeedbackProps>;

const ConnectionFeedback: ConnectionFeedbackComponent = ({ connectionState }) => {
	const theme = useTheme();

	const feedbackResolver: Record<
		WEBSOCKET_CONNECTION_STATE_NAME,
		{ message: string; backgroundColor: string }
	> = {
		NOT_INITIATED: {
			message: 'The connection has to be initiated',
			backgroundColor: theme.colors.warning.main,
		},
		CLOSED: {
			message: 'The connection was closed by the server',
			backgroundColor: theme.colors.error.main,
		},
		CONNECTED: {
			message: 'The connection is up and running!',
			backgroundColor: theme.colors.success.main,
		},
		CONNECTING: {
			message: 'The connection is currently being stablished...',
			backgroundColor: theme.colors.warning.main,
		},
		ERROR: {
			message: 'There was an error on the connection',
			backgroundColor: theme.colors.error.main,
		},
	};

	const { message, backgroundColor } = feedbackResolver[connectionState];

	return (
		<Root style={{ backgroundColor }} title={message}>
			{connectionState}
		</Root>
	);
};

export default ConnectionFeedback;
