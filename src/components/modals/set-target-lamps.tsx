import React from 'react';
import styled from 'styled-components';
import { useLamps } from '../../contexts/lamps';
import Checkbox from '../reusable/checkbox';
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import { TextField } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useSendCommand } from '../../libs/use-send-command';
import Spinner from '../reusable/spinner';

const Root = styled.div`
	padding: 16px;
	background-color: white;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.h1`
	font-size: 24px;
	margin: 0 0 16px 0;
`;

const CheckboxContainer = styled.div`
	display: flex;
	align-items: center;
`;

const EditingLampForm = styled.form`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Button = styled.button`
	background-color: transparent;
	border: none;
	cursor: pointer;
	position: relative;
	left: -8px;
	transition: 200ms;
	background-color: white;
	border-radius: 8px;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	:hover {
		filter: invert(1);
	}
`;

type SetTargetLampModalProps = React.PropsWithoutRef<{
}>;

type SetTargetLampModalComponent = React.FunctionComponent<SetTargetLampModalProps>;

const SetTargetLampModal: SetTargetLampModalComponent = ({  }) => {
	const [editingLamp, setEditingLamp] = React.useState<number | null>(null);
	const { allLamps, addTargetLamp, removeTargetLamp, isLampSetAsTarget } = useLamps();
	const [sendCommand, { loading: loadingCommand }] = useSendCommand();

	function handleTargetLampChange (lampId: number, checked: boolean) {
		if (checked) addTargetLamp(lampId);
		else removeTargetLamp(lampId);
	}

	async function handleEditNameSubmit (event: React.FormEvent<HTMLFormElement>, lampId: number) {
		event.preventDefault();
		const name = ((event.target as HTMLFormElement).lampName as HTMLInputElement).value;
		if (!name) {
			toast.error('Você deve dar um nome');
			return;
		}
		await sendCommand([lampId], 'set_name', [name]);
		setEditingLamp(null);
	}

	return (
		<Root>
			<Title>Selecione as lâmpadas</Title>
			{allLamps.map(lamp => (
				editingLamp === lamp.id
					? <EditingLampForm key={lamp.id} onSubmit={event => handleEditNameSubmit(event, lamp.id)}>
						<TextField
							defaultValue={lamp.name}
							label='name'
							name='lampName'
						/>
						{loadingCommand
							? <Spinner size={20} />
							: <Button type='button' onClick={() => setEditingLamp(null)}>
								<Close />
							</Button>
						}
					</EditingLampForm> : <CheckboxContainer key={lamp.id}>
						<Checkbox
							onChange={val => handleTargetLampChange(lamp.id, val)}
							value={isLampSetAsTarget(lamp.id)}
							label={lamp.name}
						/>
						<Button onClick={() => setEditingLamp(lamp.id)}>
							<Edit fontSize='small' />
						</Button>
					</CheckboxContainer>
			))}
		</Root>
	);
}

export default SetTargetLampModal;