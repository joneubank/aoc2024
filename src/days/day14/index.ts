import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
import Vec2Utils, { type Vec2 } from '../../utils/2d/Vec2.ts';
type Inputs = { position: Vec2; velocity: Vec2 }[];

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	const linePattern = /p=(?<px>[\d]+),(?<py>[\d]+) v=(?<vx>[-]?[\d]+),(?<vy>[-]?[\d]+)/;
	for await (const line of iterator) {
		const result = linePattern.exec(line);
		if (result?.groups) {
			initialValue.push({
				position: [Number(result.groups.px), Number(result.groups.py)],
				velocity: [Number(result.groups.vx), Number(result.groups.vy)],
			});
		}
	}
	return initialValue;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer, isTest: boolean): number {
	const gridSize: Vec2 = isTest ? [11, 7] : [101, 103];

	const finalPositions = inputs.map((robot) =>
		Vec2Utils.wrap(Vec2Utils.add(robot.position, Vec2Utils.scale(robot.velocity, 100)), gridSize)
	);

	const quads = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };

	finalPositions.forEach((position) => {
		const top = position[1] < Math.floor(gridSize[1] / 2);
		const bottom = position[1] > Math.floor(gridSize[1] / 2);
		const left = position[0] < Math.floor(gridSize[0] / 2);
		const right = position[0] > Math.floor(gridSize[0] / 2);

		switch (true) {
			case top && left: {
				quads.topLeft++;
				break;
			}
			case bottom && left: {
				quads.bottomLeft++;
				break;
			}
			case top && right: {
				quads.topRight++;
				break;
			}
			case bottom && right: {
				quads.bottomRight++;
				break;
			}
			default: {
				// middleground, do nothing
				break;
			}
		}
	});
	log(quads);
	return quads.bottomLeft * quads.bottomRight * quads.topLeft * quads.topRight;
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	return 0;
}

const Day14 = createAocProblemRunner<Inputs>({
	day: 0,
	initialInputs: () => [],
	inputFilePath: './src/days/day14/input.txt',
	testInputFilePath: './src/days/day14/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default Day14;
