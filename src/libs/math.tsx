/**
 * Generate a random integer in the given range
 * @param min Minimum value, included
 * @param max Maximum value, excluded
 */
export function getRandomInt(min: number, max: number): number {
	const minInt = Math.ceil(min);
	const maxInt = Math.floor(max);
	// The maximum is exclusive and the minimum is inclusive
	return Math.floor(Math.random() * (maxInt - minInt) + minInt);
}
