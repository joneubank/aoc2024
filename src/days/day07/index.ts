import getLogger from '../../logger.ts';
import readInputLines from '../../readInputs.ts';
import Timer from '../../timer.ts';

type CalibrationEquation = { target: number; values: number[] };
type Inputs = CalibrationEquation[];

const DAY = '07';

let cachedInputs: Inputs | undefined;

async function readInputs(log: ReturnType<typeof getLogger>): Promise<Inputs> {
	if (cachedInputs) {
		return cachedInputs;
	}

	const lines: CalibrationEquation[] = [];
	const linesIterator = readInputLines(`./src/days/day${DAY}/input.txt`);
	for await (const line of linesIterator) {
		const [target, values] = line.split(':');
		const equation = { target: Number(target), values: values.trim().split(' ').map(Number) };
		lines.push(equation);
	}

	cachedInputs = lines;
	return cachedInputs;
}

export async function part1(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 1, silenced);

	const input = await readInputs(log);

	const timer = new Timer();

	function recursiveCanSolve(equation: CalibrationEquation, currentValue: number): boolean {
		const { target, values } = equation;
		if (currentValue > target) {
			return false;
		}

		if (values.length === 0) {
			return currentValue === target;
		}

		const nextInputValue = values[0];
		const nextValues = values.slice(1);

		// product first
		return recursiveCanSolve({ target, values: nextValues }, currentValue * nextInputValue) ||
			recursiveCanSolve({ target, values: nextValues }, currentValue + nextInputValue);
	}

	const solution = input
		.filter((equation) => recursiveCanSolve(equation, 0))
		.reduce(
			(sum, equation) => equation.target + sum,
			0,
		);

	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}

export async function part2(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 2, silenced);

	const input = await readInputs(log);

	function recursiveCanSolve(equation: CalibrationEquation, currentValue: number): boolean {
		const { target, values } = equation;
		if (currentValue > target) {
			return false;
		}

		if (values.length === 0) {
			return currentValue === target;
		}

		const nextInputValue = values[0];
		const nextValues = values.slice(1);

		return recursiveCanSolve({ target, values: nextValues }, currentValue * nextInputValue) ||
			recursiveCanSolve({ target, values: nextValues }, currentValue + nextInputValue) ||
			recursiveCanSolve({ target, values: nextValues }, Number(`${currentValue}${nextInputValue}`));
	}

	const timer = new Timer();

	const solution = input
		.filter((equation) => recursiveCanSolve(equation, 0))
		.reduce(
			(sum, equation) => equation.target + sum,
			0,
		);

	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}
