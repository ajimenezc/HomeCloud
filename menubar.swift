import Cocoa

class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem!
    var port: String
    var uploadPath: String
    let pidFile: String
    let configDir: String
    let configFile: String
    let resourcesDir: String
    var headerItem: NSMenuItem!

    override init() {
        let home = FileManager.default.homeDirectoryForCurrentUser.path
        configDir = "\(home)/.homecloud"
        configFile = "\(configDir)/config.env"

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

        headerItem = NSMenuItem(title: "HomeCloud - puerto \(port)", action: nil, keyEquivalent: "")
        headerItem.isEnabled = false
        menu.addItem(headerItem)

        menu.addItem(NSMenuItem.separator())

        let openItem = NSMenuItem(title: "Abrir en navegador", action: #selector(openBrowser), keyEquivalent: "o")
        openItem.target = self
        menu.addItem(openItem)

        menu.addItem(NSMenuItem.separator())

        let changePortItem = NSMenuItem(title: "Cambiar puerto...", action: #selector(changePort), keyEquivalent: "")
        changePortItem.target = self
        menu.addItem(changePortItem)

        let changeFolderItem = NSMenuItem(title: "Cambiar carpeta de uploads...", action: #selector(changeUploadFolder), keyEquivalent: "")
        changeFolderItem.target = self
        menu.addItem(changeFolderItem)

        menu.addItem(NSMenuItem.separator())

        let restartItem = NSMenuItem(title: "Reiniciar servidor", action: #selector(restartServer), keyEquivalent: "r")
        restartItem.target = self
        menu.addItem(restartItem)

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

    func saveConfig() {
        let config = "UPLOAD_PATH=\(uploadPath)\nPORT=\(port)\n"
        try? config.write(toFile: configFile, atomically: true, encoding: .utf8)
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

    @objc func changePort() {
        let alert = NSAlert()
        alert.messageText = "Cambiar puerto"
        alert.informativeText = "Introduce el nuevo puerto para el servidor:"
        alert.addButton(withTitle: "Guardar")
        alert.addButton(withTitle: "Cancelar")

        let input = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        input.stringValue = port
        alert.accessoryView = input

        NSApp.activate(ignoringOtherApps: true)
        let response = alert.runModal()
        if response == .alertFirstButtonReturn {
            let newPort = input.stringValue.trimmingCharacters(in: .whitespaces)
            if !newPort.isEmpty && newPort != port {
                port = newPort
                saveConfig()
                headerItem.title = "HomeCloud - puerto \(port)"
                restartServer()
            }
        }
    }

    @objc func changeUploadFolder() {
        let panel = NSOpenPanel()
        panel.title = "Seleccionar carpeta de uploads"
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.canCreateDirectories = true
        panel.directoryURL = URL(fileURLWithPath: uploadPath)

        NSApp.activate(ignoringOtherApps: true)
        let response = panel.runModal()
        if response == .OK, let url = panel.url {
            let newPath = url.path
            if newPath != uploadPath {
                uploadPath = newPath
                saveConfig()
                restartServer()
            }
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
