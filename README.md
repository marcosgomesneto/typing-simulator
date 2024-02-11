# Typing Simulator for VSCode

The **Typing Simulator** plugin is tailored for live presentations or video tutorials, offering a seamless way to simulate the typing of pre-written code. This feature proves invaluable by eliminating the risk of typos during presentations, allowing you to focus on your speech and presentation rather than worrying about the code input.

You can also use this extension to impress your boss or your friends 😄. Activate `Manual` mode, and simply start typing any key to see your code materialize effortlessly.

Did you like the extension? Please give me a star ⭐ on this project on github and contribute to the project.

👉 [Project Repository](https://github.com/marcosgomesneto/typing-simulator)

## Usage

1. Install the `Typing Simulator` extension in VSCode.
2. Open a code file or copy the code to the clipboard.
3. Optionally, define the actions for each line (See the table below).
4. Press `CTRL` + `SHIFT` + `P`, search for the `Start Typing: ...` command.
5. Set up custom shortcuts for a seamless presentation experience.
6. Enjoy an engaging and hassle-free coding presentation or tutorial!

## Configure

Press `CTRL` + `SHIFT` + `P`, search for the `User Settings` and Search `Typing Simulator`.

![screenshot](https://raw.githubusercontent.com/marcosgomesneto/typing-simulator/main/resources/configuration.png)

## Key Features

- **Code Source Flexibility:** Whether your code is in an open file in VSCode or copied to the clipboard, Typing Simulator has you covered.

- **Two Simulation Modes:**

  - _Automatic:_ Let the plugin simulate human-like typing automatically.
  - _Manual:_ Control the simulation by manually typing any keys randomly, offering flexibility and a more interactive experience during presentations.

- **Customizable Simulation Behavior:**

  - Set line-specific behaviors, such as ignoring a line or defining breakpoints.
  - Adjust the typing speed for automatic mode, tailoring it to your presentation style.

- **Convenient Shortcuts (Tip):** To enhance your control over the simulation during live presentations or video recording, configure custom shortcuts in VSCode. Access VSCode's Keyboard Shortcuts settings (`File > Preferences > Keyboard Shortcuts`), search for Typing Simulator commands, and assign your preferred shortcuts.

## Available Commands:

- **Typing Simulator: Start Typing From Current File**
- **Typing Simulator: Start Typing From Clipboard**
- **Typing Simulator: Pause Typing**
- **Typing Simulator: Continue Typing**
- **Typing Simulator: Stop Typing**

Feel free to explore the documentation for in-depth information on features and customization options.

## Set actions per line

Comment at the end of each line with:

| End-Line Comment            | Action                         |
| --------------------------- | ------------------------------ |
| `//[pause]` or `#[pause]`   | Pause typing                   |
| `//[ignore]` or `#[ignore]` | Ignore line                    |
| `//[quick]` or `#[quick]`   | Instantly inserts line content |

## Why Typing Simulator?

This extension aims to combine the strengths of plugins with similar goals, such as HackerTyper, CoderTyper, and Live Auto-Type. By offering a feature-rich and customizable typing simulation experience, Typing Simulator ensures a smooth and error-free presentation of code, enhancing the overall quality of your live demos and video tutorials.

## Support and Contribution

If you encounter any issues or have suggestions for improvements, feel free to open an [issue](https://github.com/marcosgomesneto/typing-simulator/issues) on the GitHub repository.

If you want to contribute, please open a [pull request](https://github.com/marcosgomesneto/typing-simulator/pulls) in the repository.

**Happy Coding!**

## Release Notes

### 0.1.2

Change icon

### 0.1.1

Fix error 'Command not found' when start typing

---

### 0.0.2

Add support for comment character `#`

---

### 0.0.1

Hello! Wellcome to initial version

---
