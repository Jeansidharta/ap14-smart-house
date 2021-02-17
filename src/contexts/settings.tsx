import React from 'react';
import { useLocalStorage } from '../libs/hooks/use-local-storage';

export type Settings = {
	colorMode: 'hsv' | 'rgb' | 'temperature',
	showOnOff: boolean,
};

type SettingsContext = {
	settings: Settings,
	updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
	colorMode: `temperature`,
	showOnOff: false,
};

const context = React.createContext<SettingsContext>(null as unknown as SettingsContext);

const SettingsProvider = ({ ...props }) => {
	const [settings, rawSetSettings] = useLocalStorage<Settings>(`user-settings`, defaultSettings);

	function updateSettings (partialSettings: Partial<Settings>) {
		rawSetSettings({ ...settings, ...partialSettings });
	}

	return <context.Provider
		value={React.useMemo(() => ({
			settings,
			updateSettings,
		}), [settings])} {...props}
	/>;
};

const useSettings = () => {
	return React.useContext(context);
};

export { useSettings };
export default SettingsProvider;
