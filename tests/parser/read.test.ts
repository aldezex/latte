import { describe, expect, it } from 'vitest';
import Parser from '../../src/parser';

describe('read', () => {
	it('should read a file', () => {
		const current = process.cwd();
		const path = `${current}/tests/parser/test.latte`;

		const parser = new Parser(path);
		parser.read();

		expect(parser.readScript()).toBe('<script>let a = 1;</script>');
	});
});
