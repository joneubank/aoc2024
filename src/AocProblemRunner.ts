import { dirname } from '@std/path';
import type { Logger } from './logger.ts';
import readInputLines from './readInputs.ts';
import getLogger from './logger.ts';
import Timer from './timer.ts';

// Outputs
export type AocProblemFunction = (silenceLogs?: boolean) => Promise<number>;
export type AocProblemRunner = {
	runPart1: AocProblemFunction;
	runPart2: AocProblemFunction;
	testPart1: AocProblemFunction;
	testPart2: AocProblemFunction;
};

// Inputs
export type AocProblemSolution<Inputs> = (inputs: Inputs, log: Logger, timer: Timer) => number;
export type AocInputReducer<Inputs> = (accumulator: Inputs, line: string, log: Logger) => Inputs;
export type AocProblemRunnerConfig<Inputs> = {
	day: number;
	inputLineReducer: AocInputReducer<Inputs>;
	initialInputs: () => Inputs;
	inputFilePath: string;
	testInputFilePath?: string;
	part1Solver: AocProblemSolution<Inputs>;
	part2Solver: AocProblemSolution<Inputs>;
};

function createAocProblemRunner<Inputs>(
	config: AocProblemRunnerConfig<Inputs>,
): AocProblemRunner {
	const cachedInputs = new Map<string, Inputs>();

	async function readInputs(filename: string, log: Logger): Promise<Inputs> {
		const cachedValue = cachedInputs.get(filename);
		if (cachedValue) {
			return cachedValue;
		}
		let output: Inputs = config.initialInputs();
		const linesIterator = readInputLines(filename);
		for await (const line of linesIterator) {
			output = config.inputLineReducer(output, line, log);
		}

		cachedInputs.set(filename, output);
		return output;
	}

	async function runSolver(
		solver: AocProblemSolution<Inputs>,
		part: number,
		options: { isTest: boolean; silenceLogs: boolean },
	): Promise<number> {
		const log = getLogger(config.day, part, options.isTest, options.silenceLogs);

		if (options.isTest && !config.testInputFilePath) {
			log('No test input defined. Cannot perform test run.');
			return 0;
		}

		const inputs = await readInputs(
			(options.isTest && config.testInputFilePath) ? config.testInputFilePath : config.inputFilePath,
			log,
		);
		log('Starting...');
		const timer = new Timer();
		const solution = solver(inputs, log, timer);
		const duration = timer.time();
		log('Solution', solution);
		log('Run time (ms)', duration);
		return solution;
	}

	return {
		runPart1: (silenceLogs) => runSolver(config.part1Solver, 1, { isTest: false, silenceLogs: !!silenceLogs }),
		runPart2: (silenceLogs) => runSolver(config.part2Solver, 2, { isTest: false, silenceLogs: !!silenceLogs }),
		testPart1: (silenceLogs) => runSolver(config.part1Solver, 1, { isTest: true, silenceLogs: !!silenceLogs }),
		testPart2: (silenceLogs) => runSolver(config.part2Solver, 2, { isTest: true, silenceLogs: !!silenceLogs }),
	};
}
export default createAocProblemRunner;
