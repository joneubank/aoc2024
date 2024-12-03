import getLogger from '../../logger.ts';
import readInputLines from '../../readInputs.ts';
import Timer from '../../timer.ts';
import type { Range } from '../../utils/isWithin.ts';
import isWithin from '../../utils/isWithin.ts';

import splitByWhitespace from '../../utils/splitByWhitespace.ts';

type Report = number[];
type Inputs = Report[];

type ReportAnalysis = { minDiff: number; maxDiff: number };

const validRange: Range = { min: 1, max: 3 };

let cachedInputs: Inputs | undefined;

async function readInputs(log: ReturnType<typeof getLogger>): Promise<Inputs> {
	if (cachedInputs) {
		return cachedInputs;
	}

	cachedInputs = [];

	const linesIterator = readInputLines('./src/days/day02/input_generated.txt');
	for await (const line of linesIterator) {
		const levels = splitByWhitespace(line).map(Number);
		if (levels.some(isNaN) || !levels.every(isFinite)) {
			log(`Input reading error, some value(s) are not valid numbers`, line);
		}
		cachedInputs.push(levels);
	}

	return cachedInputs;
}
/**
 * find min and max diff between levels in report.
 * These calculations are sufficient to determine validity in part 1.
 * @param report
 * @returns
 */
function analyzeReport(report: Report): ReportAnalysis {
	const diffs = report.reduce<number[]>((acc, value, index, array) => {
		if (index === 0) {
			return acc;
		}
		acc.push(array[index - 1] - value);
		return acc;
	}, []);
	const maxDiff = Math.max(...diffs);
	const minDiff = Math.min(...diffs);
	return { maxDiff, minDiff };
}

/**
 * Check the report analysis to determine if it is valid
 * @param analysis
 * @returns
 */
function isValidAnalysis(analysis: ReportAnalysis): boolean {
	return analysis.minDiff > 0 === analysis.maxDiff > 0 &&
		isWithin(Math.abs(analysis.maxDiff), validRange) &&
		isWithin(Math.abs(analysis.minDiff), validRange);
}
export async function part1(silenced = false): Promise<number> {
	const log = getLogger(2, 1, silenced);

	const reports = await readInputs(log);

	const solution = reports.map(analyzeReport).filter(isValidAnalysis).length;

	log('Solution', solution);
	return solution;
}

export async function part2(silenced = false): Promise<number> {
	const log = getLogger(2, 2, silenced);

	const reports = await readInputs(log);

	const timer = new Timer();

	function isValidDiff(diff: number, direction: 'Asc' | 'Desc' | undefined): boolean {
		return isWithin(Math.abs(diff), validRange) &&
			(
				direction === undefined ||
				(direction === 'Asc' && diff > 0) ||
				(direction === 'Desc' && diff < 0)
			);
	}

	/**
	 * This
	 * @param direction
	 * @param report
	 * @param canBranch
	 * @returns
	 */
	function checkValidity(direction: 'Asc' | 'Desc' | undefined, report: Report, canBranch = true): boolean {
		function removeFirstElement(): Report {
			return report.slice(1);
		}
		function removeSecondElement(): Report {
			return report.slice(0, 1).concat(report.slice(2));
		}
		function removeThirdElement(): Report {
			return report.slice(0, 2).concat(report.slice(3));
		}
		function getDirection(diff: number): typeof direction {
			return diff > 0 ? 'Asc' : diff < 0 ? 'Desc' : undefined;
		}

		if (report.length === 1) {
			// no more diffs to check this report is good!
			return true;
		}
		if (report.length === 2) {
			const lastDiff = report[0] - report[1];
			if (isValidDiff(lastDiff, direction)) {
				return true;
			} else {
				return canBranch;
			}
		}
		const firstDiff = report[0] - report[1];
		const secondDiff = report[1] - report[2];
		if (isValidDiff(firstDiff, direction) && isValidDiff(secondDiff, direction)) {
			if (direction || getDirection(firstDiff) === getDirection(secondDiff)) {
				// Can remove first element and set the direction, then validate the rest of the report
				return checkValidity(direction ?? getDirection(firstDiff), report.slice(1), canBranch);
			} else {
				// havent set a direction and first two diffs go opposite ways
				// there are 3 candidates to try
				return checkValidity(direction ?? getDirection(secondDiff), removeFirstElement(), false) ||
					checkValidity(direction ?? getDirection(report[0] - report[2]), removeSecondElement(), false) ||
					checkValidity(direction ?? getDirection(firstDiff), removeThirdElement(), false);
			}
		} else if (!canBranch) {
			return false;
		} else if (!isValidDiff(firstDiff, direction) && !isValidDiff(secondDiff, direction)) {
			// both diffs are invalid, only hope for this report is that removing the second element makes it viable
			return checkValidity(direction ?? getDirection(report[0] - report[2]), removeSecondElement(), false);
		} else if (!isValidDiff(firstDiff, direction)) {
			// first diff is bad but second is good, try two cases, removing first and removing
			return checkValidity(direction ?? getDirection(secondDiff), removeFirstElement(), false) ||
				checkValidity(direction ?? getDirection(report[0] - report[2]), removeSecondElement(), false);
		} else {
			// secondDiff is bad but first was good. try two cases, removing second and removing third
			return checkValidity(direction ?? getDirection(report[0] - report[2]), removeSecondElement(), false) ||
				checkValidity(direction ?? getDirection(firstDiff), removeThirdElement(), false);
		}
	}

	const solution = reports.filter((report) => checkValidity(undefined, report)).length;

	log('Good Solution', solution);

	log('Good Solution', 'Timer (ms)', timer.time());
	return solution;
}

/**
 * Re-doing part 2 using the brute force approach of just checking all
 * permutations of each report with one element missing. This is much simpler
 * to both read and write, but takes twice the time to complete and would not
 * scale well with the length of each report. However, twice the time is still
 * sub 5ms with this input.
 * @param silenced
 * @returns
 */
export async function part2BruteForce(silenced = false): Promise<number> {
	const log = getLogger(2, 2, silenced);

	const reports = await readInputs(log);

	const timer = new Timer();

	/**
	 * Find all permutations of the report where one element has been removed.
	 * This represents all possible cases where the problem dampener has removed
	 * a single level. If any of these permutations are valid then the original
	 * report is valid.
	 * @param report
	 * @returns
	 */
	function makePermutations(report: Report): Report[] {
		const output: Report[] = [];
		for (let i = 0; i < report.length; i++) {
			output.push(report.slice(0, i).concat(report.slice(i + 1)));
		}
		return output;
	}

	const solution = reports
		.map(
			(report) => makePermutations(report).map(analyzeReport).some(isValidAnalysis),
		)
		.filter((report) => report === true)
		.length;

	log('Brute Force Solution', solution);

	log('Brute Force Solution', 'Timer (ms)', timer.time());
	return solution;
}
