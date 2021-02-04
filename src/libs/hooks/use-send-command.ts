import { API_URL } from '../../constants/api-url';
import { usePostData } from './use-post-data';

export function useSendCommand() {
	const [rawSendCommand, { loading, error }] = usePostData(API_URL + '/lamp/rawmethod');

	async function sendCommand (targets: number[], method: string, args: any[]) {
		return rawSendCommand('', { targets, method, args });
	}

	return [sendCommand, { loading, error }] as const;
}