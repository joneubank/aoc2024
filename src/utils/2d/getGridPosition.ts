import type { Vec2 } from './Vec2.ts';

function getGridPosition<T>(grid: T[][], position: Vec2): T | undefined {
	return grid[position[1]]?.[position[0]];
}

export default getGridPosition;
