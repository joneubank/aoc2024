class Timer {
	private start: number;
	constructor() {
		this.start = performance.now();
	}

	time(): number {
		return performance.now() - this.start;
	}
}

export default Timer;
