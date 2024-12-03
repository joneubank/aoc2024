import getLogger from '../../logger.ts';
import readInputLines from '../../readInputs.ts';
import Timer from '../../timer.ts';

type Inputs = string;

const DAY = '03';

let cachedInputs: Inputs | undefined;

async function readInputs(log: ReturnType<typeof getLogger>): Promise<Inputs> {
	if (cachedInputs) {
		return cachedInputs;
	}
	const output: string[] = [];
	const linesIterator = readInputLines(`./src/days/day${DAY}/input.txt`);
	for await (const line of linesIterator) {
		output.push(line);
	}

	cachedInputs = output.join('');
	return cachedInputs;
}

export async function part1(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 1, silenced);

	const inputs = await readInputs(log);

	const timer = new Timer();

	const matches = inputs.matchAll(/mul\(\d+,\d+\)/g);
	const pairs = matches.map((match) => {
		const partialMatch = match[0].match(/\d+,\d+/);
		if (partialMatch) {
			return partialMatch[0].split(',').map(Number);
		}
		return [0, 0];
	});

	const solution = pairs.reduce((sum, values) => sum + values[0] * values[1], 0);

	// log('Inputs', inputs);
	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}

export async function part2(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 2, silenced);

	const inputs = await readInputs(log);

	const timer = new Timer();

	const validInstructions = inputs.matchAll(/mul\(\d+,\d+\)|do\(\)|don't\(\)/g).toArray().map((i) => i[0]);

	let actionsEnabled = true;
	let sum = 0;

	validInstructions.forEach((instruction) => {
		switch (instruction) {
			case 'do()': {
				actionsEnabled = true;
				break;
			}
			case "don't()": {
				actionsEnabled = false;
				break;
			}
			default: {
				if (actionsEnabled) {
					const partialMatch = instruction.match(/\d+,\d+/);
					if (partialMatch) {
						const pair = partialMatch[0].split(',').map(Number);
						sum += pair[0] * pair[1];
					}
				}
			}
		}
	});

	const solution = sum;
	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}
