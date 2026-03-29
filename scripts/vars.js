function set_default(name, val) {
    // 1. Get the item using the variable 'name' as the key.
    chrome.storage.local.get([name], function (result) {
        // 2. Access the result using the same key 'name'
        if (result[name] === undefined) { 
            // If the value is not set, set it.
            chrome.storage.local.set({[name]: val});
        }
    })
}

async function get_val(name){
    const result = await chrome.storage.local.get([name]);
    return result[name];
}

set_default("role_exp_val", true);

async function set_updater(name, id) {
    const checkbox = document.getElementById(id);
    checkbox.checked = await get_val(name);
    checkbox.addEventListener("click", async () => {
        val = checkbox.checked;
        chrome.storage.local.set({[name]: val});
    })
}

set_updater("role_exp_val", "role_exp_val")
