import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

interface Command {
  name: string;
  value?: number;
}

interface CanvasProps {
  commands: Command[];
  isDrawing: boolean;
  toggleDrawing: () => void;
  handlePlay: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ commands, isDrawing, toggleDrawing, handlePlay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [turtle, setTurtle] = useState({ x: 250, y: 250, angle: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      drawTurtle(context, turtle.x, turtle.y, turtle.angle);
    }
  }, [turtle]);

  const executeCommands = async () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      for (const command of commands) {
        switch (command.name) {
          case 'Forward':
            const distance = command.value || 0;
            const newX = turtle.x + distance * Math.cos((turtle.angle * Math.PI) / 180);
            const newY = turtle.y + distance * Math.sin((turtle.angle * Math.PI) / 180);
            if (isDrawing) {
              context.beginPath();
              context.moveTo(turtle.x, turtle.y);
              context.lineTo(newX, newY);
              context.strokeStyle = 'black';
              context.stroke();
            }
            setTurtle({ ...turtle, x: newX, y: newY });
            break;
          case 'Turtle':
            toggleDrawing();
            break;
          default:
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const drawTurtle = (context: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    const img = new Image();
    img.src = 'img/turtle_canvas.png';
    img.onload = () => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
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
        <button>Pause</button>
        <button>Stop</button>
      </div>
      <canvas ref={canvasRef} id="turtle-canvas" width="500" height="500"></canvas>
    </div>
  );
};

export default Canvas;
