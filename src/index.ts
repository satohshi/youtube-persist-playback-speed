import { STORAGE_KEY } from './constants.js'
import { setupRateChangeListener, setupSoftNavigationObserver } from './utils.js'

sessionStorage.setItem(
	'yt-player-playback-rate',
	`{"data":"${GM_getValue(STORAGE_KEY, 1)}","creation":${Date.now()}}`
)

setupSoftNavigationObserver()

let cleanup: () => void

if (window.location.href.includes('/watch?v=')) {
	cleanup = setupRateChangeListener()
}

window.addEventListener('softnavigate', ({ detail }) => {
	cleanup?.()

	if (detail.to.includes('/watch?v=')) {
		cleanup = setupRateChangeListener()
	}
})
