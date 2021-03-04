/** *************************************************************************
*                         What is this file?                               *
*                                                                          *
* This file declares some global types available for the whole project.    *
*                                                                          *
************************************************************************** */

/** ************************** Module types **************** */
/* Types related to un-typed modules */

declare module "hsv-rgb" {
	export default (hue: number, saturation: number, value: number) => [0, 0, 0] as [number, number, number];
}
declare module "color-temperature" {
	export const colorTemperature2rgb = (temperature: number) => ({ red: 0, green: 0, blue: 0 } as { red: number, green: number, blue: number });
	export const rgb2colorTemperature = ({ red: number, green: number, blue: number }) => 0 as number;
}
declare module "rgb-hsv" {
	export default (red: number, green: number, blue: number) => [0, 0, 0] as [number, number, number];
}

/** ************************** Image-import related types **************** */
/* This section exists solely to allow for import of image-related types without
 * the compiler complaining. Don't think too much about it */

declare module "*.svg" {
	const content: string;
	export default content;
}
declare module "*.png" {
	const content: string;
	export default content;
}
declare module "*.jpeg" {
	const content: string;
	export default content;
}
declare module "*.jpg" {
	const content: string;
	export default content;
}

// Other stuff...
// Empty for the moment. Add new things here...
