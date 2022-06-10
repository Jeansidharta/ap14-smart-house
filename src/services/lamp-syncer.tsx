import { FC, useEffect } from 'react';
import { useLamps } from '../contexts/lamps';
import { useWebsocket } from '../contexts/websocket';
import { LampState } from '../models/lamp-state';

const LampSyncerService: FC<{}> = ({}) => {
	const { websocketEventEmitter, isWebsocketConnected, sendMessage } = useWebsocket();
	const { updateLampData } = useLamps();

	useEffect(() => {
		function updateLampsData(state: LampState) {
			updateLampData([{ id: state.id!, state }]);
		}

		websocketEventEmitter.on('lamp-state-arrived', updateLampsData);
		return () => {
			websocketEventEmitter.off('lamp-state-arrived', updateLampsData);
		};
	}, [websocketEventEmitter, updateLampData]);

	useEffect(() => {
		if (!isWebsocketConnected) return;
		sendMessage({ type: 'request-all-lamps' });
	}, [isWebsocketConnected, websocketEventEmitter]);

	return null;
};

export default LampSyncerService;
