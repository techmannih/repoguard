const chalk = require('chalk');

const createTable = require('./utils/createTable');

const dim = chalk.gray;
const greenInverse = chalk.bold.inverse.green;
const cyanInverse = chalk.bold.inverse.cyan;
const yellowInverse = chalk.bold.inverse.yellow;

module.exports = ({
	name = `(CLI name undefined)`,
	desc,
	commands = {},
	flags = {},
	examples = [],
	header,
	footer
}) => {
	let help = '';
	const spacer = `\n\n`;

	if (header) {
		help += `${header}${spacer}`;
	}

	if (desc) {
		help += `${desc}${spacer}`;
	}

	// Usage.
	help += `${greenInverse(` USAGE `)} ${spacer}`;
	help += chalk`{gray $} {green ${name}} {cyan <command>} {yellow [option]}`;

	if (examples.length) {
		const isPlural = examples.length > 1 ? `S` : ``;
		help += `${spacer}${chalk`{gray EXAMPLE${isPlural} }`}`;
		examples.map(ex => {
			const exFlags = ex.flags ? `--${ex.flags.join(` --`)}` : ``;
			help += chalk`\n{gray $} {green ${name}} {cyan ${ex.command}} {yellow ${exFlags}}`;
		});
	}

	// Commands.
	help += `${spacer}${cyanInverse(` COMMANDS `)} ${spacer}`;
	const tableCommands = createTable();
	const commandKeys = Object.keys(commands);

	for (const command of commandKeys) {
		let options = commands[command];
		let commandFlags = '';

		if (options.flags) {
			const flagKeys = Object.keys(options.flags);
			for (const flag of flagKeys) {
				let flagOptions = options.flags[flag];
				let alias = flagOptions.alias ? `-${flagOptions.alias}, ` : ``;
				commandFlags += `\n${chalk`{cyanBright ${flag.length > 1 ? '--' + flag : '-' + flag}}`} ${dim(`${flagOptions}`)}`;
			}
		}

		tableCommands.push([
			chalk`{cyan ${command}}`,
			`${options.desc}${commandFlags}`
		]);
	}
	help += tableCommands.toString();

	// Flags.
	help += `${spacer}${yellowInverse(` OPTIONS `)} ${spacer}`;
	const tableFlags = createTable();
	const flagKeys = Object.keys(flags);

	for (const flag of flagKeys) {
		let options = flags[flag];
		let alias = options.alias ? `-${options.alias}, ` : ``;

		tableFlags.push([chalk`{yellow ${alias}--${flag}}`, `${options.desc}`]);
	}

	help += tableFlags.toString();
	help += `\n`;

	if (footer) {
		help += `\n${footer}\n`;
	}

	return help;
};
