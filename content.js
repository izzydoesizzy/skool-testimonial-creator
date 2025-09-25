// content.js
// This script runs in the context of Skool pages. It highlights
// selectable elements (posts/comments/members) based on the mode
// sent from the popup and stores selected items into chrome.storage.local.

(function () {
  let mode = null;
  /**
   * Keep a local copy of selected items. Each item has a type and the
   * text content of the element. When clicking on an element the
   * contents are pushed into this array and persisted via the storage API.
   */
  let selectedItems = [];

  // Predefined selectors for different modes. These selectors are guesses
  // based on common HTML structures in community platforms. If Skool
  // changes their markup you can adjust these selectors here without
  // touching any other code.
  const selectors = {
    testimonial: [
      'div.post',
      'div.comment',
      'div[data-testid="post"]',
      'div[data-testid="comment"]',
      'article'
    ],
    member: [
      'div.member',
      'div[data-testid="member"]',
      'div[data-test-id="member"]',
      'li.member',
      'div[class*="member"]'
    ]
  };

  /**
   * Apply highlighting behaviour to eligible elements for the current mode.
   */
  function highlightElements() {
    removeListenersAndHighlights();
    if (!mode || !selectors[mode]) {
      return;
    }
    const uniqueElements = new Set();
    selectors[mode].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!uniqueElements.has(el)) {
          uniqueElements.add(el);
          el.classList.add('stc-highlight');
          el.addEventListener('mouseenter', handleMouseEnter);
          el.addEventListener('mouseleave', handleMouseLeave);
          el.addEventListener('click', handleClick);
        }
      });
    });
  }

  /**
   * Remove all highlight classes and event listeners from elements that were
   * previously decorated by this script.
   */
  function removeListenersAndHighlights() {
    document.querySelectorAll('.stc-highlight').forEach(el => {
      el.classList.remove('stc-highlight');
      el.classList.remove('stc-hover');
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('click', handleClick);
    });
  }

  /**
   * On mouse enter, subtly change the background to give the user feedback.
   */
  function handleMouseEnter(event) {
    event.currentTarget.classList.add('stc-hover');
  }

  /**
   * On mouse leave, remove the hover state.
   */
  function handleMouseLeave(event) {
    event.currentTarget.classList.remove('stc-hover');
  }

  /**
   * When the user clicks on a highlighted element we extract the visible
   * text and store it. We stop propagation so Skool does not handle
   * the click (e.g. navigating away).
   */
  function handleClick(event) {
    // Prevent the platform from performing its default click action.
    event.preventDefault();
    event.stopPropagation();
    const el = event.currentTarget;
    const textContent = (el.innerText || '').trim();
    if (!textContent) return;
    // Compose the data object. For members we blur names or picture by
    // simply omitting them – we capture only the descriptive text.
    const data = {
      type: mode,
      text: textContent
    };
    selectedItems.push(data);
    chrome.storage.local.set({ selectedItems });
    // Provide lightweight feedback via console log.
    console.info(`[Skool Testimonial Creator] added ${mode} entry`, data);
  }

  /**
   * Listen for messages from the popup. The popup drives the mode
   * selection and resets via these messages.
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'setMode') {
      mode = message.mode;
      highlightElements();
    } else if (message.type === 'clearSelected') {
      selectedItems = [];
      chrome.storage.local.set({ selectedItems });
    }
  });

  // On initial load, hydrate selectedItems so that the editor page can
  // pick them up even after reloads.
  chrome.storage.local.get('selectedItems', data => {
    selectedItems = data.selectedItems || [];
  });
})();