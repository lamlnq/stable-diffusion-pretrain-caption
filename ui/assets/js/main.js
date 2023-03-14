"use strict";
/**
 * Client scripts
 */
let dataPath = '';
let currentData = {
    name: '',
    tags: ['']
};
let items = [];
let tags = {};
let page = 1;
let currentIndex = 0;
let currentKeywordFolderIndex = 0;
/**
 * elements
 */
const mainTagList = $('#useTags');
const keywordCompose = $("#keywordCompose");
const previewer = $('#preview');
const currentTagList = $('#currentTagList');
const mainTagFolder = $('#useTagFolders');
const dataList = $('#dataList');
const dataSlider = $('#dataSlider');
previewer.hide();
// Actions
$('#btnOpenSource').on('click', () => window.api.send('data.browser'));
$('#btnLoadKeyword').on('click', () => window.api.send('data.keyword'));
$('#btnSaveKeyword').on('click', () => window.api.send('data.keyword.export', tags));
window.api.receive('data.browser', ([pathInfo, files]) => {
    if (files) {
        dataPath = pathInfo;
        $('#sourceFolder').val(pathInfo);
        fundPhoto(files);
    }
});
window.api.receive('data.keyword', ([pathInfo, tagData]) => {
    if (tagData) {
        tags = tagData;
        fundTags();
    }
});
window.api.receive('caption.get', tags => {
    if (Array.isArray(tags)) {
        currentData.tags = tags;
        currentTagList.html('');
        let index = 0;
        for (const tag of tags) {
            currentTagList.append('<div class="ui label" id="c-tag-' + index + '">' + tag + '<i class="delete icon" onclick="removeTag(\'' + tag + '\')"></i></div>');
            index++;
        }
    }
});
/**
 * Functions
 */
function fundTags() {
    mainTagList.html('');
    mainTagFolder.html('');
    const folders = Object.keys(tags);
    for (const folder of folders) {
        const folderIndex = folders.indexOf(folder);
        mainTagFolder.append('<a class="item tag-folder-selector" id="tag-folder-selector-' + folderIndex + '" onclick="showTagFolder(' + folderIndex + ')">' + folder.toUpperCase() + '</a>');
        const folderContainer = $('<div>', {
            id: 'tag-folder-' + folderIndex,
            class: 'tag-folder ui labels'
        }).appendTo(mainTagList).hide();
        for (const tag of tags[folder]) {
            const index = tags[folder].indexOf(tag);
            folderContainer.append('<div class="ui label" id="tag-item-' + folder + '-' + index + '" onclick="addTag(\'' + folder + '\',' + index + ')">' + tag + '</div>');
        }
    }
    showTagFolder(0);
}
function fundTagTo(folder, item) {
    if (tags[folder]) {
        tags[folder].push(item);
    }
    else {
        tags[folder] = [item];
    }
    let folderE = $('#tag-folder-' + Object.keys(tags).indexOf(folder));
    if (!folderE.length) {
        folderE = $('<div>', {
            id: 'tag-folder-' + Object.keys(tags).indexOf(folder),
            class: 'tag-folder ui labels'
        }).appendTo(mainTagList);
    }
    const index = tags[folder].indexOf(item);
    folderE.append('<div class="ui label" id="tag-item-' + folder + '-' + index + '" onclick="addTag(\'' + folder + '\',' + index + ')">' + item + '</div>');
    return index;
}
function fundPhoto(files) {
    previewer.show();
    items = files;
    dataList.html('');
    for (const name of files) {
        const index = files.indexOf(name);
        if (name.match(/\.(jpg|jpeg|png|gif)$/i)) {
            dataList.append('<li class="data-thumb" id="data-' + index + '" onclick="selectPhoto(' + index + ')"><img class="ui rounded image" src="file://' + dataPath + '/' + name + '" alt="' + name + '"></li>');
        }
    }
    selectPhoto();
}
function selectPhoto(index) {
    currentIndex = index ?? 0;
    const name = items[currentIndex];
    $('#mainViewer').html('<img src="file://' + dataPath + '/' + name + '">');
    currentData = {
        name: name,
        tags: []
    };
    currentTagList.html('');
    window.api.send('caption.get', name);
    $('.data-thumb').removeClass('active');
    const item = $('#data-' + currentIndex);
    item.addClass('active');
    // @ts-ignore
    dataSlider.scrollTo(item);
}
function removeTag(tagToRemove) {
    for (const tag of currentData.tags) {
        if (tag == tagToRemove) {
            $('#c-tag-' + currentData.tags.indexOf(tag)).remove();
            currentData.tags.splice(currentData.tags.indexOf(tag), 1);
            return;
        }
    }
}
function addTag(folder, index) {
    const tag = tags[folder][index];
    if (currentData.tags.indexOf(tag) >= 0) {
        return true;
    }
    else {
        currentData.tags.push(tag);
        currentTagList.append('<div class="ui label" id="c-tag-' + currentData.tags.indexOf(tag) + '">' + tag + '<i class="delete icon" onclick="removeTag(\'' + tag + '\')"></i></div>');
    }
}
function showTagFolder(folderIndex) {
    $('.tag-folder').hide();
    $('.tag-folder-selector').removeClass('active');
    $('#tag-folder-' + folderIndex).show();
    $('#tag-folder-selector-' + folderIndex).addClass('active');
    currentKeywordFolderIndex = folderIndex;
}
/**
 * Enter to add new keyword to photo and current tag folder
 */
keywordCompose.on('keypress', (e) => {
    const currentVal = keywordCompose.val();
    if (e.key == 'Enter' && currentVal && currentVal.toString().length > 3) {
        const folder = Object.keys(tags)[currentKeywordFolderIndex];
        addTag(folder, fundTagTo(folder, currentVal.toString()));
        keywordCompose.val('');
        window.api.send('data.keyword.save', tags);
    }
});
/**
 * Navigation items with keyboard
 */
$(document).on('keydown', (e) => {
    let el = document.activeElement;
    try {
        if (el && (el.id == 'keywordCompose' || el.id == 'dataList')) {
            return; // active element has caret, do not proceed
        }
    }
    catch (ex) { }
    if (e.key == 'ArrowRight') {
        if (currentIndex < items.length - 1) {
            selectPhoto(currentIndex + 1);
        }
        else {
            selectPhoto(0);
        }
    }
    if (e.key == 'ArrowLeft') {
        if (currentIndex > 0) {
            selectPhoto(currentIndex - 1);
        }
        else {
            selectPhoto(items.length - 1);
        }
    }
});
$('#navLeft').on('click', () => {
    if (currentIndex > 0) {
        selectPhoto(currentIndex - 1);
    }
    else {
        selectPhoto(items.length - 1);
    }
});
$('#navRight').on('click', () => {
    if (currentIndex < items.length - 1) {
        selectPhoto(currentIndex + 1);
    }
    else {
        selectPhoto(0);
    }
});
$('#actRefresh').on('click', () => {
    selectPhoto(currentIndex);
});
$('#actSave').on('click', () => {
    window.api.send('caption.save', currentData);
});
//# sourceMappingURL=main.js.map