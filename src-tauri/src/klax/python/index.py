
#  _____   ____    ____   _______      ___     _______      _________    ______   
# |_   _| |_   \  /   _| |_   __ \   .'   ˋ.  |_   __ \    |  _   _  | .' ____ \  
#   | |     |   \/   |     | |__) | /  .-.  \   | |__) |   |_/ | | \_| | |___ \_| 
#   | |     | |\  /| |     |  ___/  | |   | |   |  __ /        | |      _.____ˋ.  
#  _| |_   _| |_\/_| |_   _| |_     \  ˋ-'  /  _| |  \ \_     _| |_    | \____| | 
# |_____| |_____||_____| |_____|     ˋ.___.'  |____| |___|   |_____|    \______.' 
import os
import keyboard
import importlib
from collections import deque

#    ______    _____        ___     ______          _        _____       ______   
#  .' ___  |  |_   _|     .'   ˋ.  |_   _ \        / \      |_   _|    .' ____ \  
# / .'   \_|    | |      /  .-.  \   | |_) |      / _ \       | |      | |___ \_| 
# | |   ____    | |   _  | |   | |   |  __'.     / ___ \      | |   _   _.____ˋ.  
# \ ˋ.___]  |  _| |__/ | \  ˋ-'  /  _| |__) |  _/ /   \ \_   _| |__/ | | \____| | 
#  ˋ._____.'  |________|  ˋ.___.'  |_______/  |____| |____| |________|  \______.' 

_font = "varsity"

# Font holds a dictionary of available font characters 
# that is imported from a module in the `fonts` directory
font = importlib.import_module("fonts." + _font).font

# Typed characters are stored in a deque stack
character_stack = []

#  ________   _____  _____   ____  _____     ______   _________   _____     ___     ____  _____    ______   
# |_   __  | |_   _||_   _| |_   \|_   _|  .' ___  | |  _   _  | |_   _|  .'   ˋ.  |_   \|_   _| .' ____ \  
#   | |_ \_|   | |    | |     |   \ | |   / .'   \_| |_/ | | \_|   | |   /  .-.  \   |   \ | |   | |___ \_| 
#   |  _|      | '    ' |     | |\ \| |   | |            | |       | |   | |   | |   | |\ \| |    _.____ˋ.  
#  _| |_        \ \__/ /     _| |_\   |_  \ ˋ.___.'\    _| |_     _| |_  \  ˋ-'  /  _| |_\   |_  | \____| | 
# |_____|        ˋ.__.'     |_____|\____|  ˋ.____ .'   |_____|   |_____|  ˋ.___.'  |_____|\____|  \______.' 

# Callback function that gets a KeyboardEvent object from `on_press` (keyboard module)
# Exits program on `escape` key press
# Calls `backspace()` on `backspace` key press
# Calls `character()` on any other key press
def on_key_press(e):
    if (e.scan_code == 1):
        keyboard.unhook_all()
        os._exit(0)

    if (e.name != "backspace"):
        character(e)
    else:
        backspace(e)

# Makes use of keyboard module to type out each line of a 
# font's character defined in the `font` imported dictionary
def character(e):
    global character_stack

    if (e.name not in font): return None

    character_stack.append(e.name)

    for i in range(len(font[e.name]) - 1):
        keyboard.press_and_release("up")

    for line in font[e.name]:
        keyboard.write(line)
        keyboard.press_and_release("down")
    keyboard.press_and_release("up")

# Pops a character from the `character_stack` and deletes an
# appropriate ammount of lines of typed out characters
def backspace(e):
    global character_stack

    if len(character_stack) == 0: return None

    length = len(font[character_stack.pop()][0])
    for i in range(5):
            keyboard.press_and_release("up")

    for i in range(length):
        keyboard.press_and_release("left")

    for i in range(5):
        for i in range(length):
            keyboard.press_and_release("delete")
        keyboard.press_and_release("down")

    for i in range(length):
            keyboard.press_and_release("delete")

#   ______    ________   _________   _____  _____   _______   
# .' ____ \  |_   __  | |  _   _  | |_   _||_   _| |_   __ \  
# | |___ \_|   | |_ \_| |_/ | | \_|   | |    | |     | |__) | 
#  _.____ˋ.    |  _| _      | |       | '    ' |     |  ___/  
# | \____| |  _| |__/ |    _| |_       \ \__/ /     _| |_     
#  \______.' |________|   |_____|       ˋ.__.'     |_____|    

# Listens for any keyboard event and calls `on_key_press` as a callback
# True flag prevents default keyboard behaviour (typing, deleting etc.)
keyboard.on_press(on_key_press, True)

# Writes a first line vertical line of comments
# Adds an empty line at the bottom as padding
for i in range(len(font[list(font.keys())[0]])):
    keyboard.write("\n# ")
keyboard.write("\n")
keyboard.press_and_release("up")
keyboard.press_and_release("right")
keyboard.press_and_release("right")

# Locks program in a loop that waits for keyboard events
keyboard.wait()