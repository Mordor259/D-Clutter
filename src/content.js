(() => {
  const DEFAULT_SETTINGS = {
    enabled: true,
    theme: "auto"
  };

  const NOISE_SELECTORS = [
    "header",
    "footer",
    "nav",
    "aside",
    "[role='banner']",
    "[role='navigation']",
    "[role='complementary']",
    "[aria-label*='advert']",
    "[class*='ad-']",
    "[class*='ads']",
    "[id*='ad-']",
    ".sponsored",
    ".sidebar",
    ".newsletter",
    ".cookie",
    ".modal",
    ".popup"
  ];

  let userInteracted = false;
  const trappedVideos = new Set();
  let videoDrawer;
  let readerShell;

  function getMainContentNode() {
    const candidates = [
      document.querySelector("main"),
      document.querySelector("article"),
      document.querySelector("[role='main']")
    ].filter(Boolean);

    if (candidates.length) {
      return candidates.sort((a, b) => b.textContent.length - a.textContent.length)[0];
    }

    const blocks = [...document.querySelectorAll("div, section")];
    return blocks.sort((a, b) => b.textContent.length - a.textContent.length)[0] || document.body;
  }

  function hideNoise() {
    for (const selector of NOISE_SELECTORS) {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.closest("article") && !el.closest("main")) {
          el.classList.add("dclutter-hidden-noise");
        }
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.classList.remove("dclutter-dark");
    if (theme === "dark" || (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dclutter-dark");
    }
  }

  function ensureReaderShell() {
    if (readerShell) {
      return;
    }

    readerShell = document.createElement("div");
    readerShell.id = "dclutter-reader-shell";

    const mainNode = getMainContentNode();
    if (mainNode && mainNode !== readerShell && mainNode.parentElement) {
      mainNode.parentElement.insertBefore(readerShell, mainNode);
      readerShell.appendChild(mainNode);
    }
  }

  function ensureVideoDrawer() {
    if (videoDrawer) {
      return;
    }

    videoDrawer = document.createElement("details");
    videoDrawer.id = "dclutter-video-drawer";
    const summary = document.createElement("summary");
    summary.textContent = "Autoplay videos hidden (0)";

    const list = document.createElement("div");
    list.id = "dclutter-video-list";

    videoDrawer.append(summary, list);
    document.body.appendChild(videoDrawer);
  }

  function refreshVideoSummary() {
    if (!videoDrawer) {
      return;
    }

    const count = trappedVideos.size;
    const summary = videoDrawer.querySelector("summary");
    summary.textContent = `Autoplay videos hidden (${count})`;
  }

  function trapAutoplayVideo(video) {
    if (!video || trappedVideos.has(video)) {
      return;
    }

    trappedVideos.add(video);
    video.pause();
    video.muted = true;
    video.style.display = "none";
    video.setAttribute("controls", "controls");

    ensureVideoDrawer();
    const list = videoDrawer.querySelector("#dclutter-video-list");
    const item = document.createElement("div");
    item.className = "dclutter-video-item";

    const label = document.createElement("div");
    label.textContent = video.currentSrc || video.src || "Embedded video";
    label.style.wordBreak = "break-all";

    const button = document.createElement("button");
    button.textContent = "Show and play video";
    button.addEventListener("click", () => {
      video.style.display = "";
      video.muted = false;
      video.play().catch(() => {});
      item.remove();
      trappedVideos.delete(video);
      refreshVideoSummary();
    });

    item.append(label, button);
    list.appendChild(item);
    refreshVideoSummary();
  }

  function observeVideos() {
    const onInteraction = () => {
      userInteracted = true;
    };

    ["click", "keydown", "scroll", "touchstart"].forEach((event) => {
      window.addEventListener(event, onInteraction, { once: true, passive: true });
    });

    const scanExisting = () => {
      document.querySelectorAll("video").forEach((video) => {
        if (video.autoplay || !video.paused) {
          if (!userInteracted) {
            trapAutoplayVideo(video);
          }
        }

        video.addEventListener("play", () => {
          if (!userInteracted) {
            trapAutoplayVideo(video);
          }
        });
      });
    };

    scanExisting();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          if (node.tagName === "VIDEO") {
            if (!userInteracted) {
              trapAutoplayVideo(node);
            }
            node.addEventListener("play", () => {
              if (!userInteracted) {
                trapAutoplayVideo(node);
              }
            });
          }

          node.querySelectorAll?.("video").forEach((video) => {
            if (!userInteracted) {
              trapAutoplayVideo(video);
            }
            video.addEventListener("play", () => {
              if (!userInteracted) {
                trapAutoplayVideo(video);
              }
            });
          });
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function applySettings(settings) {
    if (!settings.enabled) {
      return;
    }

    document.documentElement.classList.add("dclutter-enabled");
    document.body.classList.add("dclutter-enabled");
    applyTheme(settings.theme);
    hideNoise();
    ensureReaderShell();
    observeVideos();
  }

  chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
    applySettings(result);
  });
})();
