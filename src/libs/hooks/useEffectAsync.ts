import React from 'react';

export function useEffectAsync (effect: Function, deps: any[]) {
	React.useEffect(() => {
		const ret = effect();
		if (ret instanceof Promise) return;
		else return ret;
	}, deps);
}