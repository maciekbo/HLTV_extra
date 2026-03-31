async function get_val(name){
    const result = await chrome.storage.local.get([name]);
    return result[name];
}

function clear_skin_box() {
    const skin_box = document.getElementById("skins-loadout");
    if (skin_box) skin_box.remove();
}

(async () => {
    if (await get_val("block_skins")) clear_skin_box();
})();