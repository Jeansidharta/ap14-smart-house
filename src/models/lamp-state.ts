export type LampState = {
	ip: string,
	id: number,
	model: string,
	firmwareVersion: number,
	supportedMethods: string[],
	isPowerOn: boolean,
	bright: number,
	colorMode: 'rgb' | 'temperature' | 'hsv' ,
	colorTemperature: number,
	rgb: number,
	hue: number,
	saturation: number,
	name: string,
	flowing: boolean,
	flowParams?: [number, number, number, number][],
	isMusicModeOn: boolean,
};