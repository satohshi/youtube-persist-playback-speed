const PORT = 3000

Bun.serve({
	port: PORT,
	fetch(req) {
		const url = new URL(req.url)
		const filePath = `dist${url.pathname}`

		try {
			const file = Bun.file(filePath)
			return new Response(file)
		} catch (error) {
			return new Response('File not found', { status: 404 })
		}
	},
})

console.log(`http://localhost:${PORT}/index.user.js`)
