/**
 * Find the maximum value in an array of numbers
 * @param inputs
 * @returns
 */
function max(inputs: number[]): number {
	return inputs.reduce((previousMax, value) => value > previousMax ? value : previousMax, inputs[0]);
}
export default max;
