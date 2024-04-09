export default function sitemap() {
	return [
		{
			url: "https://favgames.hydiary.my.id",
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: "https://favgames.hydiary.my.id/(:slug)",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
	];
}
