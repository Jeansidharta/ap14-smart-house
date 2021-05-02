import React from 'react';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
	public static async getInitialProps(ctx: DocumentContext) {
		const StyledComponentsSheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props => (
						<>{StyledComponentsSheet.collectStyles(<App {...props} />)}</>
					),
				});
			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{StyledComponentsSheet.getStyleElement()}
					</>
				),
			};
		} finally {
			StyledComponentsSheet.seal();
		}
	}

	public render() {
		return (
			// The `og` prefix is to allow for OpenGraph tools to read info from the site
			<Html lang="pt-br" prefix="og: http://ogp.me/ns#">
				<Head>
					{/* TODO - Set custom page description */}
					<meta name="description" content="My personal description" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
