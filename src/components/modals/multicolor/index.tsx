import React from 'react';
import styled from 'styled-components';
import Button from '../../reusable/button';
import Frame from './frame';

const Root = styled.div`
	background-color: white;
	padding: 16px;
	border-radius: 8px;
	width: calc(100vw - 32px);
	max-width: 400px;
`;

const Title = styled.h1`
`;

type MulticolorModalProps = React.PropsWithoutRef<{
}>;

type MulticolorModalComponent = React.FunctionComponent<MulticolorModalProps>;

export type FrameData = {
	duration?: number,
	mode?: 1 | 2 | 7,
	value?: number,
	brightness?: number,
};

const MulticolorModal: MulticolorModalComponent = () => {
	const [framesData, setFramesData] = React.useState<FrameData[]>([]);

	function handleChangeFrameData (newFrameData: FrameData, frameIndex: number) {
		const newFrames = [...framesData];
		newFrames[frameIndex] = newFrameData;
		setFramesData(newFrames);
	}

	function handleAddFrame () {
		setFramesData([...framesData, {}]);
	}

	return (
		<Root>
			<Title>Tuts tuts</Title>
			{framesData.forEach((frameData, index) => <Frame
				frameData={frameData}
				onChangeFrameData={data => handleChangeFrameData(data, index)}
			/>)}
			<Button onClick={handleAddFrame}>Add frame</Button>
		</Root>
	);
};

export default MulticolorModal;
