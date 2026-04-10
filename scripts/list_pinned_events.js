async function get_val(name){
    const result = await chrome.storage.local.get([name]);
    return result[name];
}

function find_event_sidebar() {
    let result = null;
    document.querySelectorAll("aside > h1 > a").forEach(link => {
        if (link.getAttribute("href") == "/events") {
            console.log(link);
            result = link.closest("aside");
            return;
        }
    });
    return result;
}

function create_link(id, name) {
    const pin_icon =`
        <svg fill="currentColor" class="eventlogo">
            <path d="M16,9V4l1,0V2H7v2h1v5c0,1.66-1.34,3-3,3v2h5.97v7l1,1l1-1v-7H19v-2C17.34,12,16,10.66,16,9z"></path>
        </svg>`;
    const address = "/events/" + id + "/glory-to-carthage";

    const link = document.createElement("a");
    link.href = address;
    link.classList.add("event");
    link.innerHTML = pin_icon;

    const name_span = document.createElement("span");
    name_span.classList.add("eventname");
    name_span.innerHTML = name;
    link.appendChild(name_span);

    return link;
}

async function add_pinned_events() {
    const sidebar = find_event_sidebar();
    console.log(sidebar);
    if (sidebar) {
        const div = sidebar.querySelector("div");
        const pinned = await get_val("pinned_events");
        const names = await get_val("event_names");
        pinned.forEach(id => {
            div.prepend(create_link(id, names[id]));
        });
    }
}

(async () => {
    if (await get_val("pin_events")) add_pinned_events();
})();