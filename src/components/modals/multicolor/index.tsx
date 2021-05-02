import { TextField } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import ButtonBase from '../../reusable/button';
import Checkbox from '../../reusable/checkbox';
import Select from '../../reusable/select';
import Frame from './frame';
import Add from '@material-ui/icons/Add';
import { useModal } from '../../../contexts/modal';
import { useSendCommand } from '../../../libs/hooks/use-send-command';
import { useLamps } from '../../../contexts/lamps';
import { toast } from 'react-toastify';

const Root = styled.div`
	background-color: white;
	padding: 16px;
	border-radius: 8px;
	width: 100%;
	max-width: 400px;
	display: grid;
	justify-items: center;
	row-gap: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const AddFrameButton = styled(ButtonBase)`
	align-self: flex-end;
	font-size: 16px;
	margin-top: 8px;
`;

const ButtonsContainer = styled.div`
	width: 100%;
	display: grid;
	align-items: center;
	grid-template-columns: 1fr 1fr;
	column-gap: 16px;
`;

const SubmitButton = styled(ButtonBase)`
	width: 100%;
	background-color: ${props => props.theme.colors.success.main};
	color: white;
`;

const CancelButton = styled(ButtonBase)`
	width: 100%;
	background-color: ${props => props.theme.colors.error.main};
	color: white;
`;

const FramesContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16px;
	margin: 8px 0;
	border: 1px solid black;
	border-radius: 12px;
	width: 100%;
`;

const FramesContainerTitle = styled.h2`
	margin: 0;
`;

const Title = styled.h1`
	margin: 0;
`;

type MulticolorModalProps = React.PropsWithoutRef<{
}>;

type MulticolorModalComponent = React.FunctionComponent<MulticolorModalProps>;

export type FrameData = {
	duration?: number,
	mode?: 1 | 2 | 3 | 7,
	value?: number,
	brightness: number,
};

const MulticolorModal: MulticolorModalComponent = () => {
	const { closeModal } = useModal();
	const [sendCommand, { loading: loadingCommand }] = useSendCommand();
	const [framesData, setFramesData] = React.useState<(FrameData & { key: string })[]>([]);
	const [count, setCount] = React.useState<number>(1);
	const [isCountInfinite, setIsCountInfinite] = React.useState<boolean>(true);
	const [flowAction, setflowAction] = React.useState<number>(1);
	const { targetLamps } = useLamps();

	function randomKey () {
		return Math.random().toString();
	}

	function handleChangeFrameData (newFrameData: Partial<FrameData>, frameIndex: number) {
		const newFrames = [...framesData];
		const frameToChange = framesData[frameIndex];
		newFrames[frameIndex] = {
			...newFrameData,
			key: frameToChange.key!,
			brightness: frameToChange.brightness || 100,
		};
		setFramesData(newFrames);
	}

	function handleAddFrame () {
		setFramesData([...framesData, { duration: 5000, key: randomKey(), brightness: 100 }]);
	}

	function handleDeleteFrame (frameIndex: number) {
		const newFramesData = [...framesData];
		newFramesData.splice(frameIndex, 1);
		setFramesData(newFramesData);
	}

	function handleCopyFrame (frameIndex: number) {
		const newFramesData = [...framesData];
		newFramesData.splice(frameIndex, 0, { ...framesData[frameIndex], key: randomKey() });
		setFramesData(newFramesData);
	}

	function handleIsCountInfiniteChange (newValue: boolean) {
		setIsCountInfinite(newValue);
	}

	function handleCountChange (event: React.ChangeEvent) {
		const countValue = Number((event.target as HTMLInputElement).value);
		setCount(countValue);
	}

	function validateData () {
		const errors = framesData.map((frameData, index) => {
			const baseErrorMessage = `No frame ${index}, `;
			if (frameData.duration === undefined) return baseErrorMessage + 'você deve fornecer uma duração';
			if (frameData.brightness === undefined) return baseErrorMessage + 'você deve fornecer uma luminosidade';
			if (frameData.mode === undefined) return baseErrorMessage + 'você deve especificar um modo cor';
			if (frameData.mode !== 7 && !frameData.value === undefined) return baseErrorMessage + 'você deve especificar uma cor';
			if (frameData.duration < 50) return baseErrorMessage + 'a duração deve ser maior que 50 milissegundos';
			return null;
		});
		if (framesData.length < 2) errors.push('Você deve ter pelo menos um total de dois frames');
		return errors.filter(e => e) as string[];
	}

	function makeData () {
		const dataCount = isCountInfinite ? 0 : count;
		const frames = framesData.flatMap(frame => {
			let { brightness, duration, mode, value } = frame;
			if (mode === 3) mode = 1; // Transform HSV mode into RGB
			if (mode === 7) value = 0; // When going to sleep, just use a zero value.
			return [duration, mode, value, brightness];
		}).join(',');
		return [dataCount, flowAction, frames];
	}

	async function handleSubmit () {
		const errors = validateData();
		if (errors.length > 0) return toast.error(<>{errors.map(error => <p key={error}>{error}</p>)}</>);
		await sendCommand(targetLamps, 'start_cf', makeData());
		closeModal();
		return;
	}

	function handleCancel () {
		closeModal();
	}

	return (
		<Root>
			<Title>Tuts tuts</Title>
			<Checkbox
				label='Is flow infinite?'
				defaultChecked={true}
				onChangeValue={handleIsCountInfiniteChange}
			/>
			{ !isCountInfinite &&
				<TextField
					fullWidth
					type='number'
					label='Number of iterations'
					onChange={handleCountChange}
					defaultValue={1}
					disabled={isCountInfinite}
					inputProps={{ min: 1, max: 100 }}
				/>
			}
			{ !isCountInfinite &&
				<Select
					label='After finishing the flow...'
					defaultValue='0'
					options={[
						{ text: 'Recover the last state', value: 0 },
						{ text: 'Stay at the ending state', value: 1 },
						{ text: 'Turn the lamp off', value: 2 },
					]}
					onChangeValue={newAction => setflowAction(newAction)}
					fullWidth
				/>
			}
			<FramesContainer>
				<FramesContainerTitle>Frames</FramesContainerTitle>
				{framesData.map((frameData, index) => <Frame
					key={frameData.key}
					initialFrameData={frameData}
					onChangeFrameData={data => handleChangeFrameData(data, index)}
					onDeleteFrame={() => handleDeleteFrame(index)}
					onCopyFrame={() => handleCopyFrame(index)}
					index={index}
				/>)}
				<AddFrameButton onClick={handleAddFrame}><Add /> Add frame</AddFrameButton>
			</FramesContainer>
			<ButtonsContainer>
				<CancelButton onClick={handleCancel}>Cancelar</CancelButton>
				<SubmitButton onClick={handleSubmit} isLoading={loadingCommand}>Enviar</SubmitButton>
			</ButtonsContainer>
		</Root>
	);
};

export default MulticolorModal;
