import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Footer from '../../components/layout/footer';
import Select from '../../components/reusable/select';
import { MethodNames } from '../../models/lamp-methods';
import Button from '../../components/reusable/button';
import { useGetData } from '../../libs/use-get-data';
import { usePostData } from '../../libs/use-post-data';
import Checkbox from '../../components/reusable/checkbox';
import Spinner from '../../components/reusable/spinner';
import { LampState } from '../../models/lamp-state';
import { InputCommonProps, getMethodInputs } from './resolve-input-elements';
import { useLocalStorage } from '../../libs/use-local-storage';
import { toast } from 'react-toastify';

const Main = styled.div`
	width: 100%;
	height: 100%;
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

const CheckboxContainer = styled.div`
	display: flex;

`;

export default function Home () {
	const [targetLampsId, setTargetLampsId] = useLocalStorage<Record<string, true>>('selected-lamps', {});
	const [method, setMethod] = React.useState<string | null>(null);
	const [argsValue, setArgsValue] = React.useState<Record<number, string | number | null>>({});
	const [argumentsInputElements, setArgumentsInputElements] = (
		React.useState<React.FunctionComponent<InputCommonProps>[]>([])
	);

	const [allLamps, loadingLamps] = useGetData<LampState[]>('http://192.168.0.100:3232/lamp');
	const [sendCommand, { loading: loadingCommand }] = usePostData('http://192.168.0.100:3232/lamp/rawmethod');

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
		const targets = Object.keys(targetLampsId);
		await sendCommand('', { targets, method, args });
		toast.success('Command sent successful');
	}

	function handleTargetLampChange (lampId: number, newValue: boolean) {
		const newTargetLampsId = { ...targetLampsId };
		if (newValue) newTargetLampsId[lampId] = true;
		else delete newTargetLampsId[lampId];
		setTargetLampsId(newTargetLampsId);
	}

	return (
		<>
			<Head>
				<title>Controller home</title>
			</Head>
			<Main>
				<Form onSubmit={handleSubmit}>
					Send to whom?
					{loadingLamps && <Spinner />}
					{allLamps?.map(lamp => (
						<CheckboxContainer defaultChecked key={lamp.id}>
							<Checkbox
								onChange={val => handleTargetLampChange(lamp.id, val)}
								value={targetLampsId[lamp.id] || false}
								label={lamp.name}
							/>
						</CheckboxContainer>
					))}
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
			<Footer />
		</>
	);
}
