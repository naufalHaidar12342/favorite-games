import Image from "next/image";
import { shantellSans } from "./libraries/fonts";
import { FAVGAMES_API } from "./libraries/favorite-games-api";
import Link from "next/link";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
export async function generateMetadata() {
	return {
		title: "List of Games | Favgames",
		description: "List of my favorite games",
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
				<Link href={""} className="underline inline-flex items-center gap-1">
					nextjs-eid-fitr <FaExternalLinkSquareAlt />
				</Link>{" "}
			</div>
			<div className="my-10 flex flex-col xl:flex-row w-full gap-6">
				{games.map((game) => (
					<div key={game.gameSlug} className="w-full h-full flex flex-col">
						<div className="h-40 xl:h-96 w-full relative">
							<Image
								src={game.favoriteGameCoverImage.attributionImage.url}
								style={{ objectFit: "cover" }}
								className="rounded-xl"
								fill
								priority={true}
							/>
						</div>
						<Link
							href={`/${game.gameSlug}`}
							className={`pt-4 text-xl font-medium`}
						>
							{game.gameTitle}
						</Link>
					</div>
				))}
			</div>
			<div className="bg-cyan-300 text-black">about this site</div>
		</main>
	);
}
