import type { Context } from "hono";
import { hashPassword } from "../utils/password";

export async function adminRegister(c: Context) {
	const input = await c.req.parseBody();
	const hash = await hashPassword(input.admin as string);
	await c.env.KV.put("admin", hash);
	return c.redirect("/login");
}
