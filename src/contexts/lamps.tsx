import React from 'react';
import { LAMP_API } from '../constants/api-url';
import { useLocalStorage } from '../libs/hooks/use-local-storage';
import { LampState } from '../models/lamp-state';
import hsvToRgb from 'hsv-rgb';

type DictLamps = Record<number, LampState>;
type DictSelectedLamps = Record<number, number>;

type LampsContext = {
	targetLamps: number[];
	addTargetLamp: (lampId: number) => void;
	removeTargetLamp: (lampId: number) => void;
	setTargetLamps: (lampIds: number[]) => void;
	findLampById: (lampId: number) => LampState | undefined;
	allLamps: LampState[];
	isLampSetAsTarget: (id: number) => boolean;
	updateLampData: (newStates: { id: number; state: LampState }[]) => void;
	fetchLamps: () => Promise<void>;
	mediumTargetLampsColor: [number, number, number];
};

const context = React.createContext<LampsContext>(null as any);

const LampsProvider = ({ ...props }) => {
	const [allLamps, setAllLamps] = React.useState<DictLamps>({});
	const [targetLamps, rawSetTargetLamps] = useLocalStorage<DictSelectedLamps>('selected-lamps', {});

	async function fetchLamps() {
		const response = await fetch(LAMP_API + '/lamp');
		if (response.status < 200 || response.status > 299) throw new Error('Non-200 response');
		const lamps = (await response.json()) as LampState[];

		const lampsDict: DictLamps = Object.create(null);
		for (const lamp of lamps) {
			lampsDict[lamp.id] = lamp;
		}
		setAllLamps(lampsDict);
	}

	const updateLampData = React.useCallback(
		(newStates: { id: number; state: LampState }[]) => {
			setAllLamps(allLamps => ({
				...allLamps,
				...Object.fromEntries(newStates.map(({ state, id }) => [id, state])),
			}));
		},
		[setAllLamps],
	);

	React.useEffect(() => {
		fetchLamps().catch(e => console.log(e));
	}, []);

	function addTargetLamp(lampId: number) {
		const newTargetLamps = { ...targetLamps };
		newTargetLamps[lampId] = lampId;
		rawSetTargetLamps(newTargetLamps);
	}

	function removeTargetLamp(lampId: number) {
		const newTargetLamps = { ...targetLamps };
		delete newTargetLamps[lampId];
		rawSetTargetLamps(newTargetLamps);
	}

	function setTargetLamps(lampIds: number[]) {
		const lampsDict: DictSelectedLamps = {};
		for (const lampId of lampIds) {
			lampsDict[lampId] = lampId;
		}
		rawSetTargetLamps(lampsDict);
	}

	function isLampSetAsTarget(lampId: number) {
		return Boolean(targetLamps[lampId]);
	}

	function findLampById(lampId: number) {
		return allLamps[lampId];
	}

	const targetLampsArray = Object.values(targetLamps);

	const mediumTargetLampsColor = (() => {
		const sumColor = [0, 0, 0] as [number, number, number];
		for (const lampId of targetLampsArray) {
			const lamp = findLampById(lampId);
			if (!lamp) continue;
			const [r, g, b] = hsvToRgb(lamp.hue, lamp.saturation, 100);
			sumColor[0] += r;
			sumColor[1] += g;
			sumColor[2] += b;
		}
		return [
			Math.floor(sumColor[0] / targetLampsArray.length),
			Math.floor(sumColor[1] / targetLampsArray.length),
			Math.floor(sumColor[2] / targetLampsArray.length),
		] as [number, number, number];
	})();

	return (
		<context.Provider
			value={{
				allLamps: Object.values(allLamps),
				addTargetLamp,
				removeTargetLamp,
				setTargetLamps,
				isLampSetAsTarget,
				findLampById,
				targetLamps: targetLampsArray,
				updateLampData,
				fetchLamps,
				mediumTargetLampsColor,
			}}
			{...props}
		/>
	);
};

const useLamps = () => {
	return React.useContext(context);
};

export { useLamps };
export default LampsProvider;
