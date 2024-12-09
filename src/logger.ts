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

function formatMessage(message: unknown) {
	const messageAsString = unknownToString(message, { space: 2 });
	return typeof message === 'object' && message !== null ? `\n${messageAsString}\n` : messageAsString;
}

function buildServiceMessage(...messages: unknown[]) {
	return messages.map(formatMessage).join(' - ');
}

function getLogger(day: number, part: number, isTest: boolean, silenced = false) {
	const label = [`Day ${day}`, `Part ${part}`];
	if (isTest) {
		label.push('Test Input');
	}
	function log(...parts: unknown[]) {
		if (!silenced) {
			console.log(buildServiceMessage(...label, ...parts));
		}
	}
	return log;
}
export default getLogger;
export type Logger = ReturnType<typeof getLogger>;
