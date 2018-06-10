(async function () {
    document.querySelector('form').addEventListener('change', (event) => {
        browser.storage.local.set({
            includeNormalWindows: document.getElementById('includeNormalWindows').checked,
            unnestSingleWindow: document.getElementById('unnestSingleWindow').checked
        });
    });

    const defaultSettings = {
        includeNormalWindows: false,
        unnestSingleWindow: false
    };

    const userSettings = await browser.storage.local.get(defaultSettings);

    document.getElementById('includeNormalWindows').checked = userSettings.includeNormalWindows;
    document.getElementById('unnestSingleWindow').checked = userSettings.unnestSingleWindow;
}());