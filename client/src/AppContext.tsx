import React, { createContext, useState, ReactNode } from 'react';

interface Command {
  type: string;
  value?: any;
}

interface AppContextType {
  play: () => void;
  pause: () => void;
  stop: () => void;
  turtlePosition: { x: number; y: number };
  setTurtlePosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
  drawing: boolean;
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType>({
  play: () => {},
  pause: () => {},
  stop: () => {},
  turtlePosition: { x: 300, y: 200 },
  setTurtlePosition: () => {},
  commands: [],
  setCommands: () => {},
  drawing: false,
  setDrawing: () => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [turtlePosition, setTurtlePosition] = useState({ x: 300, y: 200 });
  const [commands, setCommands] = useState<Command[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [commandIndex, setCommandIndex] = useState(0);

  const executeCommand = (command: Command) => {
    switch (command.type) {
      case 'forward':
        setTurtlePosition(prev => ({ ...prev, y: prev.y - command.value }));
        break;
      case 'turn-right':
        // Add logic to turn right
        break;
      case 'turn-left':
        // Add logic to turn left
        break;
      case 'color':
        // Add logic to change color
        break;
      case 'turtle':
        setDrawing(!drawing);
        break;
      case 'repeat':
        // Add logic for repeat
        break;
      default:
        break;
    }
  };

  const play = () => {
    setIsPaused(false);
    const runCommands = () => {
      if (!isPaused && commandIndex < commands.length) {
        executeCommand(commands[commandIndex]);
        setCommandIndex(prev => prev + 1);
        setTimeout(runCommands, 500); // Delay for visual effect
      }
    };
    runCommands();
  };

  const pause = () => {
    setIsPaused(true);
  };

  const stop = () => {
    setIsPaused(true);
    setCommandIndex(0);
    setCommands([]);
    setTurtlePosition({ x: 300, y: 200 });
    setDrawing(false);
  };

  return (
    <AppContext.Provider value={{ play, pause, stop, turtlePosition, setTurtlePosition, commands, setCommands, drawing, setDrawing }}>
      {children}
    </AppContext.Provider>
  );
};
