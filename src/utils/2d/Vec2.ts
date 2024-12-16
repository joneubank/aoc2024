export type Vec2 = [number, number];

function add(a: Vec2, b: Vec2): Vec2 {
	return [a[0] + b[0], a[1] + b[1]];
}
function scale(vec: Vec2, scale: number): Vec2 {
	return [vec[0] * scale, vec[1] * scale];
}

function diff(a: Vec2, b: Vec2): Vec2 {
	return [b[0] - a[0], b[1] - a[1]];
}

/**
 * mod x and mod y of an input value
 * @param value
 * @param modulus
 */
function wrap(value: Vec2, modulus: Vec2): Vec2 {
	const x = value[0] % modulus[0];
	const y = value[1] % modulus[1];

	return [x >= 0 ? x : modulus[0] + x, y >= 0 ? y : modulus[1] + y];
}

function hash(input: Vec2): string {
	return input.join(',');
}

function negate(input: Vec2): Vec2 {
	return [-input[0], -input[1]];
}

function within(testValue: Vec2, bounds: [Vec2, Vec2]): boolean {
	return testValue[0] >= Math.min(...bounds.map((b) => b[0])) &&
		testValue[0] <= Math.max(...bounds.map((b) => b[0])) &&
		testValue[1] >= Math.min(...bounds.map((b) => b[1])) &&
		testValue[1] <= Math.max(...bounds.map((b) => b[1]));
}

const Vec2Utils = { add, diff, hash, negate, scale, within, wrap };
export default Vec2Utils;
