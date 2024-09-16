//import { app } from "../index";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import type { Context } from "hono";
import { verifyPassword } from "../utils/password";
import { renderer } from "../renderer";

//app.use(renderer);

export async function loginAuth(c: Context) {
	const input = await c.req.parseBody();
	const adminHash = await c.env.KV.get("admin");
	if (adminHash === null) return c.redirect("/admin");

	console.log(input.password, adminHash);
	if (await verifyPassword(input.password as string, adminHash as string)) {
		console.log("login success");
		const token = await sign({ id: "admin" }, c.env.JWT_SECRET as string);
		setCookie(c, "admin", token, {
			secure: false,
			httpOnly: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 24,
		});
		return c.redirect("/");
	}
	//return c.redirect("/login");
	return c.render(
		<div>
			<h2>Login failed</h2>
			<a href="/login">Back to login</a>
		</div>,
	);
}
