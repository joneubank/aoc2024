import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
import type { Vec2 } from '../../utils/2d/Vec2.ts';
type Inputs = number[][];

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	for await (const line of iterator) {
		initialValue.push(line.split('').map(Number));
	}
	return initialValue;
}

function orthogonalNeighbours(input: Vec2): Vec2[] {
	return [[input[0] + 1, input[1]], [input[0] - 1, input[1]], [input[0], input[1] - 1], [input[0], input[1] + 1]];
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const trailHeads: Vec2[] = [];
	inputs.forEach((row, y) => {
		row.forEach((height, x) => {
			if (height === 0) {
				trailHeads.push([x, y]);
			}
		});
	});

	function countPaths(start: Vec2): number {
		let nextSteps = new Map<string, Vec2>();
		nextSteps.set(start.join(','), start);

		for (let nextHeight = 1; nextHeight <= 9; nextHeight++) {
			const stepCollector = new Map<string, Vec2>();
			nextSteps.values().forEach((position) => {
				orthogonalNeighbours(position)
					.filter((candidate) => inputs[candidate[1]]?.[candidate[0]] === nextHeight)
					.forEach((step) => {
						stepCollector.set(step.join(','), step);
					});
				nextSteps = stepCollector;
			});
		}

		return nextSteps.size;
	}
	return trailHeads.reduce((sum, value) => sum + countPaths(value), 0);
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const trailHeads: Vec2[] = [];
	inputs.forEach((row, y) => {
		row.forEach((height, x) => {
			if (height === 0) {
				trailHeads.push([x, y]);
			}
		});
	});

	function countPaths(start: Vec2): number {
		let nextSteps = [start];
		for (let nextHeight = 1; nextHeight <= 9; nextHeight++) {
			const stepCollector: Vec2[] = [];
			nextSteps.values().forEach((position) => {
				orthogonalNeighbours(position)
					.filter((candidate) => inputs[candidate[1]]?.[candidate[0]] === nextHeight)
					.forEach((step) => {
						stepCollector.push(step);
					});
				nextSteps = stepCollector;
			});
		}

		return nextSteps.length;
	}
	return trailHeads.reduce((sum, value) => sum + countPaths(value), 0);
}

const DayX = createAocProblemRunner<Inputs>({
	day: 10,
	initialInputs: () => [],
	inputFilePath: './src/days/day10/input.txt',
	testInputFilePath: './src/days/day10/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default DayX;
