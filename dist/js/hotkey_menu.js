const invoke = window.__TAURI__.invoke
const emit = window.__TAURI__.event.emit;
const WebviewWindow = window.__TAURI__.window.WebviewWindow

document.addEventListener('DOMContentLoaded', async () => {
    let list = document.getElementById('list')

    const _CONFIG = await invoke('get_programming_languages')
    const CONFIG = await JSON.parse(_CONFIG.replace(/\\n/g, "\\n")
                                           .replace(/\\'/g, "\\'")
                                           .replace(/\\"/g, '\\"')
                                           .replace(/\\&/g, "\\&")
                                           .replace(/\\r/g, "\\r")
                                           .replace(/\\t/g, "\\t")
                                           .replace(/\\b/g, "\\b")
                                           .replace(/\\f/g, "\\f"))
    console.log(CONFIG);
    Object.keys(CONFIG.programming_languages).forEach(key => {
        let icon = document.createElement('img')
            icon.src = CONFIG.programming_languages[key].icon
        let icon_wrapped = document.createElement('div')
            icon_wrapped.appendChild(icon)
        let div = document.createElement('div')
            div.classList.add('list-item')
            div.dataset.name = CONFIG.programming_languages[key].name
            div.innerHTML = `<p>${CONFIG.programming_languages[key].name}</p>`
            div.appendChild(icon_wrapped)
        list.appendChild(div)
    });

    list.childNodes.forEach(list_item => {
        list_item.addEventListener('click', async () => {
            let font = 'varsity';
            let symbol = CONFIG.programming_languages[list_item.dataset.name.toLowerCase()].comment_symbol;
            let closing = CONFIG.programming_languages[list_item.dataset.name.toLowerCase()].closing_symbol ? CONFIG.programming_languages[list_item.dataset.name.toLowerCase()].closing_symbol : '';
            invoke('klax_start', {font: font, symbol: symbol, closing: closing})
            emit('hotkey_menu_killed')
            WebviewWindow.getByLabel('hotkey_menu').close()
        })
    });
})