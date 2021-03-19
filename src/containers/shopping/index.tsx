import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import Spinner from '../../components/reusable/spinner';
import { SHOPPING_LIST_API } from '../../constants/api-url';
import { useGetData } from '../../libs/hooks/use-get-data';
import { ShoppingListItem } from '../../models/shopping-list';
import ListItem from './list-item';

const Root = styled.div`
	padding: 16px;
`;

const Title = styled.h1`
	margin: 0;
`;

const ListItemContainer = styled.div`
	margin-top: 32px;
	display: flex;
	flex-direction: column;
	row-gap: 16px;
`;

type ShoppingProps = React.PropsWithoutRef<{
}>;

type ShoppingComponent = React.FunctionComponent<ShoppingProps>;

const Shopping: ShoppingComponent = ({  }) => {
	const [shoppingList, loadingList] = useGetData<ShoppingListItem[]>(SHOPPING_LIST_API + '/list');

	return (
		<>
			<Head>
				<title>Lista de compras - ap14</title>
			</Head>
			<Root>
				<Title>Lista de compras</Title>
				<ListItemContainer>
					{ loadingList && <Spinner /> }
					{ !loadingList && shoppingList && shoppingList.map(item => (
						<ListItem key={item.id} item={item} />
					)) }
				</ListItemContainer>
			</Root>
		</>
	);
}

export default Shopping;