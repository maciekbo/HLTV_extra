function make_hash(str) {
    const mod = 1e9+9;
    const p = 257;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * p + str.charCodeAt(i)) % mod;
    }
    return hash;
}

function block_address(address) {
    const id = make_hash(address);
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id],
        addRules: [
            {
                "id": id,
                "priority": 1,
                "action": { "type": "block" },
                "condition": {
                    "urlFilter": address,
                    "domains": ["hltv.org"],
                    "resourceTypes": ["image"]
                }
            }
        ]
    });
}

function unblock_address(address) {
    const id = make_hash(address);
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id]
    });
}

function set_default(name, val) {
    chrome.storage.local.get([name], function (result) {
        if (result[name] === undefined) { 
            chrome.storage.local.set({[name]: val});
        }
    })
}

async function get_val(name){
    return new Promise(async function (res, rej) {
      chrome.storage.local.get([name], async function (result) {
          var userLocal = result[name];
          res(userLocal);
      });
    });
}

// toggle blocks

const memory_ids = {
    skins: "block_skins",
}

const addresses = {
    skins: ["||skins-cdn.hltv.org", "||hltv.org/img/static/logos/csmoney*", "||hltv.org/img/static/logos/skin*"]
}

//set defaults
for ([key, val] of Object.entries(memory_ids)) {
    set_default(val, false);
    // document.getElementById(val).checked = await get_val(val);
}

async function set_updater(key, id) {
    const checkbox = document.getElementById(id);
    checkbox.checked = await get_val(id);
    checkbox.addEventListener("click", async () => {
        const val = checkbox.checked;
        chrome.storage.local.set({[id]: val});
        for (const address of addresses[key]) {
            if (val) block_address(address);
            else unblock_address(address);
        }
    })
}

for ([key, val] of Object.entries(memory_ids)) {
    set_updater(key, val);
}