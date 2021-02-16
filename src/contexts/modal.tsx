import React from 'react';

type ModalContext = {
	_element: React.ReactNode | null,
	_options: ModalOptions,
	openModal: (element: React.ReactNode | null, newOptions?: ModalOptions) => void,
	closeModal: () => void,
};

type ModalOptions = {
	backdropClickClose: boolean,
};

const defaultModalOptions: ModalOptions = { backdropClickClose: true };

const context = React.createContext<ModalContext>(null as unknown as ModalContext);

const ModalProvider = ({ ...props }) => {
	const [element, setElement] = React.useState<React.ReactNode | null>(null);
	const [options, setOptions] = React.useState<ModalOptions>(defaultModalOptions);

	function closeModal () {
		setElement(null);
	}

	function openModal (newElement: React.ReactNode, newOptions: ModalOptions = defaultModalOptions) {
		setElement(newElement);
		setOptions(newOptions);
	}

	return <context.Provider
		value={React.useMemo(() => ({
			_element: element,
			_options: options,
			openModal,
			closeModal,
		}), [element, options, openModal, closeModal])} {...props}
	/>;
};

const useModal = () => {
	return React.useContext(context);
};

export { useModal };
export default ModalProvider;
