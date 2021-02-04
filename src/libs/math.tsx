
/**
 * Generate a random integer in the given range
 * @param min Minimum value, included
 * @param max Maximum value, excluded
 */
export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}