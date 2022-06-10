import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WEBSOCKET_URL } from '../../constants/api-url';
import { useDebounce } from '../../libs/hooks/use-debounce';
import {
	isWebsocketMessage,
	isWebsocketMessageLampState,
	WebsocketMessage,
} from '../../models/websocket-message';
import { WebsocketEventEmitter } from './websocket-event-emitter';

type WebsocketContext = {
	isWebsocketConnected: boolean;
	websocketEventEmitter: WebsocketEventEmitter;
	sendMessage: (message: WebsocketMessage) => boolean;
};

const context = React.createContext<WebsocketContext>(null as unknown as WebsocketContext);

function parseData(data: string) {
	try {
		const dataJson = JSON.parse(data);
		if (isWebsocketMessage(dataJson)) return dataJson;
		return null;
	} catch (e) {
		console.error('Failed to parse JSON data:', data);
		return null;
	}
}

const WebsocketProvider = ({ ...props }) => {
	const [websocket, setWebsocket] = useState<WebSocket | null>();
	const [isWebsocketConnected, setIsWebsocketConnected] = useState<boolean>(false);
	const { current: websocketEventEmitter } = useRef(new WebsocketEventEmitter());

	const sendMessage = useCallback(
		(message: WebsocketMessage) => {
			if (!websocket || !isWebsocketConnected) return false;
			websocket.send(JSON.stringify(message));
			return true;
		},
		[websocket, isWebsocketConnected],
	);

	const initWebsocket = useCallback(async () => {
		const websocket = new WebSocket(WEBSOCKET_URL);
		setWebsocket(websocket);

		function handleError() {
			setIsWebsocketConnected(false);
		}

		function handleOpen() {
			setIsWebsocketConnected(true);
		}

		function handleMessage({ data: message }: MessageEvent) {
			const parsedMessage = parseData(message);
			if (!parsedMessage) return;
			if (isWebsocketMessageLampState(parsedMessage)) {
				websocketEventEmitter.emit('lamp-state-arrived', parsedMessage.data);
			} else {
				console.error(`Websocket received unknown mesage type:`, message);
			}
		}

		function handleClose() {
			setWebsocket(null);
			setIsWebsocketConnected(false);
		}

		websocket.addEventListener('error', handleError);
		websocket.addEventListener('open', handleOpen);
		websocket.addEventListener('message', handleMessage);
		websocket.addEventListener('close', handleClose);
	}, [setWebsocket]);

	const debouncedInitWebsocket = useDebounce(initWebsocket, 1000);

	useEffect(() => {
		if (websocket) return;
		debouncedInitWebsocket();
	}, [debouncedInitWebsocket, websocket]);

	return (
		<context.Provider
			value={React.useMemo(
				() => ({
					isWebsocketConnected,
					websocketEventEmitter,
					sendMessage,
				}),
				[isWebsocketConnected, websocketEventEmitter, sendMessage],
			)}
			{...props}
		/>
	);
};

const useWebsocket = () => {
	return React.useContext(context);
};

export { useWebsocket };
export default WebsocketProvider;
