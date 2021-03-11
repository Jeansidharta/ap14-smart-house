import React from 'react';

type MusicListenerContext = {
	isListening: boolean;
	setIsListening: (isListening: boolean) => void,
};

const context = React.createContext<MusicListenerContext>(null as unknown as MusicListenerContext);

const MusicListenerProvider = ({ ...props }) => {
	const [isListening, setIsListening] = React.useState<boolean>(false);

	return <context.Provider value={React.useMemo(() => ({
		isListening,
		setIsListening,
	}), [isListening])} {...props} />;
}

const useMusicListener = () => {
	return React.useContext(context);
}

export { useMusicListener };
export default MusicListenerProvider;