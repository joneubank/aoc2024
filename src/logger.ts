function unknownToString(
	input: unknown,
	jsonOptions?: { replacer?: (this: unknown, key: string, value: unknown) => unknown; space?: string | number },
): string {
	if (input instanceof Error) {
		return input.message;
	} else if (typeof input === 'object') {
		return JSON.stringify(input, jsonOptions?.replacer, Array.isArray(input) ? 0 : jsonOptions?.space);
	} else {
		return `${input}`;
	}
}

const formatMessage = (message: unknown) => {
	const messageAsString = unknownToString(message, { space: 2 });
	return typeof message === 'object' && message !== null ? `\n${messageAsString}\n` : messageAsString;
};

const buildServiceMessage = (...messages: unknown[]) => messages.map(formatMessage).join(' - ');

function getLogger(day: number, part: number, silenced = false) {
	function log(...parts: unknown[]) {
		if (!silenced) {
			console.log(buildServiceMessage(`Day ${day}`, `Part ${part}`, ...parts));
		}
	}
	return log;
}
export default getLogger;
