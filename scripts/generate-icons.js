/**
 * Generate ManwhaWham icon files (SVG + PNG + ICO)
 * Uses a comic-book speech bubble / page-flip motif with a vibrant gradient
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const publicDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// ManwhaWham SVG icon — manga/comic page motif with accent color
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="mw-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="100%" stop-color="#fb923c"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="url(#mw-bg)"/>
  <g transform="translate(128,128)" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- Back page -->
    <rect x="-38" y="-50" width="60" height="80" rx="4" fill="white" fill-opacity="0.35" stroke="none"/>
    <!-- Front page -->
    <rect x="-30" y="-56" width="60" height="80" rx="4" fill="white" fill-opacity="0.9" stroke="none"/>
    <!-- Page lines (manga panels) -->
    <line x1="-20" y1="-40" x2="20" y2="-40" stroke="white" stroke-opacity="0.0"/>
    <!-- Panel grid on front page -->
    <rect x="-24" y="-50" width="48" height="34" rx="2" stroke="rgba(0,0,0,0.25)" stroke-width="3" fill="none"/>
    <rect x="-24" y="-12" width="22" height="30" rx="2" stroke="rgba(0,0,0,0.25)" stroke-width="3" fill="none"/>
    <rect x="2" y="-12" width="22" height="30" rx="2" stroke="rgba(0,0,0,0.25)" stroke-width="3" fill="none"/>
    <!-- Lightning/action burst -->
    <path d="M 30 -10 L 50 -30 L 42 -8 L 58 -12 L 34 20 L 40 0 Z" fill="white" stroke="none" opacity="0.95"/>
    <!-- "WHAM" text hint -->
    <text x="-2" y="56" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="26" fill="white" stroke="none" letter-spacing="2">WHAM</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, "icon.svg"), svgIcon);
console.log("✓ icon.svg created");

// Generate PNG files from SVG using built-in canvas if available, otherwise
// we create a simpler BMP-based ICO manually.

// For the ICO, we'll create a minimal ICO with an embedded 256×256 PNG.
// We'll use a simple approach: write the SVG, then create ICO from raw pixel data.

// Since we cannot easily rasterize SVG in pure Node without dependencies,
// we'll create the ICO using PowerShell/.NET

const psScript = `
Add-Type -AssemblyName System.Drawing

# Create a 256x256 bitmap with manga-style icon
$sizes = @(256, 128, 64, 48, 32, 16)
$publicDir = "${publicDir.replace(/\\/g, "\\\\")}"

function Draw-ManwhaWhamIcon([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background gradient (rose to orange)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(244, 63, 94), [System.Drawing.Color]::FromArgb(251, 146, 60), [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    
    # Rounded rect background
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $r = [int]($size * 0.19)
    $path.AddArc(0, 0, $r*2, $r*2, 180, 90)
    $path.AddArc($size - $r*2, 0, $r*2, $r*2, 270, 90)
    $path.AddArc($size - $r*2, $size - $r*2, $r*2, $r*2, 0, 90)
    $path.AddArc(0, $size - $r*2, $r*2, $r*2, 90, 90)
    $path.CloseFigure()
    $g.FillPath($brush, $path)

    $s = $size / 256.0

    # Back page shadow
    $pageBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 255, 255, 255))
    $g.FillRectangle($pageBrush, [int](90*$s), [int](78*$s), [int](60*$s), [int](80*$s))

    # Front page
    $frontBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 255, 255, 255))
    $g.FillRectangle($frontBrush, [int](98*$s), [int](72*$s), [int](60*$s), [int](80*$s))

    # Panel lines
    $panelPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(65, 0, 0, 0), [math]::Max(1, [int](3*$s)))
    $g.DrawRectangle($panelPen, [int](104*$s), [int](78*$s), [int](48*$s), [int](34*$s))
    $g.DrawRectangle($panelPen, [int](104*$s), [int](116*$s), [int](22*$s), [int](30*$s))
    $g.DrawRectangle($panelPen, [int](130*$s), [int](116*$s), [int](22*$s), [int](30*$s))

    # Lightning bolt
    $boltBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
    $boltPoints = @(
        [System.Drawing.PointF]::new(158*$s, 118*$s),
        [System.Drawing.PointF]::new(178*$s, 98*$s),
        [System.Drawing.PointF]::new(170*$s, 120*$s),
        [System.Drawing.PointF]::new(186*$s, 116*$s),
        [System.Drawing.PointF]::new(162*$s, 148*$s),
        [System.Drawing.PointF]::new(168*$s, 128*$s)
    )
    $g.FillPolygon($boltBrush, $boltPoints)

    # WHAM text
    if ($size -ge 48) {
        $fontSize = [math]::Max(6, [int](26*$s))
        $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
        $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $g.DrawString("WHAM", $font, $textBrush, [float]($size/2), [float](180*$s), $sf)
        $font.Dispose()
    }

    $g.Dispose()
    $brush.Dispose()
    return $bmp
}

# Generate PNGs for each size
foreach ($sz in $sizes) {
    $bmp = Draw-ManwhaWhamIcon $sz
    $bmp.Save("$publicDir\\icon-$sz.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created icon-$sz.png"
}

# Also save icon.png as 256
$bmp256 = Draw-ManwhaWhamIcon 256
$bmp256.Save("$publicDir\\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp256.Dispose()

# Create ICO file with multiple sizes
function Create-ICO([string]$outPath, [int[]]$icoSizes) {
    $ms = New-Object System.IO.MemoryStream

    # Collect PNG data for each size
    \$pngDataList = @()
    foreach ($sz in $icoSizes) {
        $bmp = Draw-ManwhaWhamIcon $sz
        $pngMs = New-Object System.IO.MemoryStream
        $bmp.Save($pngMs, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngDataList += ,($pngMs.ToArray())
        $pngMs.Dispose()
        $bmp.Dispose()
    }

    $bw = New-Object System.IO.BinaryWriter($ms)
    
    # ICO Header
    $bw.Write([uint16]0)          # Reserved
    $bw.Write([uint16]1)          # Type: 1 = ICO
    $bw.Write([uint16]$icoSizes.Count)  # Number of images

    # Calculate offset (header=6, each entry=16)
    $offset = 6 + 16 * $icoSizes.Count

    # Write directory entries
    for ($i = 0; $i -lt $icoSizes.Count; $i++) {
        $sz = $icoSizes[$i]
        $data = $pngDataList[$i]
        $bw.Write([byte]$(if ($sz -ge 256) { 0 } else { $sz }))  # Width
        $bw.Write([byte]$(if ($sz -ge 256) { 0 } else { $sz }))  # Height
        $bw.Write([byte]0)         # Color palette
        $bw.Write([byte]0)         # Reserved
        $bw.Write([uint16]1)       # Color planes
        $bw.Write([uint16]32)      # Bits per pixel
        $bw.Write([uint32]$data.Length)  # Size of image data
        $bw.Write([uint32]$offset)      # Offset
        $offset += $data.Length
    }

    # Write image data
    for ($i = 0; $i -lt $icoSizes.Count; $i++) {
        $bw.Write($pngDataList[$i])
    }

    $bw.Flush()
    [System.IO.File]::WriteAllBytes($outPath, $ms.ToArray())
    $bw.Dispose()
    $ms.Dispose()
}

Create-ICO "$publicDir\\icon.ico" @(256, 128, 64, 48, 32, 16)
Write-Host "Created icon.ico"
Write-Host "All icons generated successfully!"
`;

fs.writeFileSync(path.join(__dirname, "gen-ico.ps1"), psScript);

try {
  execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${path.join(__dirname, "gen-ico.ps1")}"`, {
    stdio: "inherit",
    timeout: 30000,
  });
} catch (err) {
  console.error("PowerShell icon generation failed:", err.message);
}

// Cleanup
try { fs.unlinkSync(path.join(__dirname, "gen-ico.ps1")); } catch {}
