import type { Context } from "hono";
export async function settings(c: Context) {
	// const hash = getCookie(c, "auth") || null;
	// if (!hash) return c.redirect("/login");

	return c.render(
		<div>
			<h2>Add new route</h2>
			<form
				action="/settings/add"
				method="post"
				style={{ display: "flex", flexDirection: "column", gap: "10px" }}
			>
				<div style={{ display: "flex", alignItems: "center" }}>
					<label htmlFor="name" style={{ width: "100px" }}>
						Name
					</label>
					<input
						type="text"
						name="name"
						id="name"
						autocomplete="off"
						style={{ width: "calc(100% - 100px)" }}
						required
					/>
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<label htmlFor="to" style={{ width: "100px" }}>
						Destination
					</label>
					<input
						type="text"
						name="destination"
						id="destination"
						autocomplete="off"
						style={{ width: "calc(100% - 100px)" }}
						required
					/>
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<label htmlFor="note" style={{ width: "100px" }}>
						Note
					</label>
					<input
						type="text"
						name="note"
						id="note"
						autocomplete="off"
						style={{ width: "calc(100% - 100px)" }}
					/>
				</div>
				<div style={{ display: "flex", justifyContent: "flex-end" }}>
					<button type="submit">Add</button>
				</div>
			</form>
		</div>,
	);
}
