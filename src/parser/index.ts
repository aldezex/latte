import { readFileSync } from 'fs';

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

		return html;
	}

	readStyles() {
		const start = this.content.indexOf('<style>');
		const end = this.content.indexOf('</style>');

		const styles = this.content.slice(start, end + 8);

		return styles;
	}
}
