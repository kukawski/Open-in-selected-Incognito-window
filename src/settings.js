(async function () {
  document.querySelector("form").addEventListener("change", () => {
    browser.storage.local.set({
      includeNormalWindows: document.getElementById("includeNormalWindows")
        .checked,
      unnestSingleWindow: document.getElementById("unnestSingleWindow").checked,
      activateTab: document.getElementById("activateTab").checked,
      excludeCurrentWindow: document.getElementById("excludeCurrentWindow")
        .checked,
    });
  });

  const defaultSettings = {
    includeNormalWindows: false,
    unnestSingleWindow: false,
    activateTab: false,
    excludeCurrentWindow: false,
  };

  const userSettings = await browser.storage.local.get(defaultSettings);
  const allowedInIncognito = await browser.extension.isAllowedIncognitoAccess();

  document.getElementById("includeNormalWindows").checked =
    userSettings.includeNormalWindows;
  document.getElementById("unnestSingleWindow").checked =
    userSettings.unnestSingleWindow;
  document.getElementById("activateTab").checked = userSettings.activateTab;
  document.getElementById("excludeCurrentWindow").checked =
    userSettings.excludeCurrentWindow;
  document
    .getElementById("allow-incognito")
    .classList.toggle("visible", !allowedInIncognito);
})();
