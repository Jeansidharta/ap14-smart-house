import React, { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';

import List from '@mui/icons-material/List';
import DeveloperMode from '@mui/icons-material/DeveloperMode';

const Root = styled.div`
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: ${props => props.theme.shadows.layout.large.strong.normal};
`;

const Tab = styled.div<{ selected: boolean }>`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: 200ms;
	${props => (props.selected ? `` : ``)}
`;

const Footer: FC<{}> = () => {
	const router = useRouter();

	return (
		<Root>
			<Link href="/">
				<Tab selected={router.pathname === `/`}>
					<DeveloperMode onClick={() => router.push(`/`)} />
				</Tab>
			</Link>
			<Link href="/raw">
				<Tab selected={router.pathname === `/raw`}>
					<List />
				</Tab>
			</Link>
		</Root>
	);
};

export default Footer;
