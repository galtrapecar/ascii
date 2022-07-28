#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::io;
use std::env;
use std::path::Path;
use std::fs;
use std::thread;
use tauri::Manager;
use tauri::Window;
use device_query::{DeviceQuery, DeviceEvents, DeviceState, Keycode, MouseState, MousePosition};

#[derive(Clone, serde::Serialize)]
struct Payload {
  position: MousePosition,
}

#[tauri::command]
fn make_keylogger_thread(window: Window) {
  let thread_handle = thread::spawn(move || {
    println!("Spawned KeyLogger Thread.");
    let mut in_combination = false;
    let device_state = DeviceState::new();
    loop {
      let mouse: MouseState = device_state.get_mouse();
      if mouse.button_pressed[1] && in_combination {
        window.emit("kill_hotkey_menu", Payload { position: device_state.get_mouse().coords }).unwrap();
        in_combination = false;
      }
      if in_combination { continue; }
      let keys: Vec<Keycode> = device_state.get_keys();
      if keys.contains(&Keycode::LShift) && 
         keys.contains(&Keycode::LAlt) && 
         keys.contains(&Keycode::X) {
        window.emit("spawn_hotkey_menu", Payload { position: device_state.get_mouse().coords }).unwrap();
        in_combination = true;
      }
    }
  });
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      // Create klax/ directory in system root if it doesn't exist.
      let root = Path::new("/");
      assert!(env::set_current_dir(&root).is_ok());
      fs::create_dir_all("klax")?;

      make_keylogger_thread(app.get_window("main").unwrap());

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}