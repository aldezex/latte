import { readFileSync } from 'fs';

interface Node {
	type: string;
	value?: string;
	children?: Node[];
}

export default class Parser {
	private path: string;
	private content: string = '';

	constructor(path: string) {
		this.path = path;
	}

	read() {
		try {
			const file = readFileSync(this.path, 'utf-8');
			this.content = file;
		} catch (error) {
			console.error(error);
		}
	}

	readScript() {
		const start = this.content.indexOf('<script>');
		const end = this.content.indexOf('</script>');

		const script = this.content.slice(start, end + 9);

		return script;
	}

	readHTML() {
		const start = this.content.indexOf('<html>');
		const end = this.content.indexOf('</html>');

		const html = this.content.slice(start, end + 7);

		return this.parseHTML(html);
	}

	readStyles() {
		const start = this.content.indexOf('<style>');
		const end = this.content.indexOf('</style>');

		const styles = this.content.slice(start, end + 8);

		return styles;
	}

	parseHTML(html: string): Node[] {
		function getNextNode(index: number) {
			const startTagIndex = html.indexOf('<', index);
			if (startTagIndex === -1) {
				return { index: html.length };
			}

			const endTagIndex = html.indexOf('>', startTagIndex);
			if (endTagIndex === -1) {
				throw new Error('Tag no cerrado');
			}

			const tagContent = html.substring(startTagIndex + 1, endTagIndex);
			if (tagContent[0] === '/') {
				return {
					type: 'closing',
					tagName: tagContent.slice(1),
					index: endTagIndex + 1,
				};
			}

			const tagEnd = tagContent.indexOf(' ');
			const tagName =
				tagEnd === -1 ? tagContent : tagContent.substring(0, tagEnd);
			return { type: 'opening', tagName, index: endTagIndex + 1 };
		}

		function parse(
			index = 0,
			closingTag = ''
		): { nodes: Node[]; index: number } {
			const nodes: Node[] = [];

			while (index < html.length) {
				const nextNode = getNextNode(index);

				if (
					nextNode.index === html.length ||
					(nextNode.type === 'closing' && nextNode.tagName === closingTag)
				) {
					if (index < nextNode.index - closingTag.length - 3) {
						const textContent = html
							.substring(index, nextNode.index - closingTag.length - 3)
							.trim();
						if (textContent) {
							nodes.push({ type: 'text', value: textContent });
						}
					}
					return { nodes, index: nextNode.index };
				}

				if (nextNode.type === 'opening') {
					const childNodes = parse(nextNode.index, nextNode.tagName);
					nodes.push({ type: nextNode.tagName, children: childNodes.nodes });
					index = childNodes.index;
				} else {
					const textContent = html.substring(index, nextNode.index).trim();
					if (textContent) {
						nodes.push({ type: 'text', value: textContent });
					}
					index = nextNode.index;
				}
			}

			return { nodes, index };
		}

		return parse().nodes;
	}
}
