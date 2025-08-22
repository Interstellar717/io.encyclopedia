

if (!localStorage.clickableKeys) {
    localStorage.setItem('clickableKeys', false);
}
if (!localStorage.uiSize) {
    localStorage.setItem('uiSize', 30);
}

function updateUISize() {
    qs('.toggle-sidebar.left').style.fontSize = localStorage.getItem('uiSize') + "px" || "30px";

    qs('.toggle-sidebar.right').style.fontSize = localStorage.getItem('uiSize') + "px" || "30px";

    qs('#quick-esc').style.fontSize = localStorage.getItem('uiSize') + "px" || "30px";
    // qs('#quick-esc').style.right = ((localStorage.getItem('uiSize')) * 2.3 + 10) + "px";

    qs('.tab-container .new-tab').style.fontSize = localStorage.getItem('uiSize') + "px" || "30px";
    qs('.tab-container .new-tab').style.right = ((localStorage.getItem('uiSize')) * 2.3 + 10) + "px";

    qs('#hide-window').style.fontSize = localStorage.getItem('uiSize') + "px" || "30px";
    qs('#hide-window').style.right = ((localStorage.getItem('uiSize')) * 5.1 + 10) + "px";

    qsa('.sidebar').forEach(e => e.style.paddingTop = 90 + (localStorage.getItem('uiSize') - 30) * 2 + "px")
    qs('#ui-size-span').textContent = qs('#ui-size').value;
}


// shortcut functions
const qs = q => { return document.querySelector(q) };
const qsa = q => { return document.querySelectorAll(q) };


function change(url, side = "c") {

    if (url && !url.includes('.')) url = "https://google.com/search?q=" + window.encodeURIComponent(url) + "&igu=1";

    const frameID = {
        "c": "#game-frame",
        "l": "#right-frame"
    }

    const inputID = {
        "c": "#url",
        "l": "#url_right"
    }


    if (url.split('http').length > 1) {
        url = url
    } else {
        url = "http://" + url
    }

    document.querySelector(frameID[side]).src = url;
    document.querySelector(frameID[side]).style.display = "";
    document.querySelector(inputID[side]).value = "";
    if (side == "c") {
        toggleSidebar('left', 0); // if sidebar open, close it
        toggleSidebar('right', 0); // if sidebar open, close it
    }

}


function newTab(url, title) {
    new Tab(url, title);
}

function home() {
    document.querySelector('#game-frame').src = "";
    document.querySelector('#game-frame').style.display = "none";
    toggleSidebar('left', 0)
}

/* document.querySelector('#url').addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        document.getElementById('url_btn').click();
    }
}) */

document.querySelector('#url_right').addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        document.getElementById('url_btn_right').click();
    }
})

window.addEventListener('keydown', e => {
    if (e.target.tagName == "INPUT") {
        if (e.key == "Escape") {
            e.target.blur();
            e.target.value = "";


            if (e.target.id == "url_right") {
                toggleSidebar('right', 0);
            }
        }
        return false;
    }

    if (e.target.id != "url") {
        if (e.key == "`") {
            toggleSidebar('left');
        } else if (e.key == "~") {
            toggleSidebar('right');
        }
    }
})


addEventListener('keyup', function (e) {
    if (e.target.tagName == "INPUT") {
        return false;
    }

    if (keyToUrl[e.key]) {
        // change(keyToUrl[e.key], "c");
        newTab(keyToUrl[e.key], getGameFromKey(e.key).name);
    }
})

function getGameFromKey(key) {
    var noShift = {
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0'
    }
    for (let td of document.querySelectorAll("td")) {
        if (td.innerHTML.split("<span")[0].toLocaleLowerCase() == (noShift[key] || key.toLocaleLowerCase())) {
            return {
                name: td.querySelector("span").title || td.querySelector("span").textContent,
                url: keyToUrl[noShift[key] || key.toLocaleLowerCase()],
                td: td
            };
        }
    }
}


// bob
// still there 8/21/2025


function toggleSidebar(s, b) {

    var n = s == "left" ? "-" : "";


    /// MOVES SIDEBAR OFFSCREEN
    if (qs('.sidebar.' + s).style.transform == "translateX(" + n + "19.9vw)") { // if style moves sidebar offscreen
        qs('.sidebar.' + s).style.transform = "translateX(0vw)"; // reset that style measure

        if (s == "right" && (!qs('#right-frame').src || qs('#right-frame').src == "http://") && b != 0)
            setTimeout(() => { qs('#url_right').select() }, 100);
    }
    else {                                                    //otherwise
        qs('.sidebar.' + s).style.transform = "translateX(" + n + "19.9vw)"; // move it offscreen
    }


    // BOOLEAN OVERRIDE
    if (b == 0) {
        qs('.sidebar.' + s).style.transform = "translateX(" + n + "19.9vw)"; // close
    } else if (b == 1) {
        qs('.sidebar.' + s).style.transform = "translateX(0vw)"; // open


        if (s == "right" && (!qs('#right-frame').src || qs('#right-frame').src == "http://") && b != 0)
            setTimeout(() => { qs('#url_right').select() }, 100);
    }


    if (s == "right") {
        if (qs('.sidebar.' + s).style.transform == "translateX(19.9vw)") {

            qs('.tab-container').style.width = "";
            Tab.updateTabs();
        } else if (qs('.sidebar.' + s).style.transform != "translateX(19.9vw)") {

            qs('.tab-container').style.width = "calc(100% - " + qs('.sidebar.right').offsetWidth + "px)";
            Tab.updateTabs();
        }
    }

    if (s == "left") {
        if (qs('.sidebar.' + s).style.transform == "translateX(-19.9vw)") {

            qs('.tab-container').style.transform = "";
            Tab.updateTabs();
            qs('.tab-container').style.width = "";

        } else if (qs('.sidebar.' + s).style.transform != "translateX(-19.9vw)") {

            qs('.tab-container').style.transform = "translateX(19.9vw)";
            Tab.updateTabs();
            qs('.tab-container').style.width = "calc(100% - " + qs('.sidebar.left').offsetWidth + "px)";

        }
    }

}

qs('.toggle-sidebar.left').addEventListener('click', () => toggleSidebar('left')); // when click button, run toggleSidebar()
qs('.toggle-sidebar.right').addEventListener('click', () => toggleSidebar('right')); // when click button, run toggleSidebar()

toggleSidebar('left'); // hides sidebar on initialization
toggleSidebar('right'); // hides sidebar on initialization


function changeTitle(t = prompt('What do you want the title to be?')) {
    document.title = t || document.title;
    toggleSidebar('left', 0)
}

window.addEventListener('keydown', e => {
    var noShift = {
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0'
    }

    getGameFromKey(e.key)?.td?.classList?.add('active');

    if (e.key == "Shift") {
        qs('#shift').classList.add('active');
    } else if (e.key == " ") {
        qs('#spacebar').classList.add('active');
        !Tab.dialogVisible && Tab.showCreationDialog();
    }
})

window.addEventListener('keyup', e => {
    var noShift = {
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0'
    }

    getGameFromKey(e.key)?.td?.classList?.remove('active');


    if (e.key == "Shift") {
        qs('#shift').classList.remove('active');
    } else if (e.key == " ") {
        qs('#spacebar').classList.remove('active');
    }
})


function updateClickableKeys() {
    if (localStorage.getItem('clickableKeys') == "true") {
        qsa('td').forEach(el => {
            el.addEventListener('click', clickKey);
        })
    } else if (localStorage.getItem('clickableKeys') == "false") {
        qsa('td').forEach(el => {
            el.removeEventListener('click', clickKey);
        })
    }
}

function clickKey(e) {
    var shift = {
        '1': '!',
        '2': '@',
        '3': '#',
        '4': '$',
        '5': '%',
        '6': '^',
        '7': '&',
        '8': '*',
        '9': '(',
        '0': ')'
    }
    // change(
    newTab(
        keyToUrl[shift[e.target.innerHTML.split('<span>')[0]] || e.target.innerHTML.split('<span>')[0].toUpperCase()],
        e.target.querySelector("span")?.title || e.target.querySelector("span")?.textContent || e.target.textContent
    )
}



qs('#ui-size').value = localStorage.getItem('uiSize') || 30;


qs('#ui-size').addEventListener('change', e => {
    localStorage.setItem('uiSize', e.target.value);
    updateUISize();
})

qs('#ui-size').addEventListener('mousemove', e => {
    localStorage.setItem('uiSize', e.target.value);
    updateUISize();
})


if (localStorage.getItem('clickableKeys') == "true")
    qs('#toggle-click-keys').checked = true;
else
    qs('#toggle-click-keys').checked = false;


qs('#toggle-click-keys').addEventListener('change', e => {
    localStorage.setItem('clickableKeys', e.target.checked);
    updateClickableKeys();
})

qs('.sidebar.left').addEventListener('click', e => {
    if (e.target.classList.contains('sidebar')) {
        toggleSidebar('left', 1)
    }
})
qs('.sidebar.right').addEventListener('click', e => {
    if (e.target.classList.contains('sidebar')) {
        toggleSidebar('right', 1)
    }
})

// right now this detects the majority of the non-sidebar HTML. 
// In the future: make a code that detects whether the element clicks is or is a child of a sidebar element

qs('body').addEventListener('click', e => {
    if (!qs('.sidebar.left').contains(e.target) && !qs('.sidebar.right').contains(e.target) && !e.target.classList.contains('toggle-sidebar')) {
        toggleSidebar('left', 0);
        toggleSidebar('right', 0);
    } else if (e.target.classList.contains('sidebar') && e.target.classList.contains('left') && qs('.sidebar.left').style.transform == "translateX(-19.9vw)") {
        toggleSidebar('left', 0);
    } else if (e.target.classList.contains('sidebar') && e.target.classList.contains('right') && qs('.sidebar.right').style.transform == "translateX(19.9vw)") {
        toggleSidebar('right', 0);
    }
})


function capitalize(string) {
    return string[0]?.toUpperCase() + string?.substring(1, string.length);
}



updateUISize();
updateClickableKeys();

qsa("td").forEach(e => {
    !e.title && (e.title = e.querySelector("span")?.textContent || e.textContent);
})