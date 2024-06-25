import React, { useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import CommandPalette from './components/CommandPalette';
import CodeArea from './components/CodeArea';

interface Command {
  name: string;
  value?: number;
}

const App: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handlePlay = () => {
    // Here you can trigger the execution of the commands
  };

  const toggleDrawing = () => {
    setIsDrawing(prev => !prev);
  };

  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas commands={commands} isDrawing={isDrawing} toggleDrawing={toggleDrawing} handlePlay={handlePlay} />
      </div>
      <div className="code-container">
        <CodeArea commands={commands} setCommands={setCommands} />
      </div>
      <div className="commands-container">
        <CommandPalette />
      </div>
    </div>
  );
};

export default App;
