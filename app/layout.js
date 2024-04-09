import "./globals.css";
import { jetBrainsMono } from "@/app/libraries/fonts";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<meta
				name="google-site-verification"
				content="Y3gt82__7lVPhqwq2pva7k_4ndiVrxXiksHBGwt9W-c"
			/>
			<body className={jetBrainsMono.className}>{children}</body>
		</html>
	);
}
