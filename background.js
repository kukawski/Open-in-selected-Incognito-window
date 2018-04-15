browser.windows.onCreated.addListener(() => populateContextMenu());
browser.windows.onRemoved.addListener(() => populateContextMenu());
browser.tabs.onActivated.addListener(() => populateContextMenu());

const populateContextMenu = async () => {
    await browser.menus.removeAll();
    const windows = await browser.windows.getAll({
        populate: true,
        windowTypes: ['normal']
    });

    await browser.contextMenus.create({
        id: `incognito-selection`,
        title: `Select Incognito window`,
        contexts: ['link']
    });

    windows.filter(w => w.incognito).forEach((w) => {
        browser.contextMenus.create({
            id: `incognito-selection-window-${w.id}`,
            title: `${w.title}`,
            contexts: ['link'],
            parentId: 'incognito-selection'
        });
    });
}

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith('incognito-selection-window-')) {
        browser.tabs.create({
            url: info.linkUrl,
            windowId: +info.menuItemId.substr('incognito-selection-window-'.length)
        });
    }
});

populateContextMenu();
