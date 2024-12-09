import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
import { type Vec2 } from '../../utils/2d/Vec2.ts';
import Vec2Utils from '../../utils/2d/Vec2.ts';
import { pairs } from '../../utils/pairs.ts';
type NodeMap = Map<string, Vec2[]>;
type Inputs = { grid: string[][]; nodes: NodeMap; width: number; height: number };

async function inputParser(inputs: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	for await (const line of iterator) {
		inputs.grid.push(line.split(''));
	}
	inputs.grid.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (cell !== '.') {
				const nodes = inputs.nodes.get(cell) || [];
				nodes.push([x, y]);
				inputs.nodes.set(cell, nodes);
			}
		});
	});
	inputs.width = inputs.grid[0].length || 0;
	inputs.height = inputs.grid.length;
	return inputs;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const antinodes = new Set<string>();

	inputs.nodes.entries().forEach(([cell, positions]) => {
		const nodePairs = pairs(positions);
		nodePairs.forEach((nodePair) => {
			const nodeA = nodePair[0];
			const nodeB = nodePair[1];
			const delta = Vec2Utils.diff(nodeA, nodeB);

			const antinodeCandidates = [Vec2Utils.add(nodeB, delta), Vec2Utils.diff(delta, nodeA)];
			antinodeCandidates
				.filter((node) => Vec2Utils.within(node, [[0, 0], [inputs.width - 1, inputs.height - 1]]))
				.forEach((node) => {
					antinodes.add(node.join(','));
				});
		});
	});
	return antinodes.size;
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const antinodes = new Set<string>();

	inputs.nodes.entries().forEach(([cell, positions]) => {
		const nodePairs = pairs(positions);
		nodePairs.forEach((nodePair) => {
			const nodeA = nodePair[0];
			const nodeB = nodePair[1];
			const delta = Vec2Utils.diff(nodeA, nodeB);

			const antinodeCandidates = [nodeA, nodeB];

			let nextCandidate: Vec2 = [nodeA[0], nodeA[1]];
			while (Vec2Utils.within(nextCandidate, [[0, 0], [inputs.width - 1, inputs.height - 1]])) {
				nextCandidate = Vec2Utils.diff(delta, nextCandidate);
				antinodeCandidates.push(nextCandidate);
			}
			nextCandidate = nodeB;
			while (Vec2Utils.within(nextCandidate, [[0, 0], [inputs.width - 1, inputs.height - 1]])) {
				nextCandidate = Vec2Utils.add(delta, nextCandidate);
				antinodeCandidates.push(nextCandidate);
			}

			antinodeCandidates
				.filter((node) => Vec2Utils.within(node, [[0, 0], [inputs.width - 1, inputs.height - 1]]))
				.forEach((node) => {
					antinodes.add(node.join(','));
				});
		});
	});
	return antinodes.size;
}

const Day8 = createAocProblemRunner<Inputs>({
	day: 0,
	initialInputs: () => ({ grid: [], height: 0, width: 0, nodes: new Map() }),
	inputFilePath: './src/days/day08/input.txt',
	testInputFilePath: './src/days/day08/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default Day8;
