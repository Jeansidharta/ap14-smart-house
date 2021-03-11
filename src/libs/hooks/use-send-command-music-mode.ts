import { API_URL } from '../../constants/api-url';
import { useLamps } from '../../contexts/lamps';
import { LampState } from '../../models/lamp-state';
import { usePostData } from './use-post-data';

type LampStateResponse = {
	id: number,
	state: LampState,
}

type LampErrorResponse = {
	error: string,
}

function isLampErrorResponse (a: any): a is LampErrorResponse {
	return a && typeof a.error === 'string';
}

export function useSendCommandMusicMode () {
	const { updateLampData } = useLamps();
	const [rawSendCommand, { loading, error }] = usePostData(`${API_URL}/lamp/music-mode`);

	async function sendCommand (targets: number[], method: 'on' | 'off') {
		const lampStates: (LampStateResponse | LampErrorResponse)[] = (
			await rawSendCommand(``, { targets, method })
		);

		const newStates = lampStates.map(lampStateResponse => {
			if (isLampErrorResponse(lampStateResponse)) return console.error('Error on lamp method:', lampStateResponse);
			else return lampStateResponse;
		}).filter(e => e) as LampStateResponse[];

		updateLampData(newStates);
	}

	return [sendCommand, { loading, error }] as const;
}
