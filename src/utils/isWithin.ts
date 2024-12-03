export type Range = { min: number; max: number };

/**
 * Determine if a value is within a range, inclusive of the min and max.
 * @param value
 * @param range
 * @returns
 */
function isWithin(value: number, range: Range): boolean {
	return value >= range.min && value <= range.max;
}

export default isWithin;
