import "./globals.css";
import { jetBrainsMono } from "@/app/libraries/fonts";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={jetBrainsMono.className}>{children}</body>
		</html>
	);
}
