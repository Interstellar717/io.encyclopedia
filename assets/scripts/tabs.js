class Tab {

    static numberOfTabs = 0;
    static tabList = [];
    static tabContainer = document.querySelector(".tab-container");
    static creationDialog = document.querySelector(".creation-dialog");
    static focusedTab;
    static dialogVisible = false;


    static getTab(index) {
        for (let i = 0; i < this.numberOfTabs; i++) {
            if (this.tabList[i].index == index) {
                return this.tabList[i];
            }
        }
    }

    static updateTabPositions() {
        var x = 0;
        for (let i = 0; i < Tab.numberOfTabs; i++) {
            let tab = this.getTab(i + 1);
            tab.setX(x + "px");
            x += (tab.tabLabel.offsetWidth + 5);
        }
    }

    static updateTabLabelWidths() {
        for (let tab of this.tabList) {
            this.tabContainer.querySelectorAll(".tab-label")[tab.index - 1].style.width = "fit-content";
            var w = this.tabContainer.querySelectorAll(".tab-label")[tab.index - 1].offsetWidth;
            this.tabContainer.querySelectorAll(".tab-label")[tab.index - 1].style.width = `clamp(${w - 60}px, 65%, ${100 / this.numberOfTabs - 10}vw)`;
        }
    }

    static updateTabs() {
        this.updateTabLabelWidths();
        this.updateTabPositions();
    }

    static hideAll() {

        this.tabContainer.style.opacity = 0;

        setTimeout(() => {
            this.tabContainer.style.display = "none";
        }, 500);
    }

    static showAll() {

        this.tabContainer.style.display = "";
        setTimeout(() => {
            this.tabContainer.style.opacity = 1;
        }, 10);
    }

    static showCreationDialog() {
        this.dialogVisible = true;
        this.creationDialog.style.opacity = "0";
        this.creationDialog.style.display = "";
        setTimeout(() => {
            this.creationDialog.style.opacity = "1";
            this.creationDialog.querySelector("#creation-url-input").select();
        }, 10);
        document.querySelector(".blur-background").style.opacity = 1;
        document.querySelector(".blur-background").style.setProperty("z-index", "10");

    }

    static hideCreationDialog() {
        this.dialogVisible = false;
        this.creationDialog.style.opacity = "0";
        setTimeout(() => {
            this.creationDialog.style.display = "none";
        }, 500);
        this.creationDialog.querySelector("#creation-url-input").value = "";
        this.creationDialog.querySelector("#creation-url-input").blur();
        this.creationDialog.querySelector("#creation-title-input").value = "";
        this.creationDialog.querySelector("#creation-title-input").blur();
        document.querySelector(".blur-background").style.opacity = 0;
        document.querySelector(".blur-background").style.setProperty("z-index", "-1");
    }

    constructor(url = "", title = "") {
        Tab.numberOfTabs++;
        Tab.tabList.push(this);

        if (Tab.numberOfTabs == 1) {
            Tab.tabContainer.style.display = "";
        }

        this.focused = false;
        this.setURL(url);
        this.setTitle(title);
        this.index = Tab.numberOfTabs;

        this.frame = document.createElement("iframe");
        this.frame.classList.add("tab-frame");
        this.frame.src = this.url;
        this.tabLabel = document.createElement("div");
        this.tabLabel.classList.add("tab-label");
        this.tabLabel.addEventListener("click", e => {
            this.focus();
        });
        this.tabLabel.addEventListener("mouseup", e => {
            e.button == 1 && this.close();
        });
        this.tabLabel.textContent = this.title;
        Tab.tabContainer.append(this.tabLabel, this.frame);

        this.attachToBody();
        this.focus();

        Tab.showAll();

    }

    setTitle(string) {
        this.title = string;
    }

    setURL(string) {
        this.url = string;
    }

    attachToBody() {
        document.querySelector("body").appendChild(Tab.tabContainer);
        setTimeout(() => Tab.updateTabs(), 100);
    }



    setX(x) {
        this.tabLabel.style.transform = `translateX(${x})`;
    }

    show() {
        this.frame.style.display = "";
        this.tabLabel.classList.add("active");
    }

    hide() {
        this.frame.style.display = "none";
        this.tabLabel.classList.remove("active");
    }

    focus() {
        var hideList = [];
        Tab.tabList.forEach(e => { if (e != this) hideList.push(e) });
        this.show();
        hideList.forEach(e => {
            e.hide(), e.focused = false
        });
        this.focused = true;
        Tab.focusedTab = this;
    }

    close() {
        for (let i in Tab.tabList) {
            if (Tab.tabList[i] == this) {
                Tab.tabList.splice(i, 1);
                Tab.numberOfTabs--;
                for (let j = i; j < Tab.tabList.length; j++) {
                    Tab.tabList[j].index--;
                }
                break;
            }
        }

        this.tabLabel.remove();
        this.frame.remove();
        delete this.tabLabel;
        delete this.frame;

        Tab.updateTabs();

        if (this.focused) {
            var tab;
            for (let i = this.index; i >= 0; i--) {
                tab = Tab.getTab(i);
                if (tab) {
                    break;
                }
            }
            tab && tab.focus(); // Can use this.index because indices have been updated
        }

        if (Tab.numberOfTabs <= 0) {
            Tab.tabContainer.style.display = "none";
        }

    }



}

window.addEventListener("resize", e => {
    Tab.updateTabs();
})

for (let i of document.querySelectorAll(".new-tab")) {
    i.addEventListener("click", event => {
        Tab.showCreationDialog();
    })
}

for (let i of document.querySelectorAll("#hide-window")) {
    i.addEventListener("click", event => {
        Tab.hideAll();
    })
}

for (let i of document.querySelectorAll(".dialog-input")) {
    i.addEventListener('keypress', e => {
        if (e.key == "Enter") {
            var url = qs("#creation-url-input").value;
            var title = capitalize(qs("#creation-title-input").value);
            var shortcuts = {
                "google": "google.com/webhp?igu=1",
                "google.com": "google.com/webhp?igu=1"
            }

            if (!title || title == "undefined" || !title.split(" ").join("")) {
                title = url.split(".com")[0].split(".org")[0].split(".net")[0].split(".io")[0].split(".").join(" ");
                for (let t = title.split(" "), i = 0; i < t.length; i++) {
                    !i && (title = [])
                    title.push(capitalize(t[i]));
                }
                title = title.join(" ");
            }

            url = shortcuts[url.toLowerCase()] || url;

            if (!url.includes("http"))
                url = "https://" + url;



            new Tab(url, title);
            Tab.hideCreationDialog();
        }
    })

    window.addEventListener('keyup', e => {
        if (e.key == "Escape") {
            Tab.hideCreationDialog();
        }
    })
}