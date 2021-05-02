import React from 'react';
import { useEffectAsync } from './useEffectAsync';

export function useEffectUpdate<T extends unknown[]>(
	effect: (lastDeps: T) => void | Function,
	deps: T,
) {
	const isFirstRender = React.useRef(true);
	const lastDeps = React.useRef<any>();
	useEffectAsync(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			lastDeps.current = deps;
			return;
		}

		const effectReturn = effect(lastDeps.current);
		lastDeps.current = deps;

		return effectReturn;
	}, deps);
}
