import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

interface Command {
  name: string;
  value?: number | string;
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

const Canvas: React.FC<CanvasProps> = ({ commands, isDrawing, toggleDrawing, isPlaying, isPaused, handlePlay, handlePause, handleStop, setIsPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [turtle, setTurtle] = useState({ x: 250, y: 250, angle: 0, color: 'black' });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      drawTurtle(context, turtle.x, turtle.y, turtle.angle);
    }
  }, [turtle]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      executeCommands().then(() => setIsPlaying(false));
    }
  }, [isPlaying, isPaused]);

  const executeCommands = async () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      for (const command of commands) {
        if (!isPlaying || isPaused) break;

        switch (command.name) {
          case 'Forward':
            const distance = command.value as number || 0;
            const newX = turtle.x + distance * Math.cos((turtle.angle * Math.PI) / 180);
            const newY = turtle.y + distance * Math.sin((turtle.angle * Math.PI) / 180);
            if (isDrawing) {
              context.beginPath();
              context.moveTo(turtle.x, turtle.y);
              context.lineTo(newX, newY);
              context.strokeStyle = turtle.color;
              context.stroke();
            }
            setTurtle({ ...turtle, x: newX, y: newY });
            break;
          case 'Turtle':
            toggleDrawing();
            break;
          case 'Color':
            setTurtle({ ...turtle, color: command.value as string });
            break;
          case 'Turn Right':
            setTurtle(prev => ({ ...prev, angle: prev.angle + (command.value as number) }));
            break;
          case 'Turn Left':
            setTurtle(prev => ({ ...prev, angle: prev.angle - (command.value as number) }));
            break;
          default:
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setIsPlaying(false);
    }
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
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <canvas ref={canvasRef} id="turtle-canvas" width="500" height="500"></canvas>
    </div>
  );
};

export default Canvas;
