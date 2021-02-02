import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Select from '../../components/reusable/select';
import { MethodNames } from '../../models/lamp-methods';
import Button from '../../components/reusable/button';
import { InputCommonProps, getMethodInputs } from './resolve-input-elements';
import { toast } from 'react-toastify';
import { useLamps } from '../../contexts/lamps';
import { useSendCommand } from '../../libs/use-send-command';

const Main = styled.div`
	width: 100%;
	min-height: 100vh;
	overflow-y: auto;
	padding: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	max-width: 600px;
`;

export default function RawPage () {
	const { targetLamps } = useLamps();
	const [method, setMethod] = React.useState<string | null>(null);
	const [argsValue, setArgsValue] = React.useState<Record<number, string | number | null>>({});
	const [argumentsInputElements, setArgumentsInputElements] = (
		React.useState<React.FunctionComponent<InputCommonProps>[]>([])
	);

	const [sendCommand, { loading: loadingCommand }] = useSendCommand();

	React.useEffect(() => {
		setArgsValue({});
		if (!method) {
			setArgumentsInputElements([]);
			return;
		}
		const inputElements = getMethodInputs(method);
		if (!inputElements) {
			setArgumentsInputElements([]);
			return;
		}
		setArgumentsInputElements(inputElements);
	}, [method]);

	function handleMethodChange (value: string | null) {
		setMethod(value);
	}

	function handleArgumentChange (value: string | number | null, index: number) {
		setArgsValue({ ...argsValue, [index]: value });
	}

	function getArgumentsArray () {
		let argsArray: (string | number)[] = [];
		if (!argsValue[0]) return argsArray;
		argsArray.push(argsValue[0]);
		if (!argsValue[1]) return argsArray;
		argsArray.push(argsValue[1]);
		if (!argsValue[2]) return argsArray;
		argsArray.push(argsValue[2]);
		if (!argsValue[3]) return argsArray;
		argsArray.push(argsValue[3]);
		return argsArray;
	}

	async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (loadingCommand) {
			toast.error('Already sending request');
			return;
		}
		const args = getArgumentsArray();
		if (!method) {
			toast.error('No method selected');
			return;
		}
		await sendCommand(targetLamps, method, args);
		toast.success('Command sent successful');
	}

	return (
		<>
			<Head>
				<title>Controller home</title>
			</Head>
			<Main>
				<Form onSubmit={handleSubmit}>
					<Select
						options={MethodNames}
						onChangeValue={val => handleMethodChange(val as string | null)}
						label="Method"
					/>
					{argumentsInputElements.map((InputElement, index) => (
						<InputElement onChange={value => handleArgumentChange(value, index)} key={index} />
					))}
					<Button isLoading={loadingCommand} content="Submit" type="submit" />
				</Form>
			</Main>
		</>
	);
}
