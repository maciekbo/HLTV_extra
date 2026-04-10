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
set_default("event_names", {})

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

function get_event_name() {
    return document.querySelector("h1.event-hub-title").innerHTML;
}

async function toggle_pin_event(button) {
    let pinned = await get_val("pinned_events");
    let names = await get_val("event_names");
    const id = get_event_id();
    const index = pinned.indexOf(id);
    if (index > -1) {
        pinned.splice(index, 1);
        button.innerHTML = "Pin";
        delete names[id];
    } else {
        pinned.push(id);
        button.innerHTML = "Unpin";
        names[id] = get_event_name();
    }
    chrome.storage.local.set({["pinned_events"]: pinned});
    chrome.storage.local.set({["event_names"]: names});
    console.log(pinned);
    console.log(names);
}

async function create_pin_button() {
    const button = document.createElement("div");
    button.addEventListener("click", async () => {toggle_pin_event(button)});
    if (await is_pinned()) button.innerHTML = "Unpin";
    else button.innerHTML = "Pin";
    return button;
}

async function add_button_on_event_page() {

    const main_box = document.querySelector(".event-hub-top");
    if (!main_box) return;
    main_box.removeAttribute("href");
    console.log(main_box);
    main_box.alignItems = "right";

    const new_div = document.createElement("div");
    new_div.style.position = "absolute";
    new_div.style.display = "flex";
    new_div.style.justifyContent = "flex-end"; 
    new_div.style.alignItems = "center";
    new_div.style.gap = "15px";
    new_div.style.width = "100%";
    new_div.style.padding = "10px";
    new_div.style.boxSizing = "border-box";
    new_div.style.zIndex = "10";
    main_box.prepend(new_div);

    const time_status_div = main_box.querySelector(".event-hub-indicator");
    if (time_status_div) {
        time_status_div.style.position = "static";
        time_status_div.style.margin = "0";
        new_div.appendChild(time_status_div);
    }

    const pin_button = await create_pin_button();
    new_div.prepend(pin_button);
    pin_button.classList.add("event-hub-indicator");
    pin_button.classList.add("event-upcoming");
    pin_button.style.position = "static";
    pin_button.style.cursor = "pointer";

    console.log(main_box);
}

(async () => {
    if (await get_val("pin_events")) add_button_on_event_page();
})();