import * as esbuild from 'esbuild'

const METADATA = {
	name: 'YouTube Persist Playback Rate',
	match: ['https://www.youtube.com/*'],
	runAt: 'document-start',
	grant: ['GM_getValue', 'GM_setValue'],
	homepageURL: 'https://github.com/satohshi/youtube-persist-playback-speed',
} as const satisfies ScriptMetadata

const BUILD_OPTIONS = {
	entryPoints: ['src/index.ts'],
	bundle: true,
	outfile: 'dist/index.user.js',
	banner: { js: generateMetadataBlock(METADATA) },
	logLevel: 'info',
} as const satisfies esbuild.BuildOptions

const flags = process.argv.slice(2)

if (flags.includes('--watch')) {
	esbuild.context(BUILD_OPTIONS).then((context) => {
		context.watch().catch((err) => {
			console.error(err)
			process.exit(1)
		})
	})
} else {
	esbuild.build(BUILD_OPTIONS)
}

interface ScriptMetadata {
	name: string
	namespace?: string
	match?: string[]
	excludeMatch?: string[]
	include?: string[]
	exclude?: string[]
	version?: string
	description?: string
	icon?: string
	require?: string[]
	resource?: Record<string, string>
	runAt?: 'document-start' | 'document-body' | 'document-end' | 'document-idle'
	noframes?: boolean
	grant?: ViolentmonkeyAPI[]
	injectInto?: 'page' | 'content' | 'auto'
	downloadURL?: string
	supportURL?: string
	homepageURL?: string
	unwrap?: boolean
	topLevelAwait?: boolean
}

function generateMetadataBlock(metadata: ScriptMetadata): string {
	const toKebab = (key: keyof ScriptMetadata): string => {
		if (key === 'excludeMatch') return 'exclude-match'
		if (key === 'runAt') return 'run-at'
		if (key === 'injectInto') return 'inject-into'
		if (key === 'topLevelAwait') return 'top-level-await'
		return key
	}

	const lines: string[] = ['// ==UserScript==']

	for (const [key, value] of Object.entries(metadata)) {
		const kebabKey = toKebab(key as keyof ScriptMetadata)
		const directive = `@${kebabKey}`.padEnd(14)

		if (Array.isArray(value)) {
			for (const v of value) {
				lines.push(`// ${directive}${v}`)
			}
		} else if (typeof value === 'object' && value !== null) {
			for (const [k, v] of Object.entries(value)) {
				lines.push(`// ${directive}${k} ${v}`)
			}
		} else if (typeof value === 'boolean' && value) {
			lines.push(`// @${kebabKey}`)
		} else {
			lines.push(`// ${directive}${value}`)
		}
	}

	lines.push('// ==/UserScript==')

	return lines.join('\n')
}
