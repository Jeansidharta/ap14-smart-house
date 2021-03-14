import React from 'react';

type LampStateSyncer = {
	shouldSync: boolean,
	syncInterval: number, // seconds
};

type LampStateSyncerContext = {
	lampStateSyncer: LampStateSyncer,
	changeSyncInterval: (neInterval: number) => void,
	toggleShouldSync: () => void,
};

const context = React.createContext<LampStateSyncerContext>(null as unknown as LampStateSyncerContext);

const LampStateSyncerProvider = ({ ...props }) => {
	const [lampStateSyncer, setLampStateSyncer] = React.useState<LampStateSyncer>({
		shouldSync: true,
		syncInterval: 5,
	});

	function changeSyncInterval (newInterval: number) {
		setLampStateSyncer({ ...lampStateSyncer, syncInterval: newInterval });
	}

	function toggleShouldSync () {
		setLampStateSyncer({ ...lampStateSyncer, shouldSync: !lampStateSyncer.shouldSync });
	}

	return <context.Provider value={React.useMemo(() => ({
		lampStateSyncer,
		changeSyncInterval,
		toggleShouldSync,
	}), [lampStateSyncer])} {...props} />;
}

const useLampStateSyncer = () => {
	return React.useContext(context);
}

export { useLampStateSyncer };
export default LampStateSyncerProvider;