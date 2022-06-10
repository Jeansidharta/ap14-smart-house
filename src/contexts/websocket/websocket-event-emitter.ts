import { EventEmitter } from '../../libs/event-emitter';
import { LampState } from '../../models/lamp-state';

export const WebsocketEventTypes = ['lamp-state-arrived'] as const;
export type WebsocketEventTypes = typeof WebsocketEventTypes[number];

export class WebsocketEventEmitter extends EventEmitter {
	on(eventName: 'lamp-state-arrived', listener: (data: LampState) => void): void;
	on(eventName: WebsocketEventTypes, listener: (data: any) => void) {
		return super.on(eventName, listener);
	}

	off(eventName: 'lamp-state-arrived', listener: (data: LampState) => void): boolean;
	off(eventName: WebsocketEventTypes, listener: (data: any) => void) {
		return super.off(eventName, listener);
	}

	once(eventName: 'lamp-state-arrived', listener: (data: LampState) => void): void;
	once(eventName: WebsocketEventTypes, listener: (data: any) => void) {
		return super.once(eventName, listener);
	}

	emit(eventName: 'lamp-state-arrived', data: LampState): void;
	emit(eventName: WebsocketEventTypes, data?: any) {
		return super.emit(eventName, data);
	}
}
