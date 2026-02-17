import { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import CloudClipboard from './CloudClipboard';

function MenuHint() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem('menuHintDismissed');
        if (!dismissed) setVisible(true);
    }, []);

    if (!visible) return null;

    return (
        <div className="menuHint" onClick={() => { setVisible(false); sessionStorage.setItem('menuHintDismissed', '1'); }}>
            <span className="menuHintArrow">↑</span>
            <span>Manage the options in the menu</span>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <MenuHint />
            <FileUpload />
            <CloudClipboard />
        </div>
    );
}

export default App;
