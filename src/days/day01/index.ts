import getLogger from '../../logger.ts';
import readInputLines from '../../readInputs.ts';
import splitByWhitespace from '../../utils/splitByWhitespace.ts';
type Inputs = { listOne: number[]; listTwo: number[] };

let cachedInputs: Inputs | undefined;

async function readInputs(log: ReturnType<typeof getLogger>): Promise<Inputs> {
	if (cachedInputs) {
		return cachedInputs;
	}

	const listOne: number[] = [];
	const listTwo: number[] = [];

	const linesIterator = readInputLines('./src/days/day01/input.txt');
	for await (const line of linesIterator) {
		const parts = splitByWhitespace(line);
		if (parts.length !== 2) {
			log(`Line has strange formatting`, line, parts);
		}
		listOne.push(Number(parts[0]));
		listTwo.push(Number(parts[1]));
	}

	cachedInputs = { listOne, listTwo };
	return cachedInputs;
}

export async function part1(silenced = false): Promise<number> {
	const log = getLogger(1, 1, silenced);

	const { listOne, listTwo } = await readInputs(log);

	if (listOne.length !== listTwo.length) {
		log(`Two lists are different sizes!`, listOne.length, listTwo.length);
	}
	listOne.sort();
	listTwo.sort();

	const solution = listOne.reduce((sum, _, index) => {
		return sum + Math.abs(listOne[index] - listTwo[index]);
	}, 0);

	log('Solution', solution);
	return solution;
}

export async function part2(silenced = false): Promise<number> {
	const log = getLogger(1, 2, silenced);

	const { listOne, listTwo } = await readInputs(log);

	const counts = new Map<number, number>();
	listTwo.forEach((value) => {
		const currentCount = counts.get(value) || 0;
		counts.set(value, currentCount + 1);
	});
	const solution = listOne.reduce((sum, value) => {
		const count = counts.get(value) || 0;
		return sum + value * count;
	}, 0);

	log('Solution', solution);
	return solution;
}
