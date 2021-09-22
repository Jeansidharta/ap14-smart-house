import React from 'react';
import styled from 'styled-components';

import Select from '../../components/reusable/select';
import Button from '../../components/reusable/button';
import { toastifyProblems } from '../../libs/toastify-problems';
import { toast } from 'react-toastify';
import { useWebsocket } from '../../libs/hooks/use-websocket';
import ConnectionFeedback from './connection-feedback';

const Root = styled.div`
	padding: 32px;
	display: flex;
	flex-direction: column;
	align-items: center;
	row-gap: 32px;
`;

const CommandForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 400px;
	row-gap: 16px;
	background-color: ${props => props.theme.colors.white.full};
	padding: 16px;
	border-radius: 16px;
`;

const Terminal = styled.div`
	background-color: ${props => props.theme.colors.black.full};
	padding: 16px;
	width: 100%;
	color: ${props => props.theme.colors.white.full};
`;

type CommandsPageProps = React.PropsWithoutRef<{}>;

type CommandsPageComponent = React.FunctionComponent<CommandsPageProps>;

const CommandsPage: CommandsPageComponent = ({}) => {
	const { websocketConnection, websocketState } = useWebsocket('wss://pc.sidharta.xyz:3091', {
		autoreconnect: 1000,
	});
	const [message, setMessage] = React.useState<string>('');

	function validateCommand(command: string) {
		const problems: string[] = [];

		if (!command) {
			problems.push('You must specify a command');
		}

		return problems;
	}

	function handleCommandSubmit(event: React.FormEvent) {
		event.preventDefault();

		const formElem = event.target as HTMLFormElement;
		const commandElem = formElem['form_command'] as HTMLInputElement;
		const command = commandElem.value;

		const problems = validateCommand(command);

		if (problems.length > 0) {
			toastifyProblems(problems);
			return;
		}

		if (websocketState !== 'CONNECTED') {
			toast.error('Please wait for the connection to establish');
			return;
		}
		setMessage('');
		websocketConnection!.send(`execute ${command}`);
	}

	React.useEffect(() => {
		if (websocketState !== 'CONNECTED') {
			return;
		}

		async function onMessage(event: MessageEvent) {
			const data = event.data;
			if (data instanceof Blob) {
				const text = await data.text();
				setMessage(message => message + text);
			} else {
				setMessage(message => message + data);
			}
		}

		websocketConnection!.addEventListener('message', onMessage);
		return () => websocketConnection!.removeEventListener('message', onMessage);
	}, [websocketConnection, websocketState]);

	return (
		<Root>
			<CommandForm onSubmit={handleCommandSubmit}>
				<h1>Send CLI command</h1>
				<ConnectionFeedback connectionState={websocketState} />
				<Select
					name="form_command"
					fullWidth
					label="Command"
					options={['BeatSync', 'shutdown', 'restart']}
				/>
				<Button backgroundColor={theme => theme.colors.primary.main}>Send</Button>
			</CommandForm>
			{message && (
				<Terminal>
					{message.split('\n').map((segment, index) => (
						<React.Fragment key={index}>
							{segment}
							<br />
						</React.Fragment>
					))}
				</Terminal>
			)}
		</Root>
	);
};

export default CommandsPage;
