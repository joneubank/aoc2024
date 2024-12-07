import getLogger from '../../logger.ts';
import readInputLines from '../../readInputs.ts';
import Timer from '../../timer.ts';

type Vec2 = [number, number];
type Inputs = { grid: string[][]; startPosition: Vec2 };

function vAdd(a: Vec2, b: Vec2): Vec2 {
	return [a[0] + b[0], a[1] + b[1]];
}

const Directions = {
	N: [0, -1],
	E: [1, 0],
	S: [0, 1],
	W: [-1, 0],
} as const satisfies Record<string, Vec2>;

type Direction = keyof typeof Directions;

function turnRight(current: Direction) {
	switch (current) {
		case 'N': {
			return 'E';
		}
		case 'E': {
			return 'S';
		}
		case 'S': {
			return 'W';
		}
		case 'W': {
			return 'N';
		}
	}
}

function guardStep(position: Vec2, direction: Direction): Vec2 {
	return vAdd(position, Directions[direction]);
}

const DAY = '06';

let cachedInputs: Inputs | undefined;

async function readInputs(log: ReturnType<typeof getLogger>): Promise<Inputs> {
	if (cachedInputs) {
		return cachedInputs;
	}

	const grid: string[][] = [];
	const linesIterator = readInputLines(`./src/days/day${DAY}/input.txt`);
	for await (const line of linesIterator) {
		grid.push(line.split(''));
	}

	let startPosition: Vec2 = [-1, -1];
	for (let y = 0; y < grid.length; y++) {
		const x = grid[y]?.indexOf('^');
		if (x >= 0) {
			startPosition = [x, y];
		}
	}

	cachedInputs = { grid, startPosition };
	return cachedInputs;
}

export async function part1(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 1, silenced);

	const { grid, startPosition } = await readInputs(log);

	const timer = new Timer();

	let guardPosition = startPosition;
	let guardDirection: Direction = 'N';

	const visited = new Set<string>();
	let steps = 0;

	let exited = false;
	while (!exited) {
		visited.add(guardPosition.join(','));

		const nextPosition = guardStep(guardPosition, guardDirection);

		const nextRow = grid[nextPosition[1]];
		const nextValue: string | undefined = nextRow && nextRow[nextPosition[0]];

		if (nextValue === undefined) {
			exited = true;
			continue;
		}

		if (nextValue === '#') {
			// turn
			guardDirection = turnRight(guardDirection);
		} else {
			// move
			guardPosition = nextPosition;
			steps++;
		}
	}

	const solution = visited.size;

	log('Steps', steps);
	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}

export async function part2(silenced = false): Promise<number> {
	const log = getLogger(Number(DAY), 2, silenced);

	const { grid, startPosition } = await readInputs(log);

	const timer = new Timer();

	let guardPosition = startPosition;
	let guardDirection: Direction = 'N';

	const successfulObstaclePositions = new Set<string>();
	const testedObstaclePositions = new Set<string>();

	function guardDataHash(position: Vec2, direction: Direction) {
		return [...position, direction].join(',');
	}
	function getGridWithObstacle(position: Vec2): string[][] {
		return grid.map((row, y) =>
			row.map((value, x) => {
				if (x === position[0] && y === position[1]) {
					return '#';
				}
				return value;
			})
		);
	}

	function valueAt(grid: string[][], position: Vec2): string | undefined {
		const row = grid[position[1]];
		return row && row[position[0]];
	}

	/**
	 * Calculates what the next guard update would be, showing the position and direction after the update, as well as the value
	 * in the grid that the guard will be facing after this update. The updates possible are step and turn.
	 *
	 * If the nextPosition is undefined, that means the guard is exiting.
	 *
	 * If the nextValue is undefined, that means the guard is currently facing the exit, the nextPosition will also be undefined
	 * @param grid
	 * @param position
	 * @param direction
	 * @returns
	 */
	function guardUpdate(
		grid: string[][],
		position: Vec2,
		direction: Direction,
	): {
		nextPosition: Vec2 | undefined;
		nextDirection: Direction;
		nextValue: string | undefined;
		nextFacingValue: string | undefined;
		isTurn: boolean;
	} {
		const facingPosition = guardStep(position, direction);
		const facingValue = valueAt(grid, facingPosition);

		if (facingValue === `#`) {
			// turn
			const nextPosition = position;
			const nextDirection = turnRight(direction);
			const nextFacingValue = valueAt(grid, guardStep(nextPosition, nextDirection));

			return { nextPosition, nextDirection, nextValue: valueAt(grid, nextPosition), nextFacingValue, isTurn: true };
		}
		if (facingValue === undefined) {
			return {
				nextPosition: undefined,
				nextDirection: direction,
				nextValue: undefined,
				nextFacingValue: undefined,
				isTurn: false,
			};
		}
		return {
			nextPosition: facingPosition,
			nextDirection: direction,
			nextValue: facingValue,
			nextFacingValue: valueAt(grid, guardStep(facingPosition, direction)),
			isTurn: false,
		};
	}

	/**
	 * Add obstacle to map at position, simulate guard walk with that obstacle and return if it loops
	 * @param obstaclePosition
	 * @returns
	 */
	function checkForLoop(obstaclePosition: Vec2, guardStart: { position: Vec2; direction: Direction }): boolean {
		const visited = new Set<string>();
		visited.add(guardDataHash(guardStart.position, guardStart.direction));

		const gridWithObstacle = getGridWithObstacle(obstaclePosition);

		let _guardPosition = guardStart.position;
		let _guardDirection = guardStart.direction;

		// predict guard path, break loop when guard nextFacingValue is undefined
		while (true) {
			const nextGuard = guardUpdate(gridWithObstacle, _guardPosition, _guardDirection);
			if (nextGuard.nextValue === undefined || nextGuard.nextPosition === undefined) {
				return false;
			}

			_guardPosition = nextGuard.nextPosition;
			_guardDirection = nextGuard.nextDirection;

			const hash = guardDataHash(_guardPosition, _guardDirection);
			if (visited.has(hash)) {
				return true;
			}

			visited.add(hash);
		}
	}

	let steps = 0;
	let exited = false;
	// predict guard path, break loop when guard nextFacingValue is undefined
	while (!exited) {
		steps++;
		const nextGuard = guardUpdate(grid, guardPosition, guardDirection);
		if (nextGuard.nextValue === undefined || nextGuard.nextPosition === undefined) {
			exited = true;
			continue;
		}

		const obstaclePosition = nextGuard.nextPosition;
		const obstacleHash = obstaclePosition.join(',');
		if (!nextGuard.isTurn && nextGuard.nextValue === '.' && !testedObstaclePositions.has(obstacleHash)) {
			testedObstaclePositions.add(obstacleHash);
			if (checkForLoop(obstaclePosition, { position: guardPosition, direction: guardDirection })) {
				successfulObstaclePositions.add(obstacleHash);
			}
		}

		guardPosition = nextGuard.nextPosition;
		guardDirection = nextGuard.nextDirection;
	}

	const solution = successfulObstaclePositions.size;

	// log(successfulObstaclePositions.values().toArray());
	log('Solution', solution);
	log('Solution Run Time (ms)', timer.time());
	return solution;
}
