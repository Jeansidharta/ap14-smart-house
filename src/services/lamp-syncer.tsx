import React from 'react';
import styled from 'styled-components';
import { useLampStateSyncer } from '../contexts/lamp-state-syncer';
import { useLamps } from '../contexts/lamps';

const Root = styled.div`
`;

type LampSyncerServiceProps = React.PropsWithoutRef<{
}>;

type LampSyncerServiceComponent = React.FunctionComponent<LampSyncerServiceProps>;

const LampSyncerService: LampSyncerServiceComponent = ({  }) => {
	const { lampStateSyncer } = useLampStateSyncer();
	const { fetchLamps } = useLamps();

	React.useEffect(() => {
		if (!lampStateSyncer.shouldSync) return;

		const intervalHandler = setInterval(fetchLamps, lampStateSyncer.syncInterval * 1000);
		return () => clearInterval(intervalHandler);
	}, [lampStateSyncer.shouldSync, lampStateSyncer.syncInterval]);

	return (
		<Root>
		</Root>
	);
}

export default LampSyncerService;