import { useWebsocket } from '../../contexts/websocket';

export function useSendCommand() {
	const { sendMessage } = useWebsocket();

	async function sendCommand(targets: number[], method: string, args: unknown[]) {
		sendMessage({ type: 'call-lamp-method', data: { targets, method, args } });
	}

	return sendCommand;
}
