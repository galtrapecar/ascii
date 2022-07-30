#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::env;
use std::path::{Path};
use path_absolutize::*;
use std::fs;
use std::thread;
use tauri::{Manager, Window};
use device_query::{DeviceQuery, DeviceState, Keycode, MouseState, MousePosition};

#[derive(Clone, serde::Serialize)]
struct Payload {
  position: MousePosition,
}

fn make_keylogger_thread(window: Window) {
  let _thread_handle = thread::spawn(move || {
    println!("Spawned KeyLogger Thread.");
    let mut in_combination = false;
    let device_state = DeviceState::new();
    loop {
      let mouse: MouseState = device_state.get_mouse();
      if mouse.button_pressed[3] && in_combination {
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

#[tauri::command]
fn get_programming_languages() -> std::string::String {
  let path = Path::new("src/klax");
  let cwd = env::current_dir().unwrap();
  path.absolutize_from(&cwd).unwrap().to_str().unwrap();
  let _ignore = env::set_current_dir(&path);
  println!("{}", env::current_dir().unwrap().display());
  let contents = fs::read_to_string("config.json").expect("Something went wrong reading config.json.");
  return contents;
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let cwd = env::current_dir().unwrap();
      // Create klax/ directory in system root if it doesn't exist.
      let root = Path::new("/");
      assert!(env::set_current_dir(&root).is_ok());
      fs::create_dir_all("klax")?;
      // Go back to program's working directory.
      assert!(env::set_current_dir(&cwd).is_ok());

      make_keylogger_thread(app.get_window("main").unwrap());

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_programming_languages])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}