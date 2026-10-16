# ParkCore Banner — generation prompt

Save the generated image as **`public/banner.png`** (1600×400 recommended),
commit + push — the README header and social preview pick it up automatically.

## Prompt (copy-paste into Midjourney / DALL-E / Flux / Ideogram)

```
Dark futuristic tech banner for "ParkCore" — a smart parking management system
running on ARM Cortex-M3 microcontrollers. Wide 1600x400 hero image. Deep
midnight-blue background (#0a0a1a) with subtle circuit-board traces and a
glowing cyan (#06b6d4) gradient sweeping left to right.

Center: a stylized isometric parking grid — 32 slots arranged in neat rows,
with tiny glowing cars in some slots (occupied = solid cyan fill, empty =
faint outline). A soft holographic "P" parking sign hovers above the grid,
semi-transparent, emitting a gentle cyan glow.

Right side: floating translucent debug-panel fragments — monospace register
names (g_system, dbg_flags, STATE_WAIT_INPUT) and tiny bar charts, slightly
blurred as if viewed through glass. Subtle hex-grid overlay, thin golden
accent line at the bottom edge.

Style: clean, minimal, high-tech engineering aesthetic — like a Keil uVision
debugger UI crossed with a Tesla dashboard. No text except the "P" symbol.
Sharp details, soft glows, professional dark theme. Flat vector + subtle
volumetric light.
```

- **Midjourney:** append `--ar 4:1`
- **DALL-E 3:** paste as-is
- **Flux / Ideogram:** good at glow + text-free output

## Variants

- **Minimal:** `single glowing P inside a rounded square, thin cyan circuit
  lines radiating outward, pure dark background`
- **Chip-focus:** `macro shot of an LPC1768 ARM chip, parking grid etched
  into the silicon, cyan traces lighting up`
