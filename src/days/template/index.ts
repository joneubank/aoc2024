import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
type Inputs = { listOne: number[]; listTwo: number[] };

function inputLineReducer(accumulator: Inputs, line: string, log: Logger) {
	return accumulator;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	return 0;
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	return 0;
}

const DayX = createAocProblemRunner<Inputs>({
	day: 0,
	initialInputs: { listOne: [], listTwo: [] },
	inputFilePath: './src/days/day00/input.txt',
	// testInputFilePath: './src/days/day00/input_test.txt',
	inputLineReducer,
	part1Solver,
	part2Solver,
});

export default DayX;
