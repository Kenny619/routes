import { sign } from "hono/jwt";
import { setCookie, getCookie } from "hono/cookie";
import type { Context } from "hono";

export async function redirect(c: Context) {
	const source = c.req.param("source");
	const { results } = await c.env.DB.prepare(`
		SELECT name, destination FROM links WHERE source = ?
	`)
		.bind(source)
		.all();

	if (results.length === 0) return c.redirect("/404");
	const { name, destination } = results[0];

	let cid = getCookie(c, "cid");
	const ip = c.req.header("ip") || "unknown";
	const ref = c.req.header("Referer") || "unknown";
	const ua = c.req.header("User-Agent") || "unknown";
	const isMobile = ua.includes("Mobile") ? "Yes" : "No";
	const ln = c.req.header("Accept-Language") || "unknown";
	const payload = {
		ip,
		ref,
		ua,
		ln,
		isMobile,
	};
	if (!cid) {
		cid = await sign(payload, c.env.JWT_SECRET as string);
		setCookie(c, "cid", cid, {
			secure: true,
			httpOnly: false,
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 12,
		});
	}
	const req = JSON.stringify(c.req);
	//GA4
	const params = new URLSearchParams({
		v: "1", // Version
		tid: "G-LSSSV4GJRN", //  Google Analytics tracking ID
		cid: cid, //  unique client ID
		t: "pageview", // Event type
		dp: destination, // Page path.
		dt: name, // Page title
		dl: source, // short url
		uip: ip, // IP Override.
		ua: ua, // User Agent Override.
		dr: ref, // Referrer.
		ul: ln, // User Language.
		cd1: isMobile, // Custom dimension 1 (Mobile or not)
	});

	const res = await fetch(
		`https://www.google-analytics.com/mp/collect?measurement_id=${c.env.GA_MEASUREMENT_ID}&api_secret=${c.env.GA_API_SECRET}`,
		{
			method: "POST",
			body: JSON.stringify({
				client_id: cid,
				events: [
					{
						name: "page_view",
						params: {
							page_location: destination,
							client_id: cid,
							language: ln,
							page_title: name,
							user_agent: ua,
						},
					},
				],
			}),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		},
	);

	console.log("GA res", res);

	return c.redirect(destination);
}
