/**
 * Trivial, do nothing function. Useful for filtering an array to remove falsey
 * values.
 *
 * @example
 * const myArray: boolean[] = [true, false, true];
 * const trueCount = myArray.filter(isTrue).length; // 2
 *
 * @param value
 * @returns boolean for the truthiness of the input value
 */
function isTrue(value: unknown) {
	return !!value;
}
export default isTrue;
