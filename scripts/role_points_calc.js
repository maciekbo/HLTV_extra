async function get_val(name){
    const result = await chrome.storage.local.get([name]);
    return result[name];
}

function add_expected_value(value) {
    const old_value_divs = document.querySelectorAll(".expected_value")
    old_value_divs.forEach(div => {
        div.remove();
    });
    //console.log(value)
    const value_div = document.createElement("div");
    value_div.className = "booster-trigger-rate expected_value"
    value_div.innerHTML = `Expected value: ${value}`
    value_div.id = "value-div";
    parent = document.querySelector(".booster-trigger-container")
    parent.appendChild(value_div)
    parent.style.height = "60px"
}

function calc_expected_value(target) {
    const temp1 = target.innerHTML;
    const big_rate = parseInt(temp1[0] + temp1[1]);
    const temp2 = target.querySelector("span").innerHTML;
    const small_rate = parseInt(temp2[0] + temp2[1]);
    const exp_val = (big_rate * 5 + small_rate * 2 + (100 - big_rate - small_rate) * (-2)) / 100
    //console.log(big_rate + " / " + small_rate + " | " + exp_val);
    return exp_val;
}

function handle_role_change() {
    const targetNode = document.querySelector(".booster-trigger-rate");
    if (!targetNode) {
        return;
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'attributes') {
                add_expected_value(calc_expected_value(targetNode));
                observer.disconnect(); // Stop observing after the first change
                return;
            }
        }
    });

    const config = { childList: true, subtree: true, characterData: true, attributes: true };
    observer.observe(targetNode, config);
}

function enhance_role_page() {
    //console.log("asdfsdfaasdf")
    const role_buttons = document.querySelectorAll(".booster-icon-container")

    if (role_buttons.length > 0) {
        role_buttons.forEach(button => {
            button.addEventListener("click", () => {
                //console.log("An inner role button has been clicked");
                //console.log("The inner HTML of the clicked button is: ", button.innerHTML);
                handle_role_change()
            });
        });
    } else {
        // If no elements are found, keep checking.
        setTimeout(enhance_role_page, 100);
    }
}

//the code before here is a total mess, I forgot how it works, might clean up later, for now I treat it like a blackbox

async function await_elements(query) {
    let elements = document.querySelectorAll(query);

    let time_elapsed = 0;
    let notified = false;
    while (elements.length == 0) {
        if (time_elapsed > 5000 && !notified) {
            console.log(`looking suspiciously long for ${query}`);
            notified = true;
        }
        time_elapsed += 100;
        await new Promise(resolve => setTimeout(resolve, 100));
        elements = document.querySelectorAll(query)
    }

    console.log(`query: ${query}\nreult: ${elements}`);

    return elements;
}

async function addClickListenerWhenReady() {
    const booster_buttons = await await_elements(".assign-role-button");

    booster_buttons.forEach(button => {
        button.addEventListener("click", () => {
            //console.log("An outer role button has been clicked");
            //console.log("The inner HTML of the clicked button is: ", button.innerHTML);
            enhance_role_page()
        });
    });
}

const values = [];
async function get_all_values() {
    const values = [];
    const booster_buttons = await await_elements(".gtSmartphone-only .booster-icon-container");

    booster_buttons[1].click();
    await await_elements(".booster-trigger-rate");
    for (const button of booster_buttons) {
        console.log(button);
        button.click();
        // const value_div = (await await_elements("#value-div"))[0];
        // const value = +value_div.innerHTML.slice(16);
        const rates_div = (await await_elements(".booster-trigger-rate"))[0];
        const value = calc_expected_value(rates_div);
        values.push(value);
    }
    console.log(values);
}

async function add_get_all_values_button() {
    const add_role_buttons = await await_elements(".assign-role-button");
    console.log(add_role_buttons);

    add_role_buttons.forEach(button => {
        if (!button.dataset.hasListener) {
            button.dataset.hasListener = true;
            button.addEventListener("click", async () => {
                const parent_div = (await await_elements("#fantasy-modal .left"))[0];
                console.log(parent_div);
                const mid_parent = document.createElement("div");
                mid_parent.classList.add("assign-booster-component")
                parent_div.appendChild(mid_parent);
                const new_button = document.createElement("div");
                new_button.classList.add("assign-booster-button");
                new_button.onclick = get_all_values;
                new_button.innerHTML = "Get expected value for all roles";
                mid_parent.prepend(new_button);
            });
        }
    })
}

(async () => {
    if (await get_val("role_exp_val")) {
        console.log("doing role exp value")
        await addClickListenerWhenReady();
        await add_get_all_values_button();
    } else {
        console.log("not doing role exp value")
    }
})();