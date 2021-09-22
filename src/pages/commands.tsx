import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
	padding: 32px;
`;

type CommandsPageProps = React.PropsWithoutRef<{}>;

type CommandsPageComponent = React.FunctionComponent<CommandsPageProps>;

const CommandsPage: CommandsPageComponent = ({}) => {
	return <Root>Batata</Root>;
};

export default CommandsPage;
