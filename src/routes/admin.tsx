import { renderer } from "../renderer";

import type { Context } from "hono";
export function admin(c: Context) {
	return c.render(
		<div>
			<h2>Register</h2>
			<form action="/admin/register" method="post">
				<input
					type="password"
					name="admin"
					autocomplete="off"
					style={{
						width: "80%",
					}}
				/>
				&nbsp;
				<button type="submit">Add</button>
			</form>
		</div>,
	);
}
