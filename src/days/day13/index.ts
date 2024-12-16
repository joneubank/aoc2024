import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
import isTrue from '../../utils/isTrue.ts';
// Named aliases just to make sense of the code, this is the same struct
type Button = { x: number; y: number };
type Target = { x: number; y: number };

type Machine = { a: Button; b: Button; prize: Target };

type Inputs = Machine[];

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	const buttonARegex = /Button A: X\+(?<X>[\d]+), Y\+(?<Y>[\d]+)/;
	const buttonBRegex = /Button B: X\+(?<X>[\d]+), Y\+(?<Y>[\d]+)/;
	const prizeRegex = /Prize: X=(?<X>[\d]+), Y=(?<Y>[\d]+)/;

	let aCapture: Button | undefined;
	let bCapture: Button | undefined;
	let prizeCapture: Target | undefined;

	for await (const line of iterator) {
		if (line.trim().length === 0) {
			aCapture = undefined;
			bCapture = undefined;
			prizeCapture = undefined;
			continue;
		}

		const buttonAResult = buttonARegex.exec(line);
		if (buttonAResult && buttonAResult.groups) {
			aCapture = { x: Number(buttonAResult.groups.X), y: Number(buttonAResult.groups.Y) };
			continue;
		}
		const buttonBResult = buttonBRegex.exec(line);
		if (buttonBResult && buttonBResult.groups) {
			bCapture = { x: Number(buttonBResult.groups.X), y: Number(buttonBResult.groups.Y) };
			continue;
		}
		const prizeResult = prizeRegex.exec(line);
		if (prizeResult && prizeResult.groups) {
			prizeCapture = { x: Number(prizeResult.groups.X), y: Number(prizeResult.groups.Y) };
			if (aCapture && bCapture) {
				initialValue.push({ a: aCapture, b: bCapture, prize: prizeCapture });
			}
			continue;
		}
	}
	return initialValue;
}

function solveStepsForMachine(machine: Machine, log: Logger): false | { a: number; b: number } {
	const { a, b, prize: { x, y } } = machine;

	// (x - (y * a_x / a_y)) / (b_x - (b_y * a_x / a_y))
	const bSteps = (y - (x * a.y / a.x)) / (b.y - (b.x * a.y / a.x));

	// A = (y - Bb_y) / a_y
	const aSteps = (x - bSteps * b.x) / a.x;

	const roundedA = Math.round(aSteps);
	const roundedB = Math.round(bSteps);
	return roundedA * a.x + roundedB * b.x === x && roundedA * a.y + roundedB * b.y === y
		? { a: Math.round(aSteps), b: Math.round(bSteps) }
		: false;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	return inputs
		.map((machine) => solveStepsForMachine(machine, log))
		.filter((solution) => solution !== false)
		.reduce(
			(sum, solution) => sum + 3 * solution.a + solution.b,
			0,
		);
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	return inputs
		.map((machine) =>
			solveStepsForMachine({
				...machine,
				prize: { x: machine.prize.x + 10000000000000, y: machine.prize.y + 10000000000000 },
			}, log)
		)
		.filter((solution) => solution !== false)
		.reduce(
			(sum, solution) => sum + 3 * solution.a + solution.b,
			0,
		);
}

const Day13 = createAocProblemRunner<Inputs>({
	day: 0,
	initialInputs: () => [],
	inputFilePath: './src/days/day13/input.txt',
	testInputFilePath: './src/days/day13/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default Day13;
