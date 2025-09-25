// editor.js
// Provides functionality for rendering the collected testimonials or
// member highlights onto a fixed‑size canvas and downloading the
// result as an image. The editor can be extended to support more
// complex layouts, but the initial version keeps things simple and
// predictable.

const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');

let items = [];

// Load selected items from storage. This ensures that refreshing
// the editor page will not lose the current selection.
chrome.storage.local.get('selectedItems', (data) => {
  items = data.selectedItems || [];
  render();
});

document.getElementById('renderBtn').addEventListener('click', () => {
  render();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  downloadImage();
});

/**
 * Render the graphic based on the current items and user options.
 */
async function render() {
  // Retrieve options
  const bgColour = document.getElementById('bgColor').value || '#ffffff';
  const footerText = document.getElementById('customText').value || '';
  const logoImage = await loadLogo();

  // Fill background
  ctx.fillStyle = bgColour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Determine spacing for items
  const maxItems = Math.min(items.length, 10);
  const margin = 30;
  const availableHeight = canvas.height - margin * 2 - (footerText ? 40 : 0);
  const lineHeight = 22; // height per line of text
  // Calculate space per item (minimum lines = 2)
  const itemHeight = maxItems > 0 ? availableHeight / maxItems : 0;

  ctx.fillStyle = '#333333';
  ctx.textBaseline = 'top';

  items.slice(0, 10).forEach((item, index) => {
    const yStart = margin + index * itemHeight;
    // Use a slightly larger font for headings
    ctx.font = 'bold 18px Arial';
    // If item type is member, prefix with a heading
    if (item.type === 'member') {
      ctx.fillText('Member Highlight', margin, yStart);
    } else {
      ctx.fillText('Testimonial', margin, yStart);
    }
    // Draw the text body below the heading
    ctx.font = '16px Arial';
    const textY = yStart + 20;
    wrapAndDrawText(ctx, item.text, margin, textY, canvas.width - margin * 2, lineHeight);
  });

  // Draw footer text if present
  if (footerText) {
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(footerText, margin, canvas.height - 40);
    ctx.textAlign = 'start';
  }

  // Draw logo in bottom right if provided
  if (logoImage) {
    const maxLogoHeight = 60;
    const ratio = logoImage.width / logoImage.height;
    const logoHeight = maxLogoHeight;
    const logoWidth = maxLogoHeight * ratio;
    ctx.drawImage(
      logoImage,
      canvas.width - logoWidth - margin,
      canvas.height - logoHeight - margin,
      logoWidth,
      logoHeight
    );
  }
}

/**
 * Draws wrapped text onto a canvas context.
 * @param {CanvasRenderingContext2D} context
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} maxWidth
 * @param {number} lineHeight
 */
function wrapAndDrawText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;
  words.forEach((word) => {
    const testLine = line + word + ' ';
    const { width } = context.measureText(testLine);
    if (width > maxWidth && line) {
      context.fillText(line.trim(), x, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });
  if (line) {
    context.fillText(line.trim(), x, currentY);
  }
}

/**
 * Downloads the current canvas as a PNG image.
 */
function downloadImage() {
  const link = document.createElement('a');
  link.download = 'skool-testimonials.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Reads the uploaded logo file into an Image element. Returns null if
 * no file has been selected.
 * @returns {Promise<Image|null>}
 */
function loadLogo() {
  const input = document.getElementById('logoInput');
  return new Promise((resolve) => {
    if (!input.files || !input.files[0]) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  });
}