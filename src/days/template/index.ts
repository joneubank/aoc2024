import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
type Inputs = string[];

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	for await (const line of iterator) {
		initialValue.push(line);
	}
	return initialValue;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	return 0;
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	return 0;
}

const DayX = createAocProblemRunner<Inputs>({
	day: 0,
	initialInputs: () => [],
	inputFilePath: './src/days/day00/input.txt',
	// testInputFilePath: './src/days/day00/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default DayX;
