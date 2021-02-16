import React from 'react';
import { useEffectAsync } from './useEffectAsync';

export function useEffectUpdate (effect: Function, deps: unknown[]) {
	const isFirstRender = React.useRef(true);
	useEffectAsync(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		return effect();
	}, deps);
}
