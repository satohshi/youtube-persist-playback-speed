import { STORAGE_KEY } from './constants.js'

declare global {
	interface WindowEventMap {
		softnavigate: CustomEvent<{ from: string; to: string }>
	}
}

export function setupSoftNavigationObserver() {
	let pathBefore = window.location.href
	const observer = new MutationObserver(() => {
		if (pathBefore !== window.location.href) {
			window.dispatchEvent(
				new CustomEvent('softnavigate', {
					detail: {
						from: pathBefore,
						to: window.location.href,
					},
				})
			)
			pathBefore = window.location.href
		}
	})

	waitForSelector<HTMLTitleElement>('title', (element) => {
		observer.observe(element, { childList: true })
	})
}

export function setupRateChangeListener() {
	return waitForSelector<HTMLVideoElement>('video', (videoElement) => {
		videoElement.addEventListener('ratechange', () => {
			GM_setValue(STORAGE_KEY, videoElement.playbackRate)
		})
	})
}

function waitForSelector<T extends Element>(
	selector: string,
	callback: (element: T) => void
): () => void {
	const INTERVAL = 100
	const MAX_TRIES = 50

	let tries = 0
	let timeout: ReturnType<typeof setTimeout>
	;(function check() {
		const element = document.querySelector<T>(selector)
		if (element) {
			callback(element)
		} else if (tries++ < MAX_TRIES) {
			timeout = setTimeout(check, INTERVAL)
		}
	})()

	return () => clearTimeout(timeout)
}
