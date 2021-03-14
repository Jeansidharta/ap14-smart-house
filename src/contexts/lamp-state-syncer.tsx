import React from 'react';
import { useLocalStorage } from '../libs/hooks/use-local-storage';

type LampStateSyncer = {
	shouldSync: boolean,
	syncInterval: number, // seconds
};

type LampStateSyncerContext = {
	lampStateSyncer: LampStateSyncer,
	updateShouldSync: (shouldSync: boolean) => void,
	setLampStateSyncer: (newLampStateSyncer: LampStateSyncer) => void,
};

const context = React.createContext<LampStateSyncerContext>(null as unknown as LampStateSyncerContext);

const LampStateSyncerProvider = ({ ...props }) => {
	const [lampStateSyncer, setLampStateSyncer] = useLocalStorage<LampStateSyncer>(
		'lamp-state-syncer',
		{
			shouldSync: true,
			syncInterval: 5,
		}
	);

	function updateShouldSync (shouldSync: boolean) {
		setLampStateSyncer({ ...lampStateSyncer, shouldSync });
	}

	return <context.Provider value={React.useMemo(() => ({
		lampStateSyncer,
		updateShouldSync,
		setLampStateSyncer,
	}), [lampStateSyncer])} {...props} />;
}

const useLampStateSyncer = () => {
	return React.useContext(context);
}

export { useLampStateSyncer };
export default LampStateSyncerProvider;