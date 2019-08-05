const request = require("request-promise");
const parser = new DOMParser();

class Language {
    constructor(text) {
        this.text = text;
    }

    toString() {
        return "(" + this.text + ")";
    }
}

const getLanguages = () => {
    return new Promise((resolve, reject) => {
        request("https://github.com/trending")
            .then(response => {
                if (!response) reject("response is null!")
                const docHtml = parser.parseFromString(response, "text/html");
                const nodes = docHtml
                    .querySelector(".select-menu-list")
                    .querySelectorAll(".select-menu-item-text");
                const languages = nodes.map(node => Language(node.innerHTML)).toArray();
                resolve(languages);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export { getLanguages };
