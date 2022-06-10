import React, { FC } from 'react';
import AudioListenerService from './audio-listener';
import LampSyncerService from './lamp-syncer';
import Modal from './modal';
import WebsocketService from './websocket';

const Services: FC<{}> = ({}) => {
	return (
		<>
			<AudioListenerService />
			<Modal />
			<LampSyncerService />
			<WebsocketService />
		</>
	);
};

export default Services;
