import React from 'react';

type MusicModeContext = {
	musicMode: boolean;
	setMusicMode: (newMusicMode: boolean) => void;
};

const context = React.createContext<MusicModeContext>(null as unknown as MusicModeContext);

const MusicModeProvider = ({ ...props }) => {
	const [musicMode, setMusicMode] = React.useState<boolean>(false);

	return (
		<context.Provider
			value={React.useMemo(
				() => ({
					musicMode,
					setMusicMode,
				}),
				[musicMode],
			)}
			{...props}
		/>
	);
};

const useMusicMode = () => {
	return React.useContext(context);
};

export { useMusicMode };
export default MusicModeProvider;
