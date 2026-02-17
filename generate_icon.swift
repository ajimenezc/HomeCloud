import Cocoa

let sizes = [16, 32, 64, 128, 256, 512, 1024]
let iconsetPath = "/tmp/HomeCloud.iconset"

try? FileManager.default.removeItem(atPath: iconsetPath)
try! FileManager.default.createDirectory(atPath: iconsetPath, withIntermediateDirectories: true)

for size in sizes {
    let s = CGFloat(size)
    let rep = NSBitmapImageRep(
        bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!

    NSGraphicsContext.saveGraphicsState()
    let ctx = NSGraphicsContext(bitmapImageRep: rep)!
    NSGraphicsContext.current = ctx
    let g = ctx.cgContext

    // Background: rounded rect with gradient
    let inset = s * 0.02
    let rect = CGRect(x: inset, y: inset, width: s - inset * 2, height: s - inset * 2)
    let corner = s * 0.22
    let path = CGPath(roundedRect: rect, cornerWidth: corner, cornerHeight: corner, transform: nil)
    g.addPath(path)
    g.clip()

    // Blue gradient
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let gradient = CGGradient(colorsSpace: colorSpace,
        colors: [
            CGColor(red: 0.20, green: 0.60, blue: 1.0, alpha: 1.0),
            CGColor(red: 0.10, green: 0.40, blue: 0.90, alpha: 1.0)
        ] as CFArray,
        locations: [0.0, 1.0])!
    g.drawLinearGradient(gradient, start: CGPoint(x: 0, y: s), end: CGPoint(x: 0, y: 0), options: [])

    // Draw white cloud using SF Symbol
    if #available(macOS 12.0, *),
       let cloudImage = NSImage(systemSymbolName: "cloud.fill", accessibilityDescription: nil) {
        let config = NSImage.SymbolConfiguration(pointSize: s * 0.45, weight: .bold)
        let configured = cloudImage.withSymbolConfiguration(config)!

        // Create a white-tinted version
        let tinted = NSImage(size: configured.size, flipped: false) { drawRect in
            configured.draw(in: drawRect)
            NSColor.white.set()
            drawRect.fill(using: .sourceAtop)
            return true
        }

        let imgSize = tinted.size
        let x = (s - imgSize.width) / 2
        let y = (s - imgSize.height) / 2
        tinted.draw(in: NSRect(x: x, y: y, width: imgSize.width, height: imgSize.height),
                    from: .zero, operation: .sourceOver, fraction: 1.0)
    }

    NSGraphicsContext.restoreGraphicsState()

    let pngData = rep.representation(using: .png, properties: [:])!

    if size <= 512 {
        try! pngData.write(to: URL(fileURLWithPath: "\(iconsetPath)/icon_\(size)x\(size).png"))
    }
    if size >= 32 {
        let half = size / 2
        try! pngData.write(to: URL(fileURLWithPath: "\(iconsetPath)/icon_\(half)x\(half)@2x.png"))
    }
}

print("Iconset generated at \(iconsetPath)")
