import Image from "next/image";
import { shantellSans } from "./libraries/fonts";
import { FAVGAMES_API } from "./libraries/favorite-games-api";
import Link from "next/link";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import TypingTextAnimation from "./components/typing-text-effect";
export async function generateMetadata() {
	const [gamesMetadata] = await fetchAllGamesForMetadata();
	const gameCoverImage =
		gamesMetadata.favoriteGameCoverImage.attributionImage.url;
	const gameCoverImageAttribution =
		gamesMetadata.favoriteGameCoverImage.attributionMarkdown;
	return {
		title: "favgames",
		description: "Microsite for my list of favorite games",
		metadataBase: "https://favgames.hydiary.my.id",
		robots: {
			index: true,
			follow: true,
			nocache: true,
			googleBot: { index: true, follow: true },
			bingBot: { index: true, follow: true },
		},
		openGraph: {
			title: "favgames",
			description: "Microsite for my list of favorite games",
			url: "https://favgames.hydiary.my.id",
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
export async function fetchAllGames() {
	const fetchedGames = await fetch(FAVGAMES_API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.FAVGAMES_TOKEN}`,
		},
		body: JSON.stringify({
			query: `query GetAllGames{
				favoriteGames(orderBy: createdAt_DESC) {
					gameTitle
					gameSlug
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
	return fetchedGames.data.favoriteGames;
}
export async function fetchAllGamesForMetadata() {
	const fetchedGames = await fetch(FAVGAMES_API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.FAVGAMES_TOKEN}`,
		},
		body: JSON.stringify({
			query: `query GetAllGames{
				favoriteGames(orderBy: createdAt_DESC, first:1) {
					gameTitle
					gameSlug
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
	return fetchedGames.data.favoriteGames;
}
export default async function Home() {
	const games = await fetchAllGames();
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-12 ">
			<div
				className={`${shantellSans.className} text-2xl xl:text-4xl font-bold`}
			>
				favgames.hydiary🕹️🎮
			</div>
			<div className="text-xl pt-4">
				A sequel to my{" "}
				<Link
					href={"https://github.com/naufalHaidar12342/nextjs-eid-fitri"}
					target="_blank"
					className="underline inline-flex items-center gap-1"
				>
					nextjs-eid-fitr <FaExternalLinkSquareAlt />
				</Link>
			</div>
			<div className="my-10 flex flex-col xl:flex-row w-full gap-6">
				{games.map((game) => (
					<div key={game.gameSlug} className="w-full h-full flex flex-col">
						<div className="h-56 lg:h-96 w-full relative">
							<Image
								src={game.favoriteGameCoverImage.attributionImage.url}
								style={{ objectFit: "cover" }}
								className="rounded-xl"
								fill
								priority={true}
							/>
						</div>
						<div className="group">
							<Link
								href={`/${game.gameSlug}`}
								className={`inline-flex items-center pt-4 text-xl font-medium group-hover:underline`}
							>
								{game.gameTitle}
								<FaArrowRightLong className="opacity-0 group-hover:opacity-100 group-hover:transition group-hover:ease-in group-hover:delay-75 group-hover:translate-x-3" />
							</Link>
						</div>
					</div>
				))}
			</div>
			<div className="w-full bg-stone-900  rounded-xl p-4 ">
				<h3 className="pb-4 text-lg flex gap-2 flex-wrap text-wrap">
					<span className="hidden lg:flex font-bold">
						{"favgames@hydiary:~$"}
					</span>
					<TypingTextAnimation textToShow={"About this site"} />
				</h3>
				<div className="flex flex-col gap-2">
					<p>
						A tribute to the late{" "}
						<a
							href="https://github.com/devardha"
							target="_blank"
							className="inline-flex items-center underline gap-1"
						>
							devardha <FaExternalLinkSquareAlt />
						</a>{" "}
					</p>
					<p>
						Back in 2022 Eid Fitr, he teached me how to use API/perform API call
						in Next.js, specifically in Next.js 12 where I have to declared{" "}
						<i>getStaticPaths</i>, <i>getStaticProps</i>. Also, the API that we
						used back then was limited for 5 request every second
					</p>
					<p>
						This year, 2024, marks the first year where I have to celebrate Eid
						Fitr without sending him goofy ahh meme, or talks about
						technology...
					</p>
				</div>
			</div>
		</main>
	);
}
