import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
`;

type ShoppingProps = React.PropsWithoutRef<{
}>;

type ShoppingComponent = React.FunctionComponent<ShoppingProps>;

const Shopping: ShoppingComponent = ({  }) => {
	return (
		<Root>
			Shopping
		</Root>
	);
}

export default Shopping;