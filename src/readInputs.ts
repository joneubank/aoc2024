import { createReadStream } from 'node:fs';
import { TextLineStream } from '@std/streams/text-line-stream';

function readInputLines(filePath: string) {
	const stream = ReadableStream.from(createReadStream(filePath));
	return stream.pipeThrough(new TextLineStream()).values();
}

export default readInputLines;
