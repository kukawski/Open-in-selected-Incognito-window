const populateContextMenu = async () => {
    await browser.menus.removeAll();
    let windows = await browser.windows.getAll({
        populate: true,
        windowTypes: ['normal']
    });

    windows = windows.filter(w => w.incognito);

    await browser.contextMenus.create({
        id: `incognito-selection`,
        title: browser.i18n.getMessage('openLinkInSelectedPrivateWindow'),
        contexts: ['link']
    });

    if (windows.length) {
        windows.forEach((w) => {
            browser.contextMenus.create({
                id: `incognito-selection-window-${w.id}`,
                title: `${w.title}`,
                contexts: ['link'],
                parentId: 'incognito-selection'
            });
        });

        browser.contextMenus.create({
            id: 'separator',
            type: 'separator',
            contexts: ['link'],
            parentId: 'incognito-selection'
        });
    }

    browser.contextMenus.create({
        id: `new-incognito-window`,
        title: browser.i18n.getMessage('openLinkInNewPrivateWindow'),
        contexts: ['link'],
        parentId: 'incognito-selection'
    });
}

browser.windows.onCreated.addListener(() => populateContextMenu());
browser.windows.onRemoved.addListener(() => populateContextMenu());
browser.tabs.onActivated.addListener(() => populateContextMenu());

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
    }
});

populateContextMenu();
