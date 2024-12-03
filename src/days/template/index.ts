import getLogger from '../../logger.ts';
import readInputLines from '../../readInputs.ts';
import Timer from '../../timer.ts';

type Inputs = {};

const DAY = '00';

let cachedInputs: Inputs | undefined;

async function readInputs(log: ReturnType<typeof getLogger>): Promise<Inputs> {
	if (cachedInputs) {
		return cachedInputs;
	}

	const linesIterator = readInputLines(`./src/days/day${DAY}/input.txt`);
	for await (const line of linesIterator) {
	}

	cachedInputs = {};
	return cachedInputs;
}

export async function part1(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 1, silenced);

	const {} = await readInputs(log);

	const timer = new Timer();

	const solution = 0;

	log('Solution', solution);
	log('Good Solution', 'Timer (ms)', timer.time());
	return solution;
}

export async function part2(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 2, silenced);

	const {} = await readInputs(log);

	const timer = new Timer();

	const solution = 0;

	log('Solution', solution);
	log('Good Solution', 'Timer (ms)', timer.time());
	return solution;
}
