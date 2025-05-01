const spawnOptions = {
	stdin: 'inherit',
	stdout: 'inherit',
	stderr: 'inherit',
} as const

;(async () => {
	Bun.spawn(['bun', 'run', 'build:watch'], spawnOptions)
	Bun.spawn(['bun', 'run', 'serve'], spawnOptions)
})()
