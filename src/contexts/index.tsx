import React from 'react';
import LampsProvider from './lamps';
import ModalProvider from './modal';
import MusicListenerProvider from './music-listener';
import SettingsProvider from './settings';

/** Place your React's context providers inside this component. They will automatically
* be visible in your whole application. */
const Providers: React.FunctionComponent<React.PropsWithChildren<{}>> = ({ children }) => {
	return <LampsProvider>
		<ModalProvider>
			<SettingsProvider>
				<MusicListenerProvider>
					{children}
				</MusicListenerProvider>
			</SettingsProvider>
		</ModalProvider>
	</LampsProvider>;
};

export default Providers;
