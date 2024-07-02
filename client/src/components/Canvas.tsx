import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

interface Command {
  index: number;
  name: string;
  value?: number | string;
  closed?: boolean;
}

interface CanvasProps {
  commands: Command[];
  isDrawing: boolean;
  toggleDrawing: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  handlePlay: () => void;
  handlePause: () => void;
  handleStop: () => void;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TurtleState {
  x: number;
  y: number;
  angle: number;
  color: string;
  isDrawing: boolean;
}

const initialTurtleState: TurtleState = {
  x: 250,
  y: 250,
  angle: 0,
  color: 'black',
  isDrawing: false,
};

const Canvas: React.FC<CanvasProps> = ({
  commands,
  isDrawing,
  toggleDrawing,
  isPlaying,
  isPaused,
  handlePlay,
  handlePause,
  handleStop,
  setIsPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [turtle, setTurtle] = useState<TurtleState>(initialTurtleState);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      drawTurtle(context, turtle.x, turtle.y, turtle.angle);
    }
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      executeCommands().then(() => setIsPlaying(false));
    }
  }, [isPlaying, isPaused]);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTurtle(initialTurtleState);
  };

  const executeCommandsList = async (commands: Command[], context: CanvasRenderingContext2D, currentTurtle: TurtleState) => {
      for (const command of commands) {
        if (!isPlaying || isPaused) break;

        await new Promise(resolve => setTimeout(resolve, 1000));
        clearTurtle(context, currentTurtle.x, currentTurtle.y);
        switch (command.name) {
          case 'Forward':
            const distance = command.value as number || 0;
            const newX = currentTurtle.x + distance * Math.cos((currentTurtle.angle * Math.PI) / 180);
            const newY = currentTurtle.y + distance * Math.sin((currentTurtle.angle * Math.PI) / 180);
            if (currentTurtle.isDrawing) {
              context.beginPath();
              context.moveTo(currentTurtle.x, currentTurtle.y);
              context.lineTo(newX, newY);
              context.strokeStyle = currentTurtle.color;
              context.stroke();
            }
            currentTurtle.x = newX;
            currentTurtle.y = newY;
            break;
          case 'Turtle':
            currentTurtle.isDrawing = !currentTurtle.isDrawing;
            break;
          case 'Color':
            currentTurtle.color = command.value as string;
            break;
          case 'Turn Right':
            currentTurtle.angle = (currentTurtle.angle + (command.value as number)) % 360;
            break;
          case 'Turn Left':
            currentTurtle.angle = (currentTurtle.angle - (command.value as number) + 360) % 360;
            break;
          case 'Repeat Start':
            let loop_instructions = [];
            for (let i = command.index + 1; i < commands.length; i++) {
              if (commands[i].name === 'Repeat End' && commands[i].value === command.index) {
                break;
              }
              loop_instructions.push(commands[i]);
            }
            for (let i = 0; i < (command.value as number) - 1; i++) {
              context = await executeCommandsList(loop_instructions, context, currentTurtle);
            }
            break;
          default:
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        drawTurtle(context, currentTurtle.x, currentTurtle.y, currentTurtle.angle); // Redraw the turtle at the new position
      }
      return context;
  };

  const executeCommands = async () => {
    const canvas = canvasRef.current;
    let context = canvas?.getContext('2d');
    if (context) {
      resetCanvas();
      drawTurtle(context, initialTurtleState.x, initialTurtleState.y, initialTurtleState.angle); // Draw initial turtle position
      // await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for turtle to show

      let currentTurtle = { ...initialTurtleState }; // Start with initial state
      context = await executeCommandsList(commands, context, currentTurtle);
      setTurtle(currentTurtle); // Update the state with the final turtle position
    }
  };

  const clearTurtle = (context: CanvasRenderingContext2D, x: number, y: number) => {
    context.clearRect(x - 15, y - 15, 30, 30); // Clear the area where the turtle was previously drawn
  };

  const drawTurtle = (context: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    const img = new Image();
    img.src = 'img/turtle_canvas.png';
    img.onload = () => {
      context.save();
      context.translate(x, y);
      context.rotate((angle * Math.PI) / 180);
      context.drawImage(img, -15, -15, 30, 30); // Adjust to the size of your turtle image
      context.restore();
    };
  };

  return (
    <div className="canvas">
      <div className="control-panel">
        <button onClick={() => { handlePlay(); }}>
          <img src="img/play_button.png" alt="Play" />
        </button>
        <button onClick={handlePause}>
          <img src="img/pause_button.png" alt="Pause" />
        </button>
        <button onClick={handleStop}>
          <img src="img/stop_button.png" alt="Stop" />
        </button>
      </div>
      <canvas ref={canvasRef} id="turtle-canvas" width="500" height="500"></canvas>
    </div>
  );
};

export default Canvas;
