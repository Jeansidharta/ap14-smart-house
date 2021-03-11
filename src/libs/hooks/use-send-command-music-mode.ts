import { API_URL } from '../../constants/api-url';
import { usePostData } from './use-post-data';

export function useSendCommandMusicMode () {
	const [rawSendCommand, { loading, error }] = usePostData(`${API_URL}/lamp/music-mode`);

	async function sendCommand (targets: number[], method: 'on' | 'off') {
		return rawSendCommand(``, { targets, method });
	}

	return [sendCommand, { loading, error }] as const;
}
