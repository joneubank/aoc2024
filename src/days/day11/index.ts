import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
import splitByWhitespace from '../../utils/splitByWhitespace.ts';
type Inputs = Map<number, number>;

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	for await (const line of iterator) {
		splitByWhitespace(line).forEach((value) => {
			const numericValue = Number(value);
			const current = initialValue.get(numericValue);
			initialValue.set(numericValue, current === undefined ? 1 : current + 1);
		});
	}
	return initialValue;
}

// blink once
function iterateStones(input: Map<number, number>): Map<number, number> {
	const output: Map<number, number> = new Map();

	function addCount(value: number, count: number) {
		const current = output.get(value);
		output.set(value, current === undefined ? count : current + count);
	}

	input.entries().forEach(([value, count]) => {
		const stringValue = String(value);
		switch (true) {
			case value === 0: {
				addCount(1, count);
				break;
			}
			case stringValue.length % 2 === 0: {
				addCount(Number(stringValue.slice(0, stringValue.length / 2)), count);
				addCount(Number(stringValue.slice(stringValue.length / 2)), count);
				break;
			}
			default: {
				addCount(value * 2024, count);
			}
		}
	});
	return output;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	let nextList = inputs;
	for (let blink = 0; blink < 25; blink++) {
		nextList = iterateStones(nextList);
	}

	return nextList.values().reduce((sum, count) => sum + count, 0);
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	let nextList = inputs;
	for (let blink = 0; blink < 75; blink++) {
		nextList = iterateStones(nextList);
	}

	return nextList.values().reduce((sum, count) => sum + count, 0);
}

const DayX = createAocProblemRunner<Inputs>({
	day: 0,
	initialInputs: () => new Map(),
	inputFilePath: './src/days/day11/input.txt',
	testInputFilePath: './src/days/day11/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default DayX;
