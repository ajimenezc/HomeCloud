import Cocoa

class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem!
    let port: String
    let uploadPath: String
    let pidFile: String
    let configDir: String
    let resourcesDir: String

    override init() {
        let home = FileManager.default.homeDirectoryForCurrentUser.path
        configDir = "\(home)/.homecloud"
        let configFile = "\(configDir)/config.env"

        // Create config dir
        try? FileManager.default.createDirectory(atPath: configDir, withIntermediateDirectories: true)

        // Load or create config
        var envPort = "3001"
        var envUploadPath = "\(home)/HomeCloud-Uploads"

        if let contents = try? String(contentsOfFile: configFile, encoding: .utf8) {
            for line in contents.components(separatedBy: .newlines) {
                let parts = line.split(separator: "=", maxSplits: 1)
                if parts.count == 2 {
                    let key = String(parts[0]).trimmingCharacters(in: .whitespaces)
                    let val = String(parts[1]).trimmingCharacters(in: .whitespaces)
                    if key == "PORT" { envPort = val }
                    if key == "UPLOAD_PATH" { envUploadPath = val }
                }
            }
        } else {
            let defaultConfig = "UPLOAD_PATH=\(home)/HomeCloud-Uploads\nPORT=3001\n"
            try? defaultConfig.write(toFile: configFile, atomically: true, encoding: .utf8)
        }

        port = envPort
        uploadPath = envUploadPath
        pidFile = "\(configDir)/server.pid"

        // Ensure upload dir exists
        try? FileManager.default.createDirectory(atPath: uploadPath, withIntermediateDirectories: true)

        // Resolve Resources dir from executable path
        let execPath = ProcessInfo.processInfo.arguments[0]
        let macosDir = (execPath as NSString).deletingLastPathComponent
        resourcesDir = (macosDir as NSString).appendingPathComponent("../Resources")

        super.init()
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Kill previous server instance
        killServer()

        // Start the Node server
        startServer()

        // Set up menu bar
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        if let button = statusItem.button {
            if #available(macOS 11.0, *),
               let img = NSImage(systemSymbolName: "cloud.fill", accessibilityDescription: "HomeCloud") {
                img.isTemplate = true
                button.image = img
            } else {
                button.title = "HC"
            }
        }

        let menu = NSMenu()

        let headerItem = NSMenuItem(title: "HomeCloud - puerto \(port)", action: nil, keyEquivalent: "")
        headerItem.isEnabled = false
        menu.addItem(headerItem)

        menu.addItem(NSMenuItem.separator())

        let openItem = NSMenuItem(title: "Abrir en navegador", action: #selector(openBrowser), keyEquivalent: "o")
        openItem.target = self
        menu.addItem(openItem)

        let restartItem = NSMenuItem(title: "Reiniciar servidor", action: #selector(restartServer), keyEquivalent: "r")
        restartItem.target = self
        menu.addItem(restartItem)

        menu.addItem(NSMenuItem.separator())

        let quitItem = NSMenuItem(title: "Salir de HomeCloud", action: #selector(quitApp), keyEquivalent: "q")
        quitItem.target = self
        menu.addItem(quitItem)

        statusItem.menu = menu

        // Open browser once server is ready
        DispatchQueue.global().async { [self] in
            for _ in 0..<30 {
                if let url = URL(string: "http://localhost:\(port)/"),
                   let _ = try? Data(contentsOf: url) {
                    DispatchQueue.main.async {
                        self.openBrowser()
                    }
                    return
                }
                Thread.sleep(forTimeInterval: 0.5)
            }
        }
    }

    func startServer() {
        let node = "\(resourcesDir)/node"
        let server = "\(resourcesDir)/server.cjs"

        let proc = Process()
        proc.executableURL = URL(fileURLWithPath: node)
        proc.arguments = [server]

        var env = ProcessInfo.processInfo.environment
        env["PORT"] = port
        env["HOST"] = "0.0.0.0"
        env["UPLOAD_PATH"] = uploadPath
        env["APP_DATA_PATH"] = configDir
        env["PID_FILE"] = pidFile
        proc.environment = env

        // Redirect output to log file
        let logPath = "\(configDir)/server.log"
        FileManager.default.createFile(atPath: logPath, contents: nil)
        let logHandle = FileHandle(forWritingAtPath: logPath)
        proc.standardOutput = logHandle
        proc.standardError = logHandle

        try? proc.run()

        let pid = proc.processIdentifier
        try? "\(pid)".write(toFile: pidFile, atomically: true, encoding: .utf8)
    }

    @objc func openBrowser() {
        if let url = URL(string: "http://localhost:\(port)") {
            NSWorkspace.shared.open(url)
        }
    }

    @objc func restartServer() {
        killServer()
        startServer()
    }

    @objc func quitApp() {
        killServer()
        NSApp.terminate(nil)
    }

    func killServer() {
        guard let pidStr = try? String(contentsOfFile: pidFile, encoding: .utf8)
            .trimmingCharacters(in: .whitespacesAndNewlines),
              let pid = Int32(pidStr) else { return }
        kill(pid, SIGTERM)
        try? FileManager.default.removeItem(atPath: pidFile)
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let delegate = AppDelegate()
app.delegate = delegate
app.run()
