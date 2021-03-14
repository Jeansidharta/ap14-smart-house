import React from 'react';
import { API_URL } from '../constants/api-url';
import { useLocalStorage } from '../libs/hooks/use-local-storage';
import { LampState } from '../models/lamp-state';

type DictLamps = Record<number, LampState>;
type DictSelectedLamps = Record<number, number>;

type LampsContext = {
	targetLamps: number[],
	addTargetLamp: (lampId: number) => void,
	removeTargetLamp: (lampId: number) => void,
	setTargetLamps: (lampIds: number[]) => void,
	findLampById: (lampId: number) => LampState | undefined;
	allLamps: LampState[],
	isLampSetAsTarget: (id: number) => boolean,
	updateLampData: (newStates: { id: number, state: LampState }[]) => void,
	fetchLamps: () => Promise<void>,
};

const context = React.createContext<LampsContext>(null as any);

const LampsProvider = ({ ...props }) => {
	const [allLamps, setAllLamps] = React.useState<DictLamps>({});
	const [targetLamps, rawSetTargetLamps] = useLocalStorage<DictSelectedLamps>('selected-lamps', {});

	async function fetchLamps () {
		const response = await fetch (API_URL + '/lamp');
		if (response.status < 200 || response.status > 299) throw new Error('Non-200 response');
		const lamps = await response.json() as LampState[];

		const lampsDict: DictLamps = Object.create(null);
		for (const lamp of lamps) {
			lampsDict[lamp.id] = lamp;
		}
		setAllLamps(lampsDict);
	}

	function updateLampData (newStates: { id: number, state: LampState }[]) {
		const newAllLamps = { ...allLamps };
		newStates.forEach(({ id, state }) => {
			newAllLamps[id] = state;
		});
		setAllLamps(newAllLamps);
	}

	React.useEffect(() => {
		fetchLamps();
	}, []);

	function addTargetLamp (lampId: number) {
		const newTargetLamps = { ...targetLamps };
		newTargetLamps[lampId] = lampId;
		rawSetTargetLamps(newTargetLamps);
	}

	function removeTargetLamp (lampId: number) {
		const newTargetLamps = { ...targetLamps };
		delete newTargetLamps[lampId];
		rawSetTargetLamps(newTargetLamps);
	}

	function setTargetLamps (lampIds: number[]) {
		const lampsDict: DictSelectedLamps = {};
		for (const lampId of lampIds) {
			lampsDict[lampId] = lampId;
		}
		rawSetTargetLamps(lampsDict);
	}

	function isLampSetAsTarget (lampId: number) {
		return Boolean(targetLamps[lampId]);
	}

	function findLampById (lampId: number) {
		return allLamps[lampId];
	}

	return <context.Provider value={{
		allLamps: Object.values(allLamps),
		addTargetLamp,
		removeTargetLamp,
		setTargetLamps,
		isLampSetAsTarget,
		findLampById,
		targetLamps: Object.values(targetLamps),
		updateLampData,
		fetchLamps,
	}} {...props} />;
}

const useLamps = () => {
	return React.useContext(context);
}

export { useLamps };
export default LampsProvider;