import React, { FC } from 'react';
import styled from 'styled-components';
import type { Settings } from '../../contexts/settings';
import { useSettings } from '../../contexts/settings';
import Checkbox from '../reusable/checkbox';
import Select from '../reusable/select';

const Root = styled.div`
	background-color: white;
	padding: 16px;
	border-radius: 8px;
	width: calc(100vw - 32px);
	max-width: 400px;
`;

const Form = styled.div`
	display: grid;
	row-gap: 32px;
`;

const Title = styled.h1`
	text-align: center;
`;

const SettingsModal: FC<{}> = () => {
	const { updateSettings, settings } = useSettings();

	function handleColorModeChange(colorMode: Settings['colorMode']) {
		updateSettings({ colorMode });
	}

	function handleRedundantButtonChange(showOnOff: boolean) {
		updateSettings({ showOnOff });
	}

	function handleShowRandomColorButtonChange(showRandomColorButton: boolean) {
		updateSettings({ showRandomColorButton });
	}

	return (
		<Root>
			<Title>Configurações</Title>
			<Form>
				<Select
					defaultValue={settings.colorMode}
					onChangeValue={handleColorModeChange}
					fullWidth
					label="Tipo de seletor de cor"
					options={[
						{ text: `RGB`, value: `rgb` },
						{ text: `HSV`, value: `hsv` },
						{ text: `Temperatura`, value: `temperature` },
					]}
				/>
				<Checkbox
					defaultChecked={React.useMemo(() => settings.showOnOff, [])}
					onChangeValue={handleRedundantButtonChange}
					label="Usar botão redundante de on/off?"
				/>
				<Checkbox
					defaultChecked={React.useMemo(() => settings.showRandomColorButton, [])}
					onChangeValue={handleShowRandomColorButtonChange}
					label="Mostrar botão de cor aleatória?"
				/>
			</Form>
		</Root>
	);
};

export default SettingsModal;
