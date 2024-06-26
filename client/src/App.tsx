import React, { useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import CommandPalette from './components/CommandPalette';
import CodeArea from './components/CodeArea';

interface Command {
  name: string;
  value?: number | string;
}

const App: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCommands([]); // Reset commands if needed
  };

  const toggleDrawing = () => {
    setIsDrawing(prev => !prev);
  };

  const handleTutorialClick = async (tutorial: string) => {
    const response = await fetch('http://localhost:8080/api/open/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: tutorial }),
    });

    if (response.ok) {
      console.log(`${tutorial} tutorial opened`);
    } else {
      console.error('Failed to open tutorial');
    }
  };

  return (
    <>
      <div className="header">
        <button>Load</button>
        <button>Save</button>
        <div className="tutorials-dropdown">
          <button>Tutorials</button>
          <div className="tutorials-dropdown-content">
            <button onClick={() => handleTutorialClick('drawing_tutorial')}>Drawing Tutorial</button>
            <button onClick={() => handleTutorialClick('turn_tutorial')}>Turn Tutorial</button>
            <button onClick={() => handleTutorialClick('repeat_tutorial')}>Repeat Tutorial</button>
          </div>
        </div>
      </div>
      <div className="app-container">
        <div className="canvas-container">
          <Canvas 
            commands={commands} 
            isDrawing={isDrawing} 
            toggleDrawing={toggleDrawing} 
            isPlaying={isPlaying} 
            isPaused={isPaused} 
            handlePlay={handlePlay} 
            handlePause={handlePause} 
            handleStop={handleStop} 
            setIsPlaying={setIsPlaying}
          />
        </div>
        <div className="code-container">
          <CodeArea commands={commands} setCommands={setCommands} />
        </div>
        <div className="commands-container">
          <CommandPalette />
        </div>
      </div>
    </>
  );
};

export default App;
