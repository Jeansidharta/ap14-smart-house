import React from 'react';
import { useSendCommandMusicMode } from '../libs/hooks/use-send-command-music-mode';
import { useLamps } from './lamps';

type MusicModeContext = {
	musicMode: boolean,
	setMusicMode: (newMusicMode: boolean) => void,
};

const context = React.createContext<MusicModeContext>(null as unknown as MusicModeContext);

const MusicModeProvider = ({ ...props }) => {
	const [musicMode, setMusicMode] = React.useState<boolean>(false);
	const { targetLamps, allLamps, findLampById } = useLamps();
	const [sendCommandMusicMode] = useSendCommandMusicMode();

	React.useEffect(() => {
		console.log(musicMode, allLamps);
		const targetLampsToSwitch = targetLamps.filter(lamp => findLampById(lamp)?.isMusicModeOn !== musicMode);
		const nonTargetLampsToSwitch = allLamps.filter(lamp => !targetLamps.find(id => id === lamp.id) && lamp.isMusicModeOn === true);
		console.log({ targetLampsToSwitch });
		console.log({ nonTargetLampsToSwitch });
		if (targetLampsToSwitch.length > 0) {
			sendCommandMusicMode(targetLampsToSwitch, musicMode ? 'on' : 'off');
		}
		if (nonTargetLampsToSwitch.length > 0) {
			const ids = nonTargetLampsToSwitch.map(l => l.id);
			sendCommandMusicMode(ids, !musicMode ? 'on' : 'off');
		}
	}, [musicMode, targetLamps.length]);

	return <context.Provider value={React.useMemo(() => ({
		musicMode,
		setMusicMode,
	}), [musicMode])} {...props} />;
}

const useMusicMode = () => {
	return React.useContext(context);
}

export { useMusicMode };
export default MusicModeProvider;