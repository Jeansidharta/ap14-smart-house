import { LAMP_API } from '../../constants/api-url';
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

export function useSendCommand () {
	const { updateLampData } = useLamps();
	const [rawSendCommand, { loading, error }] = usePostData(`${LAMP_API}/lamp/rawmethod`);

	async function sendCommand (targets: number[], method: string, args: unknown[]) {
		const lampStates: (LampStateResponse | LampErrorResponse)[] = (
			await rawSendCommand(``, { targets, method, args })
		);

		const newStates = lampStates.map(lampStateResponse => {
			if (isLampErrorResponse(lampStateResponse)) return console.error('Error on lamp method:', lampStateResponse);
			else return lampStateResponse;
		}).filter(e => e) as LampStateResponse[];

		updateLampData(newStates);
	}

	return [sendCommand, { loading, error }] as const;
}
