const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anime')
		.setDescription('Busca información sobre un anime.')
		.addStringOption(option =>
			option.setName('nombre')
				.setDescription('Nombre del anime')
				.setRequired(true)),
	async execute(interaction) {
		const nombre = interaction.options.getString('nombre');
		try {
			const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(nombre)}&limit=1`);
			const json = await response.json();
			const anime = json.data[0];

			if (!anime) {
				return interaction.reply('No se encontró ningún anime con ese nombre.');
			}

			await interaction.reply(`Anime sugerido ${anime.title} \n\n` +
                `**Sinopsis:** ${anime.synopsis?.substring(0, 500) || 'No disponible'} \n\n` +
                `**Episodios:** ${anime.episodes || 'Desconocido'} \n\n` +
                `**Puntuación:** ${anime.score || 'N/A'} \n\n` +
                `**Estado:** ${anime.status} \n\n` +
                // `**Transmisión:** ${anime.broadcast.string} \n\n` +
                `[Más información](${anime.url})`);
		}
		catch (error) {
			console.error(error);
			await interaction.reply('Oops, no pude conseguir un anime en este momento 😓');
		}
	},
};
