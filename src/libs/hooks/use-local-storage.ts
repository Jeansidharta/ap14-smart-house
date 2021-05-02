import React from 'react';

function useLocalStorageWithInitialValue<T>(key: string, initialValue: T | (() => T)) {
	function getInitialValue() {
		if (initialValue instanceof Function) return initialValue();
		else return initialValue;
	}

	const [value, rawSetValue] = React.useState<T>(initialValue);

	React.useEffect(() => {
		const value = localStorage.getItem(key);
		if (value === null) setValue(getInitialValue());
		else rawSetValue(JSON.parse(value));
	}, [key]);

	function setValue(newValue: T) {
		localStorage.setItem(key, JSON.stringify(newValue));
		rawSetValue(newValue);
	}

	return [value, setValue];
}

function useLocalStorageWithoutInitialValue<T>(key: string) {
	const [value, rawSetValue] = React.useState<T | null>(null);

	React.useEffect(() => {
		const value = localStorage.getItem(key);
		if (value === null) setValue(null);
		else rawSetValue(JSON.parse(value));
	}, [key]);

	function setValue(newValue: T | null) {
		if (newValue === null) localStorage.removeItem(key);
		else localStorage.setItem(key, JSON.stringify(newValue));
		rawSetValue(newValue);
	}

	return [value, setValue];
}

export function useLocalStorage<T extends Object>(
	key: string,
): [T | null, (newValue: T | null) => void];

export function useLocalStorage<T extends Object>(
	key: string,
	initialValue: T | (() => T),
): [T, (newValue: T) => void];

export function useLocalStorage<T extends Object>(key: string, initialValue?: T | (() => T)) {
	if (initialValue) return useLocalStorageWithInitialValue(key, initialValue);
	else return useLocalStorageWithoutInitialValue(key);
}
