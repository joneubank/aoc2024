class StructSet<T> {
	_data = new Map<string, T>();
	hash: (value: T) => string;
	constructor(hashFn: (value: T) => string) {
		this.hash = hashFn;
	}

	has(input: T) {
		return this._data.has(this.hash(input));
	}

	add(input: T) {
		this._data.set(this.hash(input), input);
	}

	delete(input: T) {
		this._data.delete(this.hash(input));
	}

	size() {
		return this._data.size;
	}

	values(): IterableIterator<T> {
		return this._data.values();
	}
}

export default StructSet;
