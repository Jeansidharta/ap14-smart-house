import React from 'react';
import styled from 'styled-components';
import { useGetData } from '../../../libs/use-get-data';
import { useLocalStorage } from '../../../libs/use-local-storage';
import { LampState } from '../../../models/lamp-state';
import Checkbox from '../checkbox';
import Spinner from '../spinner';

const Root = styled.div`
`;

const CheckboxContainer = styled.div`
	display: flex;
`;

type SelectLampsProps = React.PropsWithoutRef<{
onChange?: (lamps: string[]) => void,
}>;

type SelectLampsComponent = React.FunctionComponent<SelectLampsProps>;

const SelectLamps: SelectLampsComponent = ({
	onChange = () => {},
}) => {
	const [targetLampsId, setTargetLampsId] = useLocalStorage<Record<number, true>>('selected-lamps', {});
	const [allLamps, loadingLamps] = useGetData<LampState[]>('http://192.168.0.100:3232/lamp');

	function handleTargetLampChange (lampId: number, newValue: boolean) {
		const newTargetLampsId = { ...targetLampsId };
		if (newValue) newTargetLampsId[lampId] = true;
		else delete newTargetLampsId[lampId];	
		setTargetLampsId(newTargetLampsId);
	}

	React.useEffect(() => {
		onChange(Object.keys(targetLampsId));
	}, [targetLampsId]);

	if (loadingLamps) return <Spinner />;

	return (
		<Root>
			Send to whom?
			{allLamps?.map(lamp => (
				<CheckboxContainer defaultChecked key={lamp.id}>
					<Checkbox
						onChange={val => handleTargetLampChange(lamp.id, val)}
						value={targetLampsId[lamp.id] || false}
						label={lamp.name}
					/>
				</CheckboxContainer>
			))}
		</Root>
	);
}

export default SelectLamps;