export function pairs<T>(input: T[]): [T, T][] {
	const output: [T, T][] = [];
	for (let i = 0; i < input.length - 1; i++) {
		for (let j = i + 1; j < input.length; j++) {
			output.push([input[i], input[j]]);
		}
	}
	return output;
}
