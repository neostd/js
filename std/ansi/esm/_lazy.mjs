//#region src/_lazy.ts
var Lazy = class {
	#value;
	#fn;
	constructor(fn) {
		this.#fn = fn;
	}
	get hasValue() {
		return this.#value != void 0;
	}
	get value() {
		if (this.#value == void 0) this.#value = this.#fn();
		return this.#value;
	}
};
//#endregion
export { Lazy };
