import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
type Inputs = number[];

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	const output: Inputs = [];
	for await (const line of iterator) {
		output.push(...line.split('').map(Number));
	}

	return output;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const fileBlocks = inputs.filter((_, index) => index % 2 === 0).flatMap((value, index) => {
		const output: number[] = [];
		for (let i = 0; i < value; i++) {
			output.push(index);
		}
		return output;
	});

	let checkSum = 0;
	let forwardIndex = 0;
	let reverseIndex = 0;
	let outputIndex = 0;
	inputs.forEach((value, index) => {
		for (let i = 0; i < value; i++) {
			if (forwardIndex + reverseIndex >= fileBlocks.length) {
				break;
			}
			if (index % 2 === 0) {
				// fileBlocks
				const id = fileBlocks[forwardIndex];
				forwardIndex++;
				checkSum += outputIndex * id;
			} else {
				const id = fileBlocks[fileBlocks.length - 1 - reverseIndex];
				reverseIndex++;
				checkSum += outputIndex * id;
			}
			outputIndex++;
		}
	});
	return checkSum;
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	const fileBlocks: { id: number; size: number; startIndex: number }[] = [];
	const spaceBlocks: { startIndex: number; size: number }[] = [];
	let startIndex = 0;
	inputs.forEach((value, index) => {
		if (index % 2 === 0) {
			fileBlocks.push({ id: index / 2, size: value, startIndex });
			startIndex += value;
		} else {
			spaceBlocks.push({ startIndex, size: value });
			startIndex += value;
		}
	});

	const spaceIndexes: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
	function findNextSpaceBlock(size: number) {
		let currentIndex = spaceIndexes[size];
		if (currentIndex === undefined) {
			// won't happen with our input file, but to prevent errors from using the function with other sources...
			return undefined;
		}

		while (currentIndex < spaceBlocks.length) {
			if (spaceBlocks[currentIndex].size >= size) {
				break;
			}
			currentIndex++;
		}
		spaceIndexes[size] = currentIndex;
		return spaceBlocks[currentIndex];
	}

	let reverseFileIndex = 0;
	for (reverseFileIndex = fileBlocks.length - 1; reverseFileIndex >= 0; reverseFileIndex--) {
		const fileBlock = fileBlocks[reverseFileIndex];
		const spaceBlock = findNextSpaceBlock(fileBlock.size);
		if (spaceBlock && spaceBlock.startIndex < fileBlock.startIndex) {
			fileBlock.startIndex = spaceBlock.startIndex;
			const remainingSpace = spaceBlock.size - fileBlock.size;
			spaceBlock.size = remainingSpace;
			spaceBlock.startIndex += fileBlock.size;
		}
	}

	return fileBlocks.reduce((sum, fileBlock) => {
		let fileSum = 0;
		for (let i = 0; i < fileBlock.size; i++) {
			fileSum += fileBlock.id * (fileBlock.startIndex + i);
		}
		return sum + fileSum;
	}, 0);
}

const Day9 = createAocProblemRunner<Inputs>({
	day: 9,
	initialInputs: () => [],
	inputFilePath: './src/days/day09/input.txt',
	testInputFilePath: './src/days/day09/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default Day9;
