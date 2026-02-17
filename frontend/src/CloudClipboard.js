import React, { useState, useEffect } from 'react';
import { API_BASE } from './config.js';

const CloudClipboard = () => {
    const [clipboardContent, setClipboardContent] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    // Fetch the clipboard content on component mount
    useEffect(() => {
        fetchClipboardContent();
    }, []);

    const fetchClipboardContent = async () => {
        try {
            const response = await fetch(`${API_BASE}/clipboard/get`);
            if (!response.ok) {
                throw new Error('Failed to fetch clipboard content');
            }
            const result = await response.json();
            setClipboardContent(result.content || '');
        } catch (error) {
            console.error(error);
            setStatusMessage('Error fetching clipboard content');
        }
    };

    const updateClipboardContent = async () => {
        try {
            const response = await fetch(`${API_BASE}/clipboard/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: clipboardContent }),
            });
            if (!response.ok) {
                throw new Error('Failed to update clipboard content');
            }
            setStatusMessage('Clipboard updated successfully!');
            setTimeout(() => setStatusMessage(''), 2000);
        } catch (error) {
            console.error(error);
            setStatusMessage('Error updating clipboard content');
        }
    };

    const handleInputChange = (e) => {
        setClipboardContent(e.target.value);
    };

    const handleCopyToSystemClipboard = () => {
        navigator.clipboard.writeText(clipboardContent)
            .then(() => setStatusMessage('Copied to system clipboard!'))
            .catch(() => setStatusMessage('Failed to copy to system clipboard'));
    };

    const handleDeleteAndPaste = async () => {
        try {
            const systemClipboardContent = await navigator.clipboard.readText();
            setClipboardContent(systemClipboardContent);
            setStatusMessage('Pasted from system clipboard and cleared!');
        } catch (error) {
            console.error('Failed to read from system clipboard:', error);
            setStatusMessage('Error reading from system clipboard');
        }
    };

    const handleRefresh = () => {
        fetchClipboardContent();
    };

    return (
        <div className="cloudClipboard">
            <h2>Cloud Clipboard</h2>
            <textarea
                value={clipboardContent}
                onChange={handleInputChange}
                placeholder="Type or paste text here..."
                rows="6"
                cols="50"
            ></textarea>
            <div className="buttonGroup">
                <button onClick={updateClipboardContent}>Update Clipboard</button>
                <button onClick={handleRefresh}>Refresh</button>
                <button onClick={handleCopyToSystemClipboard}>Copy</button>
                <button onClick={handleDeleteAndPaste}>Delete & Paste</button>
            </div>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default CloudClipboard;
