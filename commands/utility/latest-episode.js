const { SlashCommandBuilder } = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('episodios')
		.setDescription('Muestra los episodios emitidos en las últimas 24 horas.'),
	async execute(interaction) {
		try {
			await interaction.deferReply();
			// Por si tarda un poco

			const feed = await parser.parseURL('https://www.livechart.me/feeds/episodes');

			if (!feed.items.length) {
				return interaction.editReply('No se encontraron episodios emitidos en las últimas 24 horas.');
			}
			// Limitar a los 10 primeros episodios
			const latestEpisodes = feed.items.slice(0, 10).map(ep => {
				return `📺 **${ep.title}**\n🔗 ${ep.link}\n 📂 Categoría: ${ep.category || 'Sin categoría'}`;
			}).join('\n\n');

			await interaction.editReply(`Estos son los últimos episodios emitidos:\n\n${latestEpisodes}`);
		}
		catch (error) {
			console.error('Error al obtener el feed RSS:', error);
			await interaction.reply('Hubo un error al obtener los episodios 😓');
		}
	},
};
