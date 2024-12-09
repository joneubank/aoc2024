export type Vec2 = [number, number];

function add(a: Vec2, b: Vec2): Vec2 {
	return [a[0] + b[0], a[1] + b[1]];
}

function diff(a: Vec2, b: Vec2): Vec2 {
	return [b[0] - a[0], b[1] - a[1]];
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

const Vec2Utils = { add, diff, negate, within };
export default Vec2Utils;
