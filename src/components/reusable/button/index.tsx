import React, { FC, PropsWithChildren } from 'react';
import type { DefaultTheme } from 'styled-components';
import styled from 'styled-components';
import Spinner from '../spinner';

type ColorDescriptor = string | ((theme: DefaultTheme) => string);

const Root = styled.button<{
	fullWidth: boolean;
	hoverScaleOffset: number;
	backgroundColor: ColorDescriptor;
	textColor: ColorDescriptor;
}>`
	width: ${({ fullWidth }) => (fullWidth ? `100%` : `max-content`)};
	padding: 4px 16px;
	text-align: center;
	align-items: center;
	display: flex;
	justify-content: center;
	border: 0;
	outline: 0;
	transition: 200ms;
	cursor: pointer;
	border-radius: 8px;
	background-color: ${({ backgroundColor, theme }) =>
		typeof backgroundColor === `string` ? backgroundColor : backgroundColor(theme)};
	color: ${({ textColor, theme }) =>
		typeof textColor === `string` ? textColor : textColor(theme)};
	:hover,
	:focus {
		transform: scale(${({ hoverScaleOffset }) => 1 + hoverScaleOffset});
	}
	:active {
		transform: scale(${({ hoverScaleOffset }) => 1 - hoverScaleOffset});
	}
`;

const Spacing = styled.div`
	height: 1px;
	width: 8px;
`;

/** This is the application's default button. */
const Button: FC<
	PropsWithChildren<
		{
			/**
			 * How much will the button's size increase/decrease when the user hovers/clicks
			 * on it.
			 */
			hoverScaleOffset?: number;

			backgroundColor?: ColorDescriptor;

			textColor?: ColorDescriptor;

			/**
			 * If true, the button's width will be set to `100%`.
			 */
			fullWidth?: boolean;
			isLoading?: boolean;
			rootRef?: React.RefObject<HTMLButtonElement> | null;
		} & Omit<React.ComponentProps<'button'>, 'ref'>
	>
> = ({
	children,
	fullWidth = false,
	hoverScaleOffset = 0.1,
	backgroundColor = (theme: DefaultTheme) => theme.colors.action.main,
	textColor = `rgba(0, 0, 0, 0.8)`,
	rootRef,
	isLoading,
	...props
}) => {
	return (
		<Root
			fullWidth={fullWidth}
			hoverScaleOffset={hoverScaleOffset}
			textColor={textColor}
			backgroundColor={backgroundColor}
			ref={rootRef}
			{...props}
		>
			{children}
			{isLoading && (
				<>
					<Spacing />
					<Spinner size={16} />
				</>
			)}
		</Root>
	);
};

export default Button;
