'use strict';

require('babel/polyfill');

let assert = require('assert');

describe('test let', () => {

	it('should be using block scope', () => {
		let
			x = 'outer',
			res = [];

		if (true) {
			let x = 'inner';

			res.push(x);
		}

		res.push(x);

		assert.equal(res[0], 'inner');
		assert.equal(res[1], 'outer');
	});

});

describe('test array function', () => {

	it('should compile', () => {
		assert(true);
	});

	it('works with multiple arguments', () => {
		let res = [0, 1, 2, 3, 4, 5]
			.filter(x => !(x % 2))
			.reduce((sum, e) => sum + e, 0);

		assert.equal(res, 6);
	});

});

describe('test for...of... loop', () => {

	it('should work', () => {
		let
			res = 0,
			list = [0, 1, 2, 3, 4, 5];

		for (let e of list) {
			res += e;
		}

		assert.equal(res, list.reduce((sum, e) => sum + e, 0));
	});

});

describe('test new syntax', () => {

	it('destruct and default', () => {
		let
			f = ({arg0, arg1, arg2 = 3}) => [arg0, arg1, arg2];

		assert.deepEqual(f({arg0: 1, arg1: 2}), [1, 2, 3]);
	});

	it('handle rest and spread', () => {
		let
			f = (x, ...rest) => x * rest.reduce((sum, e) => sum + e, 0);

		assert.deepEqual(f(...[2, 3, 4, 5]), 24);
	});

});

describe('test template string', () => {

	it('templates strings', () => {
		let
			x = 1,
			y = 2;

		assert.equal(`${x} + ${y} = ${x + y}`, '1 + 2 = 3');
	});

});

describe('test generator', () => {

	it('fibonacci basic syntax', () => {
		var fib = function*() {
			let pre = 0, cur = 1, next = pre + cur;

			while (true) {
				yield cur;

				pre = cur;
				cur = next;
				next = pre + cur;
			}
		};

		let i = 0, n = 7, fibGen = fib(), sum = 0;

		while (i++ < n) {
			sum += fibGen.next().value;
		}

		assert.equal(sum, 33);
	});

	it('fibonacci fancy syntax', () => {
		let fib = {
			* [Symbol.iterator]() {
				let pre = 0, cur = 1, next = pre + cur;

				while (true) {
					yield cur;

					pre = cur;
					cur = next;
					next = pre + cur;
				}
			}
		};

		let i = 0, sum = 0;

		for (let n of fib) {
			if (i++ > 6) {
				break;
			}

			sum += n;
		}

		assert.equal(sum, 33);
	});

});
