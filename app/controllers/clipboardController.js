import fs from 'fs';
import path from 'path';

const clipboardFilePath = path.join(process.cwd(), 'clipboard.txt'); // File to store clipboard content

// Ensure the clipboard file exists
if (!fs.existsSync(clipboardFilePath)) {
    fs.writeFileSync(clipboardFilePath, '', 'utf8');
}

// Get clipboard content
export const getClipboardContent = (req, res) => {
    try {
        const content = fs.readFileSync(clipboardFilePath, 'utf8');
        res.status(200).json({ content });
    } catch (error) {
        console.error('Error reading clipboard content:', error);
        res.status(500).json({ error: 'Failed to get clipboard content' });
    }
};

// Set clipboard content
export const setClipboardContent = (req, res) => {
    const { content } = req.body;

    if (typeof content !== 'string') {
        return res.status(400).json({ error: 'Invalid content format' });
    }

    try {
        fs.writeFileSync(clipboardFilePath, content, 'utf8');
        res.status(200).json({ message: 'Clipboard updated successfully' });
    } catch (error) {
        console.error('Error updating clipboard content:', error);
        res.status(500).json({ error: 'Failed to update clipboard content' });
    }
};
