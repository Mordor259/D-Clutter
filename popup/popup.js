const DEFAULT_SETTINGS = {
  enabled: true,
  theme: "auto"
};

const enabledInput = document.getElementById("enabled");
const themeInput = document.getElementById("theme");

function save() {
  chrome.storage.sync.set({
    enabled: enabledInput.checked,
    theme: themeInput.value
  });
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  enabledInput.checked = settings.enabled;
  themeInput.value = settings.theme;
});

enabledInput.addEventListener("change", save);
themeInput.addEventListener("change", save);
