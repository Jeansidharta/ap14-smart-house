type ListenerFunction = (...data: any[]) => void;

export class EventEmitter {
	private listeners: Record<string, ListenerFunction[]> = {};

	on(eventName: string, listener: ListenerFunction) {
		if (this.listeners[eventName]) this.listeners[eventName].push(listener);
		else this.listeners[eventName] = [listener];
	}

	off(eventName: string, listenerToRemove: ListenerFunction) {
		const index = (this.listeners[eventName] || []).findIndex(
			listener => listener === listenerToRemove,
		);
		if (!index) return false;
		this.listeners[eventName].splice(index, 1);
		return true;
	}

	once(eventName: string, listener: ListenerFunction) {
		this.on(eventName, (...args: any[]) => {
			listener(...args);
			this.off(eventName, listener);
		});
	}

	emit(eventName: string, ...data: any[]) {
		(this.listeners[eventName] || []).forEach(listener => listener(...data));
	}
}
