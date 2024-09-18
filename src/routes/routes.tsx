import type { Context } from "hono";

export async function routes(c: Context) {
	const { results } = await c.env.DB.prepare(
		"SELECT name, source, destination, note FROM links",
	).all();
	const tableStyle = {
		borderCollapse: "collapse",
		width: "100%",
	};

	const cellStyle = {
		border: "1px solid #eee",
		padding: "6px 6px",
		textAlign: "left",
		fontSize: "11px",
	};

	const URLCellStyle = {
		...cellStyle,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		maxWidth: "200px",
	};

	return c.render(
		<div>
			<h2>Routes</h2>
			<table style={tableStyle}>
				<thead>
					<tr>
						<th style={cellStyle}>Name</th>
						<th style={cellStyle}>Source</th>
						<th style={URLCellStyle}>Destination</th>
						<th style={cellStyle}>Note</th>
					</tr>
				</thead>
				<tbody>
					{results.map((route: { [K: string]: string }, index: number) => (
						<tr key={route.name}>
							<td style={cellStyle}>{route.name}</td>
							<td style={URLCellStyle}>
								<a href={`../${route.source}`}>{route.source}</a>
							</td>
							<td style={URLCellStyle}>
								<a href={route.destination}>{route.destination}</a>
							</td>
							<td style={cellStyle}>{route.note}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>,
	);
}
