import React from 'react';
import { AppProvider } from './AppContext';
import CommandPalette from './components/CommandPalette';
import CommandBlockArea from './components/CommandBlockArea';
import Canvas from './components/Canvas';

const App = () => {
    return(
        <AppProvider>
            <div className="app-container">
                <header>
                    <button>
                        button
                    </button>
                </header>
                <div className="main-content">
                    <CommandPalette />
                    <CommandBlockArea />
                    <Canvas />
                </div>
            </div>
        </AppProvider>
    );
}

export default App;
