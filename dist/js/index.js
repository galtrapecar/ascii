const appWindow = window.__TAURI__.window.appWindow
const WebView = window.__TAURI__.window.WebView
const WebviewWindow = window.__TAURI__.window.WebviewWindow
const PhysicalPosition = window.__TAURI__.window.PhysicalPosition
const listen = window.__TAURI__.event.listen
const invoke = window.__TAURI__.invoke

document.addEventListener("DOMContentLoaded", async () => {
    /**
     * Listen for hotkey command defined in `src/main.rs`.
     * Spawns a webview window next to cursor.
     */
    listen('spawn_hotkey_menu', async (event) => {
        console.log("Spawned menu.")
        const payload = event.payload
        const position = new PhysicalPosition(payload.position[0], payload.position[1])

        const webview = new WebviewWindow('hotkey_menu', {
            url: '../pages/hotkey-menu.html',
            alwaysOnTop: true,
            decorations: false,
            height: 300,
            width: 200,
            visible: false,
            transparent: true,
            x: position.x,
            y: position.y,
        })

        webview.once('tauri://created', function () {
            console.log("Hotkey window created.")
            webview.setPosition(position)
            webview.show()
        })
    })
    /**
     * Listen for end of hotkey command defined in `src/main.rs`.
     * Kills previously spawned webview window.
     */
    listen('kill_hotkey_menu', (ignore) => {
        let hotkey_menu = WebviewWindow.getByLabel('hotkey_menu')
        hotkey_menu.close()
        console.log("Killed menu.")
    })

    /**
     * Add functionality to custom titlebar buttons.
     */
    document.getElementById('titlebar-minimize').addEventListener('click', () => appWindow.minimize())
    document.getElementById('titlebar-maximize').addEventListener('click', () => appWindow.toggleMaximize())
    document.getElementById('titlebar-close').addEventListener('click', () => appWindow.close())

    /**
     * Start button changes app view to default screen.
     */
    const start = document.getElementById('start')
    start.addEventListener('click', display_default_screen)

    function display_default_screen() {
        start.removeEventListener('click', display_default_screen)
        window.location.assign('./pages/default.html')
    }
})