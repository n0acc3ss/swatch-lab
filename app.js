// 140 standard CSS/HTML color names
const HTML_COLORS = [
  "aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black",
  "blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse",
  "chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue",
  "darkcyan","darkgoldenrod","darkgray","darkgreen","darkkhaki","darkmagenta",
  "darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen",
  "darkslateblue","darkslategray","darkturquoise","darkviolet","deeppink",
  "deepskyblue","dimgray","dodgerblue","firebrick","floralwhite","forestgreen",
  "fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green",
  "greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki",
  "lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral",
  "lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightpink",
  "lightsalmon","lightseagreen","lightskyblue","lightslategray","lightsteelblue",
  "lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine",
  "mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue",
  "mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream",
  "mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab",
  "orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise",
  "palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue",
  "purple","rebeccapurple","red","rosybrown","royalblue","saddlebrown","salmon",
  "sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue",
  "slategray","snow","springgreen","steelblue","tan","teal","thistle",
  "tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"
];

// Helper element to resolve named color strings to exact RGB
const resolver = document.createElement("div");
resolver.style.display = "none";
document.body.appendChild(resolver);

function resolveToRgb(colorName) {
  resolver.style.color = colorName;
  const computed = window.getComputedStyle(resolver).color;
  // returns "rgb(r, g, b)"
  const match = computed.match(/\d+/g);
  if (match) {
    return {
      r: parseInt(match[0]),
      g: parseInt(match[1]),
      b: parseInt(match[2])
    };
  }
  return { r: 0, g: 0, b: 0 };
}

// Prepare dataset with hex, rgb, and programmatic HSL category
const swatchesData = HTML_COLORS.map(name => {
  const rgb = resolveToRgb(name);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Categorize based on HSL thresholds
  let category = "neutrals"; // Default category
  if (hsl.s < 12 || hsl.l > 92 || hsl.l < 8) {
    category = "neutrals"; // Grays, whites, blacks
  } else if ((hsl.h >= 0 && hsl.h < 35) || (hsl.h >= 325 && hsl.h <= 360)) {
    category = "reds"; // Reds, pinks, warm purples
  } else if (hsl.h >= 75 && hsl.h < 165) {
    category = "greens"; // Greens
  } else if (hsl.h >= 165 && hsl.h < 265) {
    category = "blues"; // Blues and teals
  } else {
    category = "neutrals"; // Yellows, oranges, browns
  }

  return { name, hex, rgb, hsl, category };
});

// App State
let activeColor = { r: 240, g: 60, b: 168 }; // Default #f03ca8 (neon pink)
let currentTab = "all";
let searchQuery = "";

// DOM Elements
const colorPicker = document.getElementById("color-picker");
const hexInput = document.getElementById("hex-input");
const rgbInput = document.getElementById("rgb-input");
const swatchesGrid = document.getElementById("swatches-grid");
const searchSwatches = document.getElementById("search-swatches");
const colorTabs = document.getElementById("color-tabs");
const toast = document.getElementById("toast");

const outputHex = document.getElementById("output-hex");
const outputRgb = document.getElementById("output-rgb");
const webSafeBadge = document.getElementById("web-safe-badge");
const btnSnapSafe = document.getElementById("btn-snap-safe");

const contrastRatioText = document.getElementById("contrast-ratio");
const wcagRating = document.getElementById("wcag-rating");
const previewActiveOnComp = document.getElementById("preview-active-on-comp");
const previewCompOnActive = document.getElementById("preview-comp-on-active");
const compHexValue = document.getElementById("comp-hex-value");

const lighterShadesContainer = document.getElementById("lighter-shades");
const darkerShadesContainer = document.getElementById("darker-shades");

const triadicBaseBlock = document.getElementById("triadic-base");
const triadicOneBlock = document.getElementById("triadic-one");
const triadicTwoBlock = document.getElementById("triadic-two");

const blobPrimary = document.getElementById("blob-primary");

// Color conversions
function rgbToHex(r, g, b) {
  const toHex = val => {
    const hex = val.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  if (hex.length !== 6) return null;
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// LERP Math
function lerp(start, end, amt) {
  return Math.round(start + (end - start) * amt);
}

// Relative Luminance for WCAG Contrast
function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Copy to Clipboard UI Helper
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    toast.textContent = `Copied: ${text}`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  });
}

// Update App View state
function updateUI() {
  const hex = rgbToHex(activeColor.r, activeColor.g, activeColor.b);
  const rgbStr = `rgb(${activeColor.r}, ${activeColor.g}, ${activeColor.b})`;
  
  // Sync Picker & inputs
  colorPicker.value = hex;
  hexInput.value = hex;
  rgbInput.value = `${activeColor.r}, ${activeColor.g}, ${activeColor.b}`;

  // Sync output panels
  outputHex.textContent = hex;
  outputRgb.textContent = rgbStr;

  // Set current color theme accent variables on document
  document.documentElement.style.setProperty('--pink', hex);
  document.documentElement.style.setProperty('--glow', `rgba(${activeColor.r}, ${activeColor.g}, ${activeColor.b}, 0.55)`);
  document.documentElement.style.setProperty('--glow2', `rgba(${activeColor.r}, ${activeColor.g}, ${activeColor.b}, 0.15)`);

  // Web-Safe verification
  const isWebSafe = (activeColor.r % 51 === 0) && (activeColor.g % 51 === 0) && (activeColor.b % 51 === 0);
  if (isWebSafe) {
    webSafeBadge.textContent = "Web Safe";
    webSafeBadge.className = "pill-badge safe";
  } else {
    webSafeBadge.textContent = "Not Web Safe";
    webSafeBadge.className = "pill-badge not-safe";
  }

  // Complementary color math
  const compColor = {
    r: 255 - activeColor.r,
    g: 255 - activeColor.g,
    b: 255 - activeColor.b
  };
  const compHex = rgbToHex(compColor.r, compColor.g, compColor.b);
  const compRgbStr = `rgb(${compColor.r}, ${compColor.g}, ${compColor.b})`;
  compHexValue.textContent = compHex;

  // Set contrast preview boxes
  previewActiveOnComp.style.backgroundColor = compHex;
  previewActiveOnComp.style.color = hex;
  previewCompOnActive.style.backgroundColor = hex;
  previewCompOnActive.style.color = compHex;

  // Calculate contrast ratio
  const ratio = getContrastRatio(activeColor, compColor);
  contrastRatioText.textContent = `Contrast Ratio: ${ratio.toFixed(2)}:1`;
  
  if (ratio >= 7.0) {
    wcagRating.textContent = "AAA PASS";
    wcagRating.style.borderColor = "var(--green)";
    wcagRating.style.color = "var(--green)";
  } else if (ratio >= 4.5) {
    wcagRating.textContent = "AA PASS";
    wcagRating.style.borderColor = "var(--teal)";
    wcagRating.style.color = "var(--teal)";
  } else if (ratio >= 3.0) {
    wcagRating.textContent = "AA LARGE PASS";
    wcagRating.style.borderColor = "var(--ov0)";
    wcagRating.style.color = "var(--ov0)";
  } else {
    wcagRating.textContent = "FAIL";
    wcagRating.style.borderColor = "var(--pink)";
    wcagRating.style.color = "var(--pink)";
  }

  // Shade generations (LERP)
  lighterShadesContainer.innerHTML = "";
  darkerShadesContainer.innerHTML = "";
  
  const steps = [0.2, 0.4, 0.6, 0.8, 1.0];
  
  steps.forEach(amt => {
    // Light shades: Interpolate from activeColor to white (255, 255, 255)
    const lr = lerp(activeColor.r, 255, amt);
    const lg = lerp(activeColor.g, 255, amt);
    const lb = lerp(activeColor.b, 255, amt);
    const lHex = rgbToHex(lr, lg, lb);
    
    const lBlock = document.createElement("div");
    lBlock.className = "shade-block";
    lBlock.style.backgroundColor = lHex;
    lBlock.innerHTML = `<span class="shade-val">${lHex}</span>`;
    lBlock.addEventListener("click", () => selectColor(lr, lg, lb));
    lighterShadesContainer.appendChild(lBlock);

    // Dark shades: Interpolate from activeColor to black (0, 0, 0)
    const dr = lerp(activeColor.r, 0, amt);
    const dg = lerp(activeColor.g, 0, amt);
    const db = lerp(activeColor.b, 0, amt);
    const dHex = rgbToHex(dr, dg, db);
    
    const dBlock = document.createElement("div");
    dBlock.className = "shade-block";
    dBlock.style.backgroundColor = dHex;
    dBlock.innerHTML = `<span class="shade-val">${dHex}</span>`;
    dBlock.addEventListener("click", () => selectColor(dr, dg, db));
    darkerShadesContainer.appendChild(dBlock);
  });

  // Triadic colors (HSL +120, +240)
  const activeHsl = rgbToHsl(activeColor.r, activeColor.g, activeColor.b);
  
  const tri1Hsl = { h: (activeHsl.h + 120) % 360, s: activeHsl.s, l: activeHsl.l };
  const tri2Hsl = { h: (activeHsl.h + 240) % 360, s: activeHsl.s, l: activeHsl.l };

  const tri1Rgb = hslToRgb(tri1Hsl.h, tri1Hsl.s, tri1Hsl.l);
  const tri2Rgb = hslToRgb(tri2Hsl.h, tri2Hsl.s, tri2Hsl.l);

  const tri1Hex = rgbToHex(tri1Rgb.r, tri1Rgb.g, tri1Rgb.b);
  const tri2Hex = rgbToHex(tri2Rgb.r, tri2Rgb.g, tri2Rgb.b);

  // Render triadic harmonizers
  updateTriadicBlock(triadicBaseBlock, hex, "Base");
  updateTriadicBlock(triadicOneBlock, tri1Hex, "Triadic 1 (+120°)");
  updateTriadicBlock(triadicTwoBlock, tri2Hex, "Triadic 2 (+240°)");
}

function updateTriadicBlock(element, hex, label) {
  const block = element.querySelector(".triadic-color-block");
  block.style.backgroundColor = hex;
  element.querySelector(".triadic-val").textContent = hex;
}

function selectColor(r, g, b) {
  activeColor = { r, g, b };
  updateUI();
}

// Snap to web-safe color conversion
btnSnapSafe.addEventListener("click", () => {
  const snap = val => Math.round(val / 51) * 51;
  activeColor.r = snap(activeColor.r);
  activeColor.g = snap(activeColor.g);
  activeColor.b = snap(activeColor.b);
  updateUI();
});

// Render the catalog of Named Swatches
function renderSwatches() {
  swatchesGrid.innerHTML = "";
  
  const filtered = swatchesData.filter(item => {
    // Filter by tab category
    if (currentTab !== "all" && item.category !== currentTab) return false;
    // Filter by search text
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  filtered.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "swatch-item";
    itemEl.title = `${item.name} (${item.hex})`;
    
    const preview = document.createElement("div");
    preview.className = "swatch-preview";
    preview.style.backgroundColor = item.hex;
    
    const label = document.createElement("span");
    label.className = "swatch-name";
    label.textContent = item.name;

    itemEl.appendChild(preview);
    itemEl.appendChild(label);
    itemEl.addEventListener("click", () => selectColor(item.rgb.r, item.rgb.g, item.rgb.b));

    swatchesGrid.appendChild(itemEl);
  });
}

// Setup Interaction Listeners
colorPicker.addEventListener("input", (e) => {
  const rgb = hexToRgb(e.target.value);
  if (rgb) {
    activeColor = rgb;
    updateUI();
  }
});

hexInput.addEventListener("change", (e) => {
  const rgb = hexToRgb(e.target.value);
  if (rgb) {
    activeColor = rgb;
    updateUI();
  }
});

rgbInput.addEventListener("change", (e) => {
  const parts = e.target.value.split(",").map(p => parseInt(p.trim()));
  if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
    activeColor = { r: parts[0], g: parts[1], b: parts[2] };
    updateUI();
  }
});

searchSwatches.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderSwatches();
});

// Setup click-to-copy code events
document.querySelectorAll(".value-box").forEach(box => {
  box.addEventListener("click", () => {
    const type = box.getAttribute("data-copy");
    if (type === "hex") {
      copyText(rgbToHex(activeColor.r, activeColor.g, activeColor.b));
    } else {
      copyText(`rgb(${activeColor.r}, ${activeColor.g}, ${activeColor.b})`);
    }
  });
});

compHexValue.addEventListener("click", () => {
  copyText(compHexValue.textContent);
});

[triadicBaseBlock, triadicOneBlock, triadicTwoBlock].forEach(block => {
  block.addEventListener("click", () => {
    const val = block.querySelector(".triadic-val").textContent;
    copyText(val);
  });
});

// Setup tabs listener
colorTabs.addEventListener("click", (e) => {
  if (e.target.classList.contains("at")) {
    document.querySelectorAll("#color-tabs .at").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentTab = e.target.getAttribute("data-tab");
    renderSwatches();
  }
});

// Setup pink lover presets
document.querySelectorAll(".pink-preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const hexVal = btn.getAttribute("data-color");
    const rgb = hexToRgb(hexVal);
    if (rgb) {
      selectColor(rgb.r, rgb.g, rgb.b);
    }
  });
});

// Pinkify active color modifier
document.getElementById("btn-pinkify").addEventListener("click", () => {
  const hsl = rgbToHsl(activeColor.r, activeColor.g, activeColor.b);
  
  // Shift hue to pink (330 degrees)
  // Shift saturation high (minimum 85%)
  // Shift lightness to ideal balance (between 50% and 65%)
  const pinkHsl = {
    h: 330,
    s: Math.max(hsl.s, 85),
    l: Math.max(Math.min(hsl.l, 65), 50)
  };
  
  const rgb = hslToRgb(pinkHsl.h, pinkHsl.s, pinkHsl.l);
  selectColor(rgb.r, rgb.g, rgb.b);
});

// Init
updateUI();
renderSwatches();
