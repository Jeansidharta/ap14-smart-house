import React, { FC } from 'react';
import AudioListenerService from './audio-listener';
import LampSyncerService from './lamp-syncer';
import Modal from './modal';

const Services: FC<{}> = ({}) => {
	return (
		<>
			<AudioListenerService />
			<Modal />
			<LampSyncerService />
		</>
	);
};

export default Services;
