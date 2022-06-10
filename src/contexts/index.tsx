import React, { FC, PropsWithChildren } from 'react';
import LampsProvider from './lamps';
import ModalProvider from './modal';
import MusicListenerProvider from './music-listener';
import MusicModeProvider from './music-mode';
import SettingsProvider from './settings';
import WebsocketProvider from './websocket';

/** Place your React's context providers inside this component. They will automatically
 * be visible in your whole application. */
const Providers: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<WebsocketProvider>
			<LampsProvider>
				<ModalProvider>
					<SettingsProvider>
						<MusicListenerProvider>
							<MusicModeProvider>{children}</MusicModeProvider>
						</MusicListenerProvider>
					</SettingsProvider>
				</ModalProvider>
			</LampsProvider>
		</WebsocketProvider>
	);
};

export default Providers;
