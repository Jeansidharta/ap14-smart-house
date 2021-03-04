import React from 'react';
import styled from 'styled-components';
import type { FrameData } from '.';

const Root = styled.div`
`;

type FrameProps = React.PropsWithoutRef<{
	frameData: FrameData,
	onChangeFrameData?: (newFrameData: FrameData) => void,
}>;

type FrameComponent = React.FunctionComponent<FrameProps>;

const Frame: FrameComponent = ({
	frameData: { brightness, duration, mode, value },
	onChangeFrameData = () => {},
}) => {
	function handleChangeSomething () {
		onChangeFrameData({});
	}

	return (
		<Root>
			{brightness}
			{duration}
			{mode}
			{value}
		</Root>
	);
};

export default Frame;
