import React, { useCallback } from 'react';

type ModalContext = {
	_element: React.ReactNode | null;
	_options: ModalOptions;
	openModal: (element: React.ReactNode | null, newOptions?: Partial<ModalOptions>) => void;
	closeModal: () => void;
};

type ModalOptions = {
	backdropClickClose: boolean;
	escKeyClose: boolean;
};

const defaultModalOptions: ModalOptions = { backdropClickClose: true, escKeyClose: true };

const context = React.createContext<ModalContext>(null as unknown as ModalContext);

const ModalProvider = ({ ...props }) => {
	const [element, setElement] = React.useState<React.ReactNode | null>(null);
	const [options, setOptions] = React.useState<ModalOptions>(defaultModalOptions);

	const closeModal = useCallback(() => {
		setElement(null);
	}, [setElement]);

	const openModal = useCallback(
		(newElement: React.ReactNode, newOptions: Partial<ModalOptions> = defaultModalOptions) => {
			setElement(newElement);
			setOptions({ ...defaultModalOptions, ...newOptions });
		},
		[setElement, setOptions],
	);

	return (
		<context.Provider
			value={React.useMemo(
				() => ({
					_element: element,
					_options: options,
					openModal,
					closeModal,
				}),
				[element, options, openModal, closeModal],
			)}
			{...props}
		/>
	);
};

const useModal = () => {
	return React.useContext(context);
};

export { useModal };
export default ModalProvider;
