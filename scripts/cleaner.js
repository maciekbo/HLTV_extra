async function get_val(name){
    const result = await chrome.storage.local.get([name]);
    return result[name];
}

function clear_skin_box() {
    const skin_box = document.getElementById("skins-loadout");
    if (skin_box) skin_box.remove();
}

function clear_player_photos() {
    const new_url = chrome.runtime.getURL("images/player_silhouette.png");
    document.querySelectorAll("img").forEach(image => {
        if (image.src.includes("playerbodyshot") || image.src.includes("blankplayer")) image.src = new_url;
    })
    document.querySelectorAll(".playerOfTheWeekBodyshotContainer").forEach(el => el.remove());
}

function clear_player_photos_in_matchup_details() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.classList.contains("matchup-details-player-img")) {
                        clear_player_photos;
                    }
                    node.querySelectorAll(".matchup-details-player-img").forEach(clear_player_photos);
                }
            })
        }
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

(async () => {
    if (await get_val("block_skins")) clear_skin_box();
    if (await get_val("block_player_photos")) {
        clear_player_photos();
        clear_player_photos_in_matchup_details();
    }
})();