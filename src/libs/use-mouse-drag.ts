import React from 'react';

export type Coords = { x: number, y: number };

export type MouseDragEvent = {
	mousePosition: Coords,
	mouseStartPosition: Coords,
	deltaMousePosition: Coords,
};

type EventHandlers = {
	onDrag?: (event: MouseDragEvent) => void,
	onMouseChange?: (coords: Coords) => void,
};

function useMouseDrag (elemRef: React.RefObject<HTMLElement | null>, eventHandlers: EventHandlers) {
	const isMouseDownRef = React.useRef<boolean>(false);
	const mouseStartPosition = React.useRef<Coords>({ x: 0, y: 0 });
	const mousePosition = React.useRef<Coords>({ x: 0, y: 0 });

	function updateMousePosition (event: MouseEvent) {
		const { clientX: x, clientY: y } = event;
		mousePosition.current = { x, y };
	}

	function wasClickOnElement (target: HTMLElement) {
		while(target !== elemRef.current){
			//  the click was not on a desireable element.
			if (target === document.body) return false;
			target = target.parentElement!;
		}
		return true;
	}

	function handleMouseDown (event: MouseEvent) {
		const { clientX: x, clientY: y } = event;
		if (!wasClickOnElement(event.target as HTMLElement)) return;

		updateMousePosition(event);
		mouseStartPosition.current = { x, y };
		isMouseDownRef.current = true;

		if (eventHandlers.onMouseChange) {
			eventHandlers.onMouseChange(mousePosition.current);
		}
	}

	function handleMouseMove (event: MouseEvent) {
		if (!isMouseDownRef.current) return;
		const { clientX: x, clientY: y } = event;
		const deltaMousePosition = {
			x: x - mousePosition.current.x,
			y: y - mousePosition.current.y,
		};
		updateMousePosition(event);
		if (eventHandlers.onDrag) {
			eventHandlers.onDrag({
				mousePosition: mousePosition.current,
				deltaMousePosition,
				mouseStartPosition: mouseStartPosition.current,
			});
		}

		if (eventHandlers.onMouseChange) {
			eventHandlers.onMouseChange(mousePosition.current);
		}
	}

	function handleMouseUp (event: MouseEvent) {
		updateMousePosition(event);
		isMouseDownRef.current = false;
	}

	React.useEffect(() => {
		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		}
	}, [eventHandlers]);
}

export { useMouseDrag };