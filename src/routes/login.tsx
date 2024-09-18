import type { Context } from "hono";

export async function login(c: Context) {
	const adminHash = await c.env.KV.get("admin");
	if (!adminHash) {
		return c.render(
			<div>
				<h2>Unauthorized Access</h2>
			</div>,
		);
	}

	return c.render(
		<div>
			<h2>Login as Admin</h2>
			<form action="/login/auth" method="post">
				<input
					type="password"
					name="password"
					autocomplete="off"
					style={{
						width: "80%",
					}}
					autofocus
				/>
				&nbsp;
				<button type="submit">login</button>
			</form>
		</div>,
	);
}
