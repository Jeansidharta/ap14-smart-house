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
	const isMouseDownRef = React.useRef<number | boolean>(false);
	const mouseStartPosition = React.useRef<Coords>({ x: 0, y: 0 });
	const mousePosition = React.useRef<Coords>({ x: 0, y: 0 });

	function wasEventOnElement (target: HTMLElement) {
		while(target !== elemRef.current){
			//  the click was not on a desireable element.
			if (target === document.body) return false;
			target = target.parentElement!;
		}
		return true;
	}

	function handleMouseDown (event: MouseEvent) {
		const { clientX: x, clientY: y } = event;
		if (!wasEventOnElement(event.target as HTMLElement)) return;

		mousePosition.current = { x, y };
		mouseStartPosition.current = { x, y };
		isMouseDownRef.current = true;

		if (eventHandlers.onMouseChange) {
			eventHandlers.onMouseChange(mousePosition.current);
		}
	}

	function findTouchWithIdentifier (touches: TouchList, identifier: number) {
		for (let i = 0; i < touches.length; i ++) {
			const touch = touches.item(i)!;
			if (touch.identifier === identifier) return touch;
		}
		return null;
	}

	function handleMouseMove (event: MouseEvent) {
		if (isMouseDownRef.current === false) return;
		const { clientX: x, clientY: y } = event;
		const deltaMousePosition = {
			x: x - mousePosition.current.x,
			y: y - mousePosition.current.y,
		};
		mousePosition.current = { x, y };
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
		const { clientX: x, clientY: y } = event;
		mousePosition.current = { x, y };
		isMouseDownRef.current = false;
	}

	function handleTouchStart (event: TouchEvent) {
		if (isMouseDownRef.current !== false) return;
		if (!wasEventOnElement(event.target as HTMLElement)) return;
		const touch = event.changedTouches.item(0)!;
		const { clientX: x, clientY: y } = touch;

		mousePosition.current = { x, y };
		mouseStartPosition.current = { x, y };
		isMouseDownRef.current = touch.identifier;

		if (eventHandlers.onMouseChange) {
			eventHandlers.onMouseChange(mousePosition.current);
		}
	}

	function handleTouchEnd (event: TouchEvent) {
		if (isMouseDownRef.current === false) return;
		if (typeof(isMouseDownRef.current) !== 'number') return;
		const touch = findTouchWithIdentifier(event.changedTouches, isMouseDownRef.current);
		if (!touch) return;
		const { clientX: x, clientY: y } = touch;
		mousePosition.current = { x, y };
		isMouseDownRef.current = false;
	}

	function handleTouchMove (event: TouchEvent) {
		if (isMouseDownRef.current === false) return;
		if (typeof(isMouseDownRef.current) !== 'number') return;
		const touch = findTouchWithIdentifier(event.changedTouches, isMouseDownRef.current);
		if (!touch) return;
		const { clientX: x, clientY: y } = touch;
		const deltaMousePosition = {
			x: x - mousePosition.current.x,
			y: y - mousePosition.current.y,
		};
		mousePosition.current = { x, y };
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


	React.useEffect(() => {
		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchstart', handleTouchStart);
		document.addEventListener('touchend', handleTouchEnd);
		document.addEventListener('touchmove', handleTouchMove);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('touchend', handleTouchEnd);
			document.removeEventListener('touchmove', handleTouchMove);
		}
	}, [eventHandlers]);
}

export { useMouseDrag };