import { describe, expect, it } from 'vitest';
import Parser from '../../src/parser';

describe('read', () => {
	it('should parse HTML', () => {
		const current = process.cwd();
		const path = `${current}/tests/parser/test.latte`;

		const parser = new Parser(path);
		parser.read();

		const ast = parser.readHTML();

		const want = {
			type: 'html',
			children: [
				{ type: 'span', children: [{ type: 'text', value: 'hello' }] },
				{
					type: 'div',
					children: [
						{
							type: 'span',
							children: [{ type: 'text', value: 'world' }],
						},
					],
				},
			],
		};

		expect(ast[0]).toEqual(want);
	});
});
