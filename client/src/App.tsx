import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Canvas from './components/Canvas';
import CommandPalette from './components/CommandPalette';
import CodeArea from './components/CodeArea';

interface Command {
  index: number;
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
    try {
      const response = await axios.post(
        'http://localhost:8080/api/open/file',
        { path: tutorial },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.data) {
        const commandsFromTutorial: Command[] = JSON.parse(response.data);
        setCommands(commandsFromTutorial);
      }
    } catch (error) {
      console.log("Couldn't open the tutorial", error);
    }
  };

  const test_endpoint = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/hello',
      );
      console.log(response.data);
    } catch (error) {
      console.log("Couldn't reach the endpoint", error);
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
            <button onClick={() => handleTutorialClick('drawing_tutorial.json')}>Drawing Tutorial</button>
            <button onClick={() => handleTutorialClick('turn_tutorial.json')}>Turn Tutorial</button>
            <button onClick={() => handleTutorialClick('repeat_tutorial.json')}>Repeat Tutorial</button>
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
