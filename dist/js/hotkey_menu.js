const invoke = window.__TAURI__.invoke

document.addEventListener("DOMContentLoaded", async () => {
    let list = document.getElementById("list")

    const _CONFIG = await invoke("get_programming_languages")
    const CONFIG = await JSON.parse(_CONFIG.replace(/\s+/g, ''))
    console.log(CONFIG);
    Object.keys(CONFIG.programming_languages).forEach(key => {
        let div = document.createElement('div')
            div.classList.add('list-item')
            div.dataset.name = CONFIG.programming_languages[key].name
            div.innerHTML = `<p>${CONFIG.programming_languages[key].name}<p>`
        list.appendChild(div)
    });
})