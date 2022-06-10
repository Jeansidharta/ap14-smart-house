// Framework
import React, { FC } from 'react';
import Head from 'next/head';

// Misc
import FilledThemeProvider from '../theme';
import Providers from '../contexts';
import AppContainer from '../containers/_app';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Services from '../services';

const MyApp: FC<{
	Component: any;
	pageProps: any;
}> = ({ Component, pageProps }) => {
	React.useEffect(() => {
		if (`serviceWorker` in navigator) {
			navigator.serviceWorker.register(`/sw.js`).then(() => {
				console.warn(`Service Worker Registered`);
			});
		}
	}, []);

	return (
		<>
			<Head>
				{/* Global styling */}
				<style>
					{`
					body, html, #__next {
						height: 100%;
						margin: 0;
					}
					* {
						box-sizing: border-box;
						user-select: none;
					}
				`}
				</style>
				{/* Favicon related stuff */}
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				{/* These meta tags are related to OpenGraph, which allows for better webpage cards. */}
				{/* TODO - put real content here */}
				<meta property="og:title" content="My page title" />
				<meta property="og:site-name" content="My page site name" />
				<meta property="og:description" content="My page description" />
				{/* <meta property='og:url' content={deployedUrl + '/'} /> */}'{/* PWA stuff */}
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<link rel="apple-touch-icon" href="single-page-icon.png" />
				<meta name="apple-mobile-web-app-title" content="Ap 14 remote" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<link rel="manifest" href="manifest.json" />
			</Head>

			<FilledThemeProvider>
				<Providers>
					<AppContainer>
						<Services />
						<ToastContainer hideProgressBar />
						<Component {...pageProps} />
					</AppContainer>
				</Providers>
			</FilledThemeProvider>
		</>
	);
};

export default MyApp;
