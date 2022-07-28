const invoke = window.__TAURI__.invoke

document.addEventListener("DOMContentLoaded", async () => {
    let list = document.getElementById("list")

    let programming_languages = invoke("get_programming_languages")

    console.log(programming_languages);
})