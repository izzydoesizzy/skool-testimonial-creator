# Skool Testimonial Creator

Collect testimonials and member highlights from your Skool community and turn them into beautiful social graphics. This Chrome extension makes it easy to identify posts, comments and member descriptions, capture their text and export a polished 1400×790 image suitable for sharing or promotional materials.

## Features

- 🔍 **Highlight & Select** – Enable **Testimonial Mode** or **Member Mode** from the extension popup to highlight relevant elements on a Skool page. Simply click a highlighted post, comment or member card to add its content to your collection.
- 🎛️ **Simple Editor** – Open the built‑in editor to arrange up to ten selections on a fixed‑size canvas. Choose a background colour, add a footer message and include your own logo for branding.
- 🖼️ **Export Graphics** – Render the layout on a 1400 × 790 canvas and download the result as a PNG with a single click.
- ✨ **Minimal Setup** – The extension relies on sensible default selectors but exposes them in the content script so you can adjust them as Skool evolves.

## Installation

1. Clone or download this repository to your machine.

   ```sh
   git clone https://github.com/izzydoesizzy/skool-testimonial-creator.git
   cd skool-testimonial-creator
   ```

2. Build the extension assets (icons are already included in the `icons` folder). There is nothing to compile – everything is plain HTML, CSS and JavaScript.

3. Open **Google Chrome** and navigate to `chrome://extensions/`.

4. Enable **Developer mode** using the toggle in the top‑right corner.

5. Click **Load unpacked** and select the `skool-testimonial-creator-extension` folder from this repository.

6. The extension should now appear in your toolbar with the “TC” icon.

## Usage

1. Navigate to your Skool community in a Chrome tab. Ensure you are logged in and viewing the page you want to collect content from.

2. Click the **Skool Testimonial Creator** icon in the toolbar. The popup offers three actions:

   - **Enable Testimonial Mode** – highlights posts and comments. Click a highlighted element to add its text to your collection.
   - **Enable Member Mode** – highlights member cards in the members area. Click a card to capture the descriptive text (names and avatars are ignored). This is useful for anonymised member spotlights.
   - **Disable** – turns off highlighting and removes the extension’s listeners from the page.

   You can also clear your current selection using **Clear Selected**, or jump directly into the editor with **Open Editor**.

3. After selecting the items you want to include, click **Open Editor**. A new tab will open with a 1400 × 790 canvas and several controls:

   - **Background** – choose a soft colour or white.
   - **Footer text** – optionally add a caption, call to action or URL. This appears near the bottom of the graphic.
   - **Logo** – upload a PNG, JPG or SVG file to be placed in the bottom‑right corner.
   - **Render preview** – draw your selections onto the canvas using the current options. Each testimonial or member description is labelled and wrapped automatically.
   - **Download PNG** – save the canvas as a PNG file.

4. Adjust the options as needed and click **Render preview** again until you’re happy. Finally, use **Download PNG** to save the graphic.

## Project Structure

- `manifest.json` – Chrome extension manifest (v3).
- `background.js` – Empty service worker, reserved for future enhancements.
- `content.js` – Injected into Skool pages. Highlights selectable elements, listens for clicks and stores selections.
- `content.css` – Provides the highlight and hover styles.
- `popup.html` / `popup.js` / `popup.css` – Defines the popup UI to toggle modes and open the editor.
- `editor.html` / `editor.js` / `editor.css` – The editor page loaded in a separate tab to arrange and export testimonials.
- `icons/` – Simple TC icons used by the extension at various sizes.

## Customising Selectors

The selectors used to find posts, comments and member cards are defined near the top of `content.js` in the `selectors` constant. If Skool updates its markup you can change these CSS selectors to target the correct elements. Multiple selectors are allowed and duplicate elements are automatically de‑duplicated.

## Limitations & Future Work

- This first version focuses on plain text extraction. Rich media (images, reactions, etc.) are not captured.
- The layout is vertical and deterministic. A future version could allow scattered or angled layouts and additional template presets.
- There is no persistence across browser sessions beyond the current selection stored in `chrome.storage.local`.

Pull requests and issues are welcome! If you encounter problems or have suggestions please open an issue on GitHub.