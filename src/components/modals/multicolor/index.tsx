import React from 'react';
import styled from 'styled-components';
import ButtonBase from '../../reusable/button';
import Frame from './frame';

const Root = styled.div`
	background-color: white;
	padding: 16px;
	border-radius: 8px;
	width: calc(100vw - 32px);
	max-width: 400px;
	overflow: auto;
	max-height: calc(100vh - 32px);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Button = styled(ButtonBase)`
	width: 100%;
	font-size: 22px;
	background-color: ${props => props.theme.colors.primary.main};
`;

const Title = styled.h1`
`;

type MulticolorModalProps = React.PropsWithoutRef<{
}>;

type MulticolorModalComponent = React.FunctionComponent<MulticolorModalProps>;

export type FrameData = {
	duration?: number,
	mode?: 1 | 2 | 3 | 7,
	value?: number,
	brightness?: number,
};

const MulticolorModal: MulticolorModalComponent = () => {
	const [framesData, setFramesData] = React.useState<(FrameData & { key: string })[]>([]);

	function randomKey () {
		return Math.random().toString();
	}

	function handleChangeFrameData (newFrameData: FrameData, frameIndex: number) {
		const newFrames = [...framesData];
		newFrames[frameIndex] = { ...newFrameData, key: framesData[frameIndex].key };
		setFramesData(newFrames);
	}

	function handleAddFrame () {
		setFramesData([...framesData, { duration: 50, key: randomKey() }]);
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

	return (
		<Root>
			<Title>Tuts tuts</Title>
			{framesData.map((frameData, index) => <Frame
				key={frameData.key}
				initialFrameData={frameData}
				onChangeFrameData={data => handleChangeFrameData(data, index)}
				onDeleteFrame={() => handleDeleteFrame(index)}
				onCopyFrame={() => handleCopyFrame(index)}
				index={index}
			/>)}
			<Button onClick={handleAddFrame}>Add frame</Button>
		</Root>
	);
};

export default MulticolorModal;
