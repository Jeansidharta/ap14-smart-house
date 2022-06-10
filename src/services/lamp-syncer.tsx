import React, { FC } from 'react';
import styled from 'styled-components';
import { useLampStateSyncer } from '../contexts/lamp-state-syncer';
import { useLamps } from '../contexts/lamps';

const Root = styled.div``;

const LampSyncerService: FC<{}> = ({}) => {
	const { lampStateSyncer } = useLampStateSyncer();
	const { fetchLamps } = useLamps();

	React.useEffect(() => {
		if (!lampStateSyncer.shouldSync) return;

		const intervalHandler = setInterval(
			() => fetchLamps().catch(e => console.log(e)),
			lampStateSyncer.syncInterval * 1000,
		);
		return () => clearInterval(intervalHandler);
	}, [lampStateSyncer.shouldSync, lampStateSyncer.syncInterval]);

	return <Root></Root>;
};

export default LampSyncerService;
