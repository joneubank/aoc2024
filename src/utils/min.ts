/**
 * Find the minimum value in an array of numbers
 * @param inputs
 * @returns
 */
function min(inputs: number[]): number {
	return inputs.reduce((previousMin, value) => value < previousMin ? value : previousMin, inputs[0]);
}
export default min;
