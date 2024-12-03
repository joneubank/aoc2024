import { randomBetween, randomIntegerBetween, randomSeeded } from '@std/random';
import { writeFile } from 'node:fs';

const prng = randomSeeded(BigInt(Math.floor(Math.random() * 100000)));

const randomFloat = (min: number, max: number) => randomBetween(min, max, { prng });
const randomInt = (min: number, max: number) => randomIntegerBetween(min, max, { prng });
const randomBool = (chance = 0.5) => randomFloat(0, 1) <= chance;
const randomChoice = <T>(options: ReadonlyArray<T>): T => options[randomInt(0, options.length - 1)];

function generateReport(options: { minLength?: number; maxLength?: number; errorChance?: number }): number[] {
	const minLength = options.minLength ?? 6;
	const maxLength = options.maxLength ?? 100;
	const errorChance = options.errorChance ?? 0.02;

	const length = randomInt(minLength, maxLength);
	const isAscending = randomBool();
	const start = isAscending ? randomInt(1, 50) : length * 4 + randomInt(1, 50);
	const output: number[] = [start];

	function step(isAscending: boolean, from: number, size: number): number {
		return isAscending ? from + size : from - size;
	}
	for (let i = 0; i < length; i++) {
		const error = randomBool(errorChance);
		if (error) {
			const errorType = randomChoice(['direction', 'stepSize'] as const);
			switch (errorType) {
				case 'direction': {
					const next = step(!isAscending, output[output.length - 1], randomInt(1, 3));
					output.push(next);
					break;
				}
				case 'stepSize': {
					const next = step(isAscending, output[output.length - 1], randomBool(0.5) ? 0 : randomInt(4, 7));
					output.push(next);
					break;
				}
			}
		} else {
			const next = step(isAscending, output[output.length - 1], randomInt(1, 3));
			output.push(next);
		}
	}
	return output;
}

const reportCount = 10000;
const reports: number[][] = [];
for (let i = 0; i < reportCount; i++) {
	reports.push(generateReport({}));
}

const output = reports.map((report) => report.join(' ')).join('\n');
writeFile('./src/days/day02/input_generated.txt', output, null, () => {
	console.log('done');
});
