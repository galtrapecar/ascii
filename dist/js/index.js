const appWindow = window.__TAURI__.window.appWindow;

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('titlebar-minimize').addEventListener('click', () => appWindow.minimize())
    document.getElementById('titlebar-maximize').addEventListener('click', () => appWindow.toggleMaximize())
    document.getElementById('titlebar-close').addEventListener('click', () => appWindow.close())

    const start = document.getElementById('start')
    start.addEventListener('click', display_default_screen)

    /**
     * Changes app view to default screen
     */
    function display_default_screen() {
        start.removeEventListener('click', display_default_screen)

        window.location.assign('./pages/default.html') 
    }
})