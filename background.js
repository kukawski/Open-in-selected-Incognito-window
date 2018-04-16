const populateContextMenu = async () => {
    await browser.menus.removeAll();
    let windows = await browser.windows.getAll({
        populate: true,
        windowTypes: ['normal']
    });

    windows = windows.filter(w => w.incognito);

    if (windows.length) {
        await browser.contextMenus.create({
            id: `incognito-selection`,
            title: browser.i18n.getMessage('openLinkInSelectedPrivateWindow'),
            contexts: ['link']
        });

        windows.forEach((w) => {
            browser.contextMenus.create({
                id: `incognito-selection-window-${w.id}`,
                title: `${w.title}`,
                contexts: ['link'],
                parentId: 'incognito-selection'
            });
        });
    }
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
    }
});

populateContextMenu();
