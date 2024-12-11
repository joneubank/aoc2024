import createAocProblemRunner from '../../AocProblemRunner.ts';
import { type Logger } from '../../logger.ts';
import type Timer from '../../timer.ts';
import splitByWhitespace from '../../utils/splitByWhitespace.ts';
type Inputs = LinkedList<number>;

type LinkedListNode<T> = {
	value: T;
	next: LinkedListNode<T> | undefined;
};

function createLinkedList<T>() {
	let start: LinkedListNode<T> | undefined = undefined;
	let end: LinkedListNode<T> | undefined = undefined;
	let length = 0;

	function get(index: number): LinkedListNode<T> | undefined {
		// assert is integer
		let node: LinkedListNode<T> | undefined = start;
		for (let i = 1; i < index; i++) {
			if (node === undefined) {
				return undefined;
			}
			node = node.next;
		}
		return node;
	}

	function getEnd() {
		if (end) {
			return end;
		}
		if (start) {
			return start;
		}
		return undefined;
	}
	function getStart() {
		return start;
	}

	function insert(value: T, node: LinkedListNode<T>) {
		const next = node;
		node.next = { value, next };
		length++;
	}

	function push(value: T) {
		if (length === 0) {
			start = { value, next: undefined };
			length++;
		} else if (length === 1 && start) {
			end = { value, next: undefined };
			start.next = end;
			length++;
		} else if (end) {
			const next = { value, next: undefined };
			end.next = next;
			end = next;
			length++;
		}
	}
	function getLength() {
		return length;
	}

	return { get, end: getEnd, start: getStart, length: getLength, insert, push };
}
type LinkedList<T> = ReturnType<typeof createLinkedList<T>>;

async function inputParser(initialValue: Inputs, iterator: AsyncIterableIterator<string>, log: Logger) {
	for await (const line of iterator) {
		splitByWhitespace(line).forEach((value) => {
			initialValue.push(Number(value));
		});
	}
	return initialValue;
}

function iterateStones(input: LinkedList<number>): LinkedList<number> {
	const output = createLinkedList<number>();
	const start = input.start();

	let node = start;
	while (node) {
		const stringValue = String(node.value);
		switch (true) {
			case node.value === 0: {
				output.push(1);
				break;
			}
			case stringValue.length % 2 === 0: {
				output.push(Number(stringValue.slice(0, stringValue.length / 2)));
				output.push(Number(stringValue.slice(stringValue.length / 2)));
				break;
			}
			default: {
				output.push(node.value * 2024);
			}
		}
		node = node.next;
	}
	return output;
}

function part1Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	let nextList = inputs;
	for (let blink = 0; blink < 25; blink++) {
		nextList = iterateStones(nextList);
	}

	return nextList.length();
}

function part2Solver(inputs: Inputs, log: Logger, timer: Timer): number {
	let nextList = inputs;
	for (let blink = 0; blink < 45; blink++) {
		nextList = iterateStones(nextList);
	}

	return nextList.length();
}

const DayX = createAocProblemRunner<Inputs>({
	day: 0,
	initialInputs: () => createLinkedList<number>(),
	inputFilePath: './src/days/day11/input.txt',
	testInputFilePath: './src/days/day11/input_test.txt',
	inputParser,
	part1Solver,
	part2Solver,
});

export default DayX;
