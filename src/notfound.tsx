import type { Context } from "hono";

export async function notFound(c: Context) {
	return c.html(
		<>
			<style>{`
				body, html {
				margin: 0;
				padding: 0;
				height: 100%;
				width: 100%;
			}
			.full-screen {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100vh;
				width: 100vw;
				background-color: #f0f0f0;
				font-size: 60px;
			}
		`}</style>
			<div class="full-screen">
				<h1>404 - Not Found</h1>
			</div>
		</>,
	);
}
