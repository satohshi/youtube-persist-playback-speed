// ==UserScript==
// @name         YouTube Persist Playback Rate
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @homepageURL  https://github.com/satohshi/youtube-persist-playback-speed
// ==/UserScript==
"use strict";
(() => {
  // src/constants.ts
  var STORAGE_KEY = "playbackRate";

  // src/utils.ts
  function setupSoftNavigationObserver() {
    let pathBefore = window.location.href;
    const observer = new MutationObserver(() => {
      if (pathBefore !== window.location.href) {
        window.dispatchEvent(
          new CustomEvent("softnavigate", {
            detail: {
              from: pathBefore,
              to: window.location.href
            }
          })
        );
        pathBefore = window.location.href;
      }
    });
    waitForSelector("title", (element) => {
      observer.observe(element, { childList: true });
    });
  }
  function setupRateChangeListener() {
    return waitForSelector("video", (videoElement) => {
      videoElement.addEventListener("ratechange", () => {
        GM_setValue(STORAGE_KEY, videoElement.playbackRate);
      });
    });
  }
  function waitForSelector(selector, callback) {
    const INTERVAL = 100;
    const MAX_TRIES = 50;
    let tries = 0;
    let timeout;
    (function check() {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else if (tries++ < MAX_TRIES) {
        timeout = setTimeout(check, INTERVAL);
      }
    })();
    return () => clearTimeout(timeout);
  }

  // src/index.ts
  sessionStorage.setItem(
    "yt-player-playback-rate",
    `{"data":"${GM_getValue(STORAGE_KEY, 1)}","creation":${Date.now()}}`
  );
  setupSoftNavigationObserver();
  var cleanup;
  if (window.location.href.includes("/watch?v=")) {
    cleanup = setupRateChangeListener();
  }
  window.addEventListener("softnavigate", ({ detail }) => {
    cleanup?.();
    if (detail.to.includes("/watch?v=")) {
      cleanup = setupRateChangeListener();
    }
  });
})();
