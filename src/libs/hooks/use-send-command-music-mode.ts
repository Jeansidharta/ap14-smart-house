import { LAMP_API } from '../../constants/api-url';
import { useLamps } from '../../contexts/lamps';
import { LampState } from '../../models/lamp-state';
import { useEffectUpdate } from './use-effect-update';
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
	const [rawSendCommand, { loading, error, data }] = usePostData<(LampStateResponse | LampErrorResponse)[]>(`${LAMP_API}/lamp/music-mode`);

	async function sendCommand (targets: number[], method: 'on' | 'off') {
		await rawSendCommand(``, { targets, method });
	}

	useEffectUpdate(([oldLoading]) => {
		if (loading || !oldLoading || !data) return;

		const newStates = data.map(lampStateResponse => {
			if (isLampErrorResponse(lampStateResponse)) return console.error('Error on lamp method:', lampStateResponse);
			else return lampStateResponse;
		}).filter(e => e) as LampStateResponse[];

		updateLampData(newStates);
	}, [loading]);

	return [sendCommand, { loading, error, data }] as const;
}
