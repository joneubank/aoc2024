import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
import getGridPosition from '../../utils/2d/getGridPosition.ts';
import type { Vec2 } from '../../utils/2d/Vec2.ts';
import Vec2Utils from '../../utils/2d/Vec2.ts';
import StructSet from '../../utils/StructSet.ts';
type Inputs = { regions: Region[]; grid: string[][] };
type Region = StructSet<Vec2>;

const ORTHOGONAL_STEPS = [[0, 1], [1, 0], [0, -1], [-1, 0]] as const satisfies Vec2[];
function getNeighbours(position: Vec2) {
	return ORTHOGONAL_STEPS.map<Vec2>((step) => Vec2Utils.add(step, position));
}

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	const grid: string[][] = [];
	for await (const line of iterator) {
		grid.push(line.split(''));
	}

	function mapRegion(position: Vec2): Region {
		const output: Region = new StructSet(Vec2Utils.hash);
		output.add(position);
		const positionValue = getGridPosition(grid, position);

		// we will expand through the grid to all neighbours matching this cell value, to do so we keep
		// an array of the outter edge of the region found, then we'll loop over that array check the neighbours
		// of each edge position. If those neighbours have a matching value we willl make them the new edge. Using
		// sets of positions helps us prevent checking the same position as an edge twice.
		let edges = new StructSet(Vec2Utils.hash);
		edges.add(position);

		// iters to protect against infinite loops
		const MAX_ITERS = grid.length * 400;
		let iters = 0;
		while (edges.size() > 0 && iters < MAX_ITERS) {
			const nextEdges = new StructSet(Vec2Utils.hash);
			for (const edge of edges.values()) {
				// check all 4 neighbour positions, for each that we haven't already added and that has a matching value, add it to the next edges and our output.
				getNeighbours(edge)
					.filter((neighbour) => !output.has(neighbour) && getGridPosition(grid, neighbour) === positionValue)
					.forEach((matchingNeighbour) => {
						nextEdges.add(matchingNeighbour);
						output.add(matchingNeighbour);
					});
			}

			edges = nextEdges;
			iters++;
		}
		return output;
	}

	const regions: Region[] = [];
	const visited = new StructSet(Vec2Utils.hash);

	grid.forEach((row, y) => {
		row.forEach((cell, x) => {
			const cellVec: Vec2 = [x, y];

			if (visited.has(cellVec)) {
				return;
			}

			const cellRegion = mapRegion(cellVec);
			for (const visitedCell of cellRegion.values()) {
				visited.add(visitedCell);
			}
			regions.push(cellRegion);
		});
	});
	return { regions, grid };
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const { grid, regions } = inputs;
	function getPerimeter(region: Region): number {
		const firstCell = region.values().next();
		if (!firstCell.value) {
			return 0;
		}
		const regionValue = getGridPosition(grid, firstCell.value);

		let perimeter = 0;
		for (const cell of region.values()) {
			perimeter += getNeighbours(cell).filter((neighbour) => getGridPosition(grid, neighbour) !== regionValue).length;
		}
		return perimeter;
	}

	return regions.reduce((sum, region) => getPerimeter(region) * region.size() + sum, 0);
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const { grid, regions } = inputs;

	function countSides(region: Region): number {
		const firstCell = region.values().next();
		if (!firstCell.value) {
			return 0;
		}
		const regionValue = getGridPosition(grid, firstCell.value);

		const edges: Record<'north' | 'south' | 'east' | 'west', Map<number, number[]>> = {
			north: new Map<number, number[]>(),
			south: new Map<number, number[]>(),
			east: new Map<number, number[]>(),
			west: new Map<number, number[]>(),
		};

		for (const cell of region.values()) {
			// north - [ 0, -1]
			if (getGridPosition(grid, Vec2Utils.add(cell, [0, -1])) !== regionValue) {
				const existing = edges.north.get(cell[1]) || [];
				edges.north.set(cell[1], [...existing, cell[0]]);
			}
			// south - [ 0,  1]
			if (getGridPosition(grid, Vec2Utils.add(cell, [0, 1])) !== regionValue) {
				const existing = edges.south.get(cell[1]) || [];
				edges.south.set(cell[1], [...existing, cell[0]]);
			}
			// east  - [ 1,  0]
			if (getGridPosition(grid, Vec2Utils.add(cell, [1, 0])) !== regionValue) {
				const existing = edges.east.get(cell[0]) || [];
				edges.east.set(cell[0], [...existing, cell[1]]);
			}
			// west  - [-1,  0]
			if (getGridPosition(grid, Vec2Utils.add(cell, [-1, 0])) !== regionValue) {
				const existing = edges.west.get(cell[0]) || [];
				edges.west.set(cell[0], [...existing, cell[1]]);
			}
		}

		function countDistinctSides(edgePositions: number[], notes: string): number {
			if (edgePositions.length === 0) {
				return 0;
			}
			edgePositions.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
			let count = 1;
			for (let i = 0; i < edgePositions.length - 1; i++) {
				const current = edgePositions[i];
				const next = edgePositions[i + 1];
				if (current + 1 !== next) {
					count++;
				}
			}
			return count;
		}

		const northFacingSides = edges.north.entries().reduce(
			(sum, [y, sides]) => sum + countDistinctSides(sides, `${regionValue}-${y}-north`),
			0,
		);
		const southFacingSides = edges.south.entries().reduce(
			(sum, [y, sides]) => sum + countDistinctSides(sides, `${regionValue}-${y}-south`),
			0,
		);
		const eastFacingSides = edges.east.entries().reduce(
			(sum, [y, sides]) => sum + countDistinctSides(sides, `${regionValue}-${y}-east`),
			0,
		);
		const westFacingSides = edges.west.entries().reduce(
			(sum, [y, sides]) => sum + countDistinctSides(sides, `${regionValue}-${y}-west`),
			0,
		);
		const totalSides = northFacingSides + southFacingSides + eastFacingSides + westFacingSides;
		return totalSides;
	}

	return regions.reduce((sum, region) => (countSides(region) * region.size()) + sum, 0);
}

const DayX = createAocProblemRunner<Inputs>({
	day: 0,
	initialInputs: () => ({ regions: [], grid: [] }),
	inputFilePath: './src/days/day12/input.txt',
	testInputFilePath: './src/days/day12/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default DayX;
