import getLogger from '../../logger.ts';
import readInputLines from '../../readInputs.ts';
import Timer from '../../timer.ts';
import isTrue from '../../utils/isTrue.ts';

type Inputs = string[];

const DAY = '04';

let cachedInputs: Inputs | undefined;

async function readInputs(log: ReturnType<typeof getLogger>): Promise<Inputs> {
	if (cachedInputs) {
		return cachedInputs;
	}

	const lines: Inputs = [];
	const linesIterator = readInputLines(`./src/days/day${DAY}/input.txt`);
	for await (const line of linesIterator) {
		lines.push(line);
	}

	cachedInputs = lines;
	return cachedInputs;
}

function getSubGrid(grid: string[], offset: { x: number; y: number }, size: number): string[] {
	const output: string[] = [];
	for (let row = offset.y; row < offset.y + size; row++) {
		output.push(grid[row]?.slice(offset.x, offset.x + size));
	}
	return output;
}

type KernelTest = (grid: string[]) => boolean;

function makeKernelTest(kernel: string[]): KernelTest {
	const tests: Array<(grid: string[]) => boolean> = [];

	for (let y = 0; y < kernel.length; y++) {
		const row = kernel[y];

		for (let x = 0; x < row.length; x++) {
			const value = row[x];

			if (value.trim()) {
				const test = (grid: string[]) => {
					const gridRow = grid[y];
					return !!gridRow && gridRow[x] === value;
				};
				tests.push(test);
			}
		}
	}
	return (grid: string[]) => tests.every((test) => test(grid));
}

function countMatches(grid: string[], tests: KernelTest[]) {
	const testKernels = (grid: string[]) => tests.map((test) => test(grid)).filter(isTrue).length;

	let matches = 0;

	const height = grid.length;
	const width = grid[0].length;
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			const subgrid = getSubGrid(grid, { x, y }, 4);
			matches += testKernels(subgrid);
		}
	}
	return matches;
}

export async function part1(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 1, silenced);

	const input = await readInputs(log);

	const timer = new Timer();

	const kernels = [
		[
			'XMAS',
		],
		[
			'SAMX',
		],
		[
			'X',
			'M',
			'A',
			'S',
		],
		[
			'S',
			'A',
			'M',
			'X',
		],
		[
			'X   ',
			' M  ',
			'  A ',
			'   S',
		],
		[
			'S   ',
			' A  ',
			'  M ',
			'   X',
		],
		[
			'   S',
			'  A ',
			' M  ',
			'X   ',
		],
		[
			'   X',
			'  M ',
			' A  ',
			'S   ',
		],
	].map(makeKernelTest);

	const solution = countMatches(input, kernels);

	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}

export async function part2(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 2, silenced);

	const input = await readInputs(log);

	const timer = new Timer();

	const kernels = [
		[
			'M M',
			' A ',
			'S S',
		],
		[
			'S M',
			' A ',
			'S M',
		],
		[
			'M S',
			' A ',
			'M S',
		],
		[
			'S S',
			' A ',
			'M M',
		],
	].map(makeKernelTest);

	const solution = countMatches(input, kernels);

	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}
