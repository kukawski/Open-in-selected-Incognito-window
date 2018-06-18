const getTitle = (window) => window.incognito ? window.title.replace(/ ?-[^-]+$/, '') : window.title;

const populateContextMenu = async () => {
    await browser.menus.removeAll();

    const defaultSettings = {
        includeNormalWindows: false,
        unnestSingleWindow: false
    };

    const userSettings = await browser.storage.local.get(defaultSettings);

    let windows = await browser.windows.getAll({
        windowTypes: ['normal']
    });

    if (!userSettings.includeNormalWindows) {
        windows = windows.filter(w => w.incognito);
    }

    if (userSettings.unnestSingleWindow && windows.length === 1) {
        const window = windows[0];

        browser.contextMenus.create({
            id: `incognito-selection-window-${window.id}`,
            title: browser.i18n.getMessage('openLinkIn', getTitle(window)),
            contexts: ['link']
        });
    } else {
        const rootMenuItemId = browser.contextMenus.create({
            id: `incognito-selection`,
            title: browser.i18n.getMessage('openLinkInSelectedPrivateWindow'),
            contexts: ['link']
        });

        if (windows.length) {
            const incognitoIcon = {
                '16': 'incognito.svg'
            };

            windows.forEach((window) => {
                browser.contextMenus.create({
                    id: `incognito-selection-window-${window.id}`,
                    title: getTitle(window),
                    contexts: ['link'],
                    parentId: rootMenuItemId,
                    icons: userSettings.includeNormalWindows && window.incognito ? incognitoIcon : null
                });
            });

            browser.contextMenus.create({
                id: 'separator',
                type: 'separator',
                contexts: ['link'],
                parentId: rootMenuItemId
            });
        }

        if (userSettings.includeNormalWindows) {
            browser.contextMenus.create({
                id: `new-normal-window`,
                title: browser.i18n.getMessage('openLinkInNewWindow'),
                contexts: ['link'],
                parentId: rootMenuItemId
            });
        }

        browser.contextMenus.create({
            id: `new-incognito-window`,
            title: browser.i18n.getMessage('openLinkInNewPrivateWindow'),
            contexts: ['link'],
            parentId: rootMenuItemId
        });
    }
}

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith('incognito-selection-window-')) {
        browser.tabs.create({
            url: info.linkUrl,
            windowId: +info.menuItemId.substr('incognito-selection-window-'.length)
        });
    } else if (info.menuItemId === 'new-incognito-window') {
        browser.windows.create({
            incognito: true,
            url: info.linkUrl
        });
    } else if (info.menuItemId === 'new-normal-window') {
        browser.windows.create({
            incognito: false,
            url: info.linkUrl
        });
    }
});

if (browser.menus.onShown && browser.menus.refresh) {
    browser.menus.onShown.addListener(async (info, tab) => {
        await populateContextMenu();
        browser.menus.refresh();
    });
} else {
    browser.windows.onCreated.addListener(populateContextMenu);
    browser.windows.onRemoved.addListener(populateContextMenu);
    browser.tabs.onActivated.addListener(populateContextMenu);
    browser.tabs.onUpdated.addListener(populateContextMenu);

    populateContextMenu();
}
