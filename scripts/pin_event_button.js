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

set_default("pinned_events", []);

async function get_val(name){
    const result = await chrome.storage.local.get([name]);
    return result[name];
}

function get_event_id() {
    const url = window.location.pathname;
    return url.split('/')[2];
}

async function is_pinned() {
    const pinned = await get_val("pinned_events");
    const id = get_event_id();
    return pinned.includes(id);
}

async function toggle_pin_event(button) {
    let pinned = await get_val("pinned_events");
    const id = get_event_id();
    const index = pinned.indexOf(id);
    if (index > -1) {
        pinned.splice(index, 1);
        button.innerHTML = "Pin";
    } else {
        pinned.push(id);
        button.innerHTML = "Unpin";
    }
    chrome.storage.local.set({["pinned_events"]: pinned});
    console.log(pinned);
}

async function add_button_on_event_page() {
    const parent = document.querySelector(".event-hub-bottom");
    if (parent) {
        const button = document.createElement("div");
        button.classList.add("event-hub-link");
        button.addEventListener("click", async () => {toggle_pin_event(button)});
        if (await is_pinned(get_event_id)) button.innerHTML = "Unpin";
        else button.innerHTML = "Pin";
        parent.appendChild(button);
    }
}

(async () => {
    if (await get_val("pin_events")) add_button_on_event_page();
})();