import React from 'react';

type DebounceOptions = {
	startOnCooldown?: boolean;
};

export function useDebounce<T extends (...args: never[]) => unknown>(
	func: T,
	time: number,
	options: DebounceOptions = {},
) {
	const timeoutHandler = React.useRef<number>(0);
	const lastExecution = React.useRef(options.startOnCooldown ? Date.now() : new Date(0).getTime());

	return (...args: Parameters<T>) => {
		const timeDiff = Date.now() - lastExecution.current;
		if (timeDiff >= time) {
			func(...args);
			lastExecution.current = Date.now();
		} else {
			clearTimeout(timeoutHandler.current);
			timeoutHandler.current = (setTimeout(() => {
				func(...args);
				lastExecution.current = Date.now();
			}, time - timeDiff) as unknown) as number;
		}
	};
}
