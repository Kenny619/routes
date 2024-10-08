import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
	return (
		<html lang="en">
			<head>
				<link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css" />
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
				/>
			</head>
			<body>
				<header>
					<h1>
						<a href="/">Routes</a>
					</h1>
				</header>
				<div>{children}</div>
			</body>
		</html>
	);
});
