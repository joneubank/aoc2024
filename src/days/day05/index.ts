import getLogger from '../../logger.ts';
import readInputLines from '../../readInputs.ts';
import Timer from '../../timer.ts';

// A rule is a set of pages that must come after a certain page.
// 5|9  5|12 => {5, [9, 12]} (pages 9 and 12 must come after 5)
type Inputs = { rules: Map<number, Set<number>>; updates: number[][] };

const DAY = '05';

let cachedInputs: Inputs | undefined;

async function readInputs(log: ReturnType<typeof getLogger>): Promise<Inputs> {
	if (cachedInputs) {
		return cachedInputs;
	}

	const inputs: Inputs = { rules: new Map<number, Set<number>>(), updates: [] };
	const linesIterator = readInputLines(`./src/days/day${DAY}/input.txt`);
	let readingRules = true;
	for await (const line of linesIterator) {
		if (line === '') {
			readingRules = false;
		}
		if (readingRules) {
			const rule = line.split('|').map(Number);
			if (rule.length !== 2) {
				log(`Rule does not have expected shape`, line);
				continue;
			}

			const value = inputs.rules.get(rule[0]) || new Set<number>();
			value.add(rule[1]);
			inputs.rules.set(rule[0], value);
		} else {
			const update = line.split(',').map(Number);
			inputs.updates.push(update);
			if (!(update.length % 2)) {
				log(update);
			}
		}
	}

	cachedInputs = inputs;
	return cachedInputs;
}

function getMiddleElement<T>(input: T[]): T {
	return input[Math.floor(input.length / 2)];
}
function sortPages(inputs: number[], rules: Map<number, Set<number>>): number[] {
	return inputs.sort((a, b) => {
		const aRules = rules.get(a);

		if (aRules && aRules.has(b)) {
			return 1;
		}

		const bRules = rules.get(b);
		if (bRules && bRules.has(a)) {
			return -1;
		}
		return 0;
	});
}
/**
 * look at every element in the update. compare all elements before it in the
 * list to the rules for that number, if any nubmer that should be after it is
 * found before it then it fails
 * @param update
 * @returns
 */
function isCorrectlyOrdered(update: number[], rules: Map<number, Set<number>>): boolean {
	return update.every((page, index) => {
		const pagesThatMustFollow = rules.get(page);
		if (pagesThatMustFollow) {
			const precedingPages = update.slice(0, index);

			// check if any of the preceding pages are required to be after the page we are testing
			const brokenRule = precedingPages.some((precedingPage) => pagesThatMustFollow.has(precedingPage));
			return !brokenRule;
		}
		return true;
	});
}

export async function part1(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 1, silenced);

	const { rules, updates } = await readInputs(log);

	const timer = new Timer();

	const solution = updates
		.filter((update) => isCorrectlyOrdered(update, rules))
		.reduce(
			(sum, value) => sum + getMiddleElement(value),
			0,
		);

	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}

export async function part2(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 2, silenced);

	const { rules, updates } = await readInputs(log);

	const timer = new Timer();

	const solution = updates
		.filter((update) => !isCorrectlyOrdered(update, rules))
		.map((update) => sortPages(update, rules))
		.reduce((sum, value) => sum + getMiddleElement(value), 0);

	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}
