import { Hono } from "hono";
import { renderer } from "./renderer";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
//routes
import { login } from "./routes/login";
import { loginAuth } from "./routes/loginAuth";
import { admin } from "./routes/admin";
import { adminRegister } from "./routes/adminRegister";
import { redirect } from "./routes/redirect";
import { settings } from "./routes/settings";
import { routes } from "./routes/routes";
import { notFound } from "./notfound";
interface Bindings extends CloudflareBindings {
	JWT_SECRET: string;
	KV: KVNamespace;
	DB: D1Database;
}
const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);
// Protect routes under /settings/
app.use("/settings/*", async (c, next) => {
	const jwtMiddleware = jwt({
		secret: c.env.JWT_SECRET as string,
		cookie: "admin",
	});

	return jwtMiddleware(c, next);
});

const schema = z.object({
	name: z.string(),
	destination: z.string().url(),
	note: z.string().optional(),
});

export const validator = zValidator("form", schema, (result, c) => {
	if (!result.success) {
		return c.render(
			<div>
				<h2>Error!</h2>
				<a href="/">Back to top</a>
			</div>,
		);
	}
});

app.post("/settings/add", csrf(), validator, async (c, validator) => {
	const { name, destination, note } = c.req.valid("form");

	const { results: sourceResults } = await c.env.DB.prepare(
		"SELECT source FROM links;",
	).all();

	let u = false;
	let source = "";
	while (u === false) {
		const uuid = crypto.randomUUID();
		source = uuid.substring(0, 8);
		u = !sourceResults.some((result) => result.source === source);
	}

	const { results } = await c.env.DB.prepare(
		"SELECT * FROM links WHERE destination = ?;",
	)
		.bind(destination)
		.all();

	if (results.length > 0) {
		return c.render(
			<div>
				<h2>Error!</h2>
				<p>destination URL already exists</p>
			</div>,
		);
	}

	const result = await c.env.DB.prepare(
		"INSERT INTO links (name, source, destination, note) VALUES (?1, ?2, ?3, ?4);",
	)
		.bind(name, source, destination, note)
		.run();

	console.log(result);

	return c.render(
		<div>
			<h2>Added new route</h2>
			<p>Name: {name}</p>
			<p>From: {source}</p>
			<p>To: {destination}</p>
			<p>note: {note}</p>
		</div>,
	);
});

app.get("/", async (c) => {
	return c.render(
		<div>
			<h2>hi</h2>
		</div>,
	);
});

//receive password sent from login form on /login page
app.get("/login", async (c) => login(c));
app.post("/login/auth", async (c) => loginAuth(c));
app.get("/admin", async (c) => admin(c));
app.post("/admin/register", csrf(), async (c) => adminRegister(c));
app.get("/settings", async (c) => settings(c));
app.get("/settings/routes", async (c) => routes(c));
app.get("/:source{[0-9a-z]{8}}", async (c) => redirect(c));
app.get("/404", async (c) => notFound(c));
app.all("*", async (c) => {
	return c.render(
		<div>
			<h1>404 - Not Found</h1>
			<p>The URL you accessed could not be found on this server.</p>
		</div>,
	);
});

export default app;
