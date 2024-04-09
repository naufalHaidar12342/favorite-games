import Image from "next/image";
import Link from "next/link";
import { FAVGAMES_API } from "@/app/libraries/favorite-games-api";
import { shantellSans } from "@/app/libraries/fonts";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import TypingTextAnimation from "@/app/components/typing-text-effect";

export async function generateMetadata({ params }) {
	const [gamesMetadata] = await fetchSelectedGameInfo(params.gameInfo);
	const gameCoverImage =
		gamesMetadata.favoriteGameCoverImage.attributionImage.url;
	const gameCoverImageAttribution =
		gamesMetadata.favoriteGameCoverImage.attributionMarkdown;
	return {
		title: `${gamesMetadata.gameTitle} | favgames`,
		description: gamesMetadata.gameShortDescription,
		metadataBase: "https://favgames.hydiary.my.id",
		robots: {
			index: true,
			follow: true,
			nocache: true,
			googleBot: { index: true, follow: true },
			bingBot: { index: true, follow: true },
		},
		openGraph: {
			title: `${gamesMetadata.gameTitle} | favgames`,
			description: gamesMetadata.gameShortDescription,
			url: `https://favgames.hydiary.my.id/${params.gameInfo}`,
			images: [
				{
					url: gameCoverImage,
					width: 1200,
					height: 630,
					alt: `Image for OpenGraph Image. ${gameCoverImageAttribution}`,
				},
			],
		},
	};
}
export async function fetchSelectedGameInfo(gameSlug) {
	const fetchedInfoFromSelectedGame = await fetch(FAVGAMES_API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.FAVGAMES_TOKEN}`,
		},
		body: JSON.stringify({
			query: `query GetGameInfo{
				favoriteGames(where: {gameSlug: "${gameSlug}"}) {
					gameTitle
					gameOfficialSite
					gameShortDescription
					favoriteGameCoverImage{
						attributionMarkdown
						attributionImage{
							url
						}
					}
				}
			}`,
		}),
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));
	return fetchedInfoFromSelectedGame.data.favoriteGames;
}
export default async function GameInformation({ params }) {
	const [gameSelectedInfo] = await fetchSelectedGameInfo(params.gameInfo);
	const gameTitle = gameSelectedInfo.gameTitle;
	const gameShortDescription = gameSelectedInfo.gameShortDescription;
	const gameOfficialSite = gameSelectedInfo.gameOfficialSite;
	const gameCoverImage =
		gameSelectedInfo.favoriteGameCoverImage.attributionImage.url;
	const gameCoverImageAttribution =
		gameSelectedInfo.favoriteGameCoverImage.attributionMarkdown;
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-12">
			<div
				className={`${shantellSans.className} text-2xl xl:text-4xl font-semibold`}
			>
				{gameTitle}
			</div>

			<Link
				href={gameOfficialSite}
				target="_blank"
				className="underline inline-flex items-center gap-1 text-xl"
			>
				Official Site <FaExternalLinkSquareAlt />
			</Link>
			<div className="h-40 lg:h-[450px] w-full relative my-8">
				<Image
					src={gameCoverImage}
					alt={gameTitle}
					style={{ objectFit: "cover" }}
					fill
					priority={true}
					className="rounded-xl"
				/>
			</div>
			<ReactMarkdown
				className="pb-4"
				components={{
					a: (link) => {
						return (
							<Link
								href={link.href}
								target="_blank"
								className="inline-flex underline items-center font-semibold gap-2"
							>
								{link.children} <FaExternalLinkSquareAlt />
							</Link>
						);
					},
				}}
			>
				{gameCoverImageAttribution}
			</ReactMarkdown>
			<div className="bg-stone-900 p-4 rounded-xl flex flex-col gap-4">
				<TypingTextAnimation textToShow={"What is this game about?"} />
				<p>{gameShortDescription}</p>
			</div>
		</main>
	);
}
