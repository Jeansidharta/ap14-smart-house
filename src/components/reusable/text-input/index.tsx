import React, { FC } from 'react';
import styled from 'styled-components';

const Root = styled.label`
	display: flex;
	flex-direction: column;
	margin: 8px 0px;
`;

const Input = styled.input``;

const TextArea = styled(Input).attrs({ as: `textarea` })``;

/**
 * This is the application's default text input component
 */
const TextInput: FC<
	{
		/** The text that indicates the field's name */
		label: string;
		numberOfLines?: number;
	} & Omit<React.ComponentProps<'label'>, 'ref'>
> = ({ label, numberOfLines = 1, ...props }) => {
	return (
		<Root {...props}>
			{label}
			{numberOfLines === 1 ? <Input /> : <TextArea />}
		</Root>
	);
};

export default TextInput;
