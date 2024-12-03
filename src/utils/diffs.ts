/**
 * Find the difference between adjacent values in an array. This is returned
 * as a new array of numbers with length one less than the input array.
 *
 * @example
 * diffs([1, 4, 9, 16, 25]);
 * // [3, 5, 7, 9]
 *
 * @param input
 * @returns
 */
function diffs(input: number[]) {
	return input.reduce<number[]>((acc, value, index, array) => {
		if (index === 0) {
			return acc;
		}
		acc.push(array[index - 1] - value);
		return acc;
	}, []);
}

export default diffs;
