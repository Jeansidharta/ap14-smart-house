import React from 'react';

export type WEBSOCKET_CONNECTION_STATE_NAME =
	| 'NOT_INITIATED'
	| 'CONNECTING'
	| 'CONNECTED'
	| 'ERROR'
	| 'CLOSED';

type State = {
	websocketState: WEBSOCKET_CONNECTION_STATE_NAME;
	websocketConnection: WebSocket | null;
};

type Options = {
	/**
	 * The time (in milisseconds) to auto-reconnect whenever the connection errors
	 * or closes. Set to null if it shouldn't auto-reconnect
	 */
	autoreconnect: null | number;
};

export function useWebsocket(url: string, options: Partial<Options> = {}) {
	const [state, setState] = React.useState<State>({
		websocketConnection: null,
		websocketState: 'NOT_INITIATED',
	});

	const connect = React.useCallback(() => {
		const websocket = new WebSocket(url);

		setState({ websocketConnection: websocket, websocketState: 'CONNECTING' });
		websocket.addEventListener('open', () => {
			console.log('OPEN');
			setState({ websocketConnection: websocket, websocketState: 'CONNECTED' });
		});
		websocket.addEventListener('close', () => {
			setState({ websocketConnection: null, websocketState: 'CLOSED' });
		});
		websocket.addEventListener('error', () => {
			setState({ websocketConnection: null, websocketState: 'ERROR' });
		});

		return websocket;
	}, []);

	React.useEffect(() => {
		const websocket = connect();

		return () => {
			websocket.close();
		};
	}, []);

	React.useEffect(() => {
		if (!options.autoreconnect) {
			return;
		}

		switch (state.websocketState) {
			case 'NOT_INITIATED':
			case 'CONNECTING':
			case 'CONNECTED':
				return;
			case 'CLOSED':
			case 'ERROR':
				break;
		}

		const handler = setTimeout(connect, options.autoreconnect);
		return () => clearTimeout(handler);
	}, [state.websocketState, options]);

	return { ...state, connect };
}
