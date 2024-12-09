import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
import splitByWhitespace from '../../utils/splitByWhitespace.ts';
type Inputs = { listOne: number[]; listTwo: number[] };

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	for await (const line of iterator) {
		const parts = splitByWhitespace(line);
		if (parts.length !== 2) {
			log(`Line has strange formatting`, line, parts);
		}
		initialValue.listOne.push(Number(parts[0]));
		initialValue.listTwo.push(Number(parts[1]));
	}
	return initialValue;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const { listOne, listTwo } = inputs;

	if (listOne.length !== listTwo.length) {
		log(`Two lists are different sizes!`, listOne.length, listTwo.length);
	}
	listOne.sort();
	listTwo.sort();

	return listOne.reduce((sum, _, index) => {
		return sum + Math.abs(listOne[index] - listTwo[index]);
	}, 0);
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const { listOne, listTwo } = inputs;

	const counts = new Map<number, number>();
	listTwo.forEach((value) => {
		const currentCount = counts.get(value) || 0;
		counts.set(value, currentCount + 1);
	});

	return listOne.reduce((sum, value) => {
		const count = counts.get(value) || 0;
		return sum + value * count;
	}, 0);
}

const Day1 = createAocProblemRunner<Inputs>({
	day: 1,
	initialInputs: () => ({ listOne: [], listTwo: [] }),
	inputFilePath: './src/days/day01/input.txt',
	testInputFilePath: './src/days/day01/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default Day1;
