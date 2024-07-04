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

const Canvas: React.FC<CanvasProps> = ({ commands }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingcanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [turtle, setTurtle] = useState<TurtleState>(initialTurtleState);
  const [start, setStart] = useState(0);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      drawTurtle(context, turtle.x, turtle.y, turtle.angle);
    }
  }, []);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const drawingcanvas = drawingcanvasRef.current;
    const context = canvas?.getContext('2d');
    const drawingcontext = drawingcanvas?.getContext('2d');
    if (context && canvas && drawingcontext && drawingcanvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawingcontext.clearRect(0, 0, drawingcanvas.width, drawingcanvas.height);
      drawTurtle(context, initialTurtleState.x, initialTurtleState.y, initialTurtleState.angle);
    }
    setTurtle(initialTurtleState);
  };

  const executeCommandsList = async (
    commands: Command[],
    context: CanvasRenderingContext2D,
    drawingcontext: CanvasRenderingContext2D,
    currentTurtle: TurtleState
  ) => {
    for (let i = start; i < commands.length; i++) {
      if (!isPlayingRef.current) {
        setStart(i);
        break;
      }

      const command = commands[i];

      switch (command.name) {
        case 'Forward':
          await new Promise((resolve) => setTimeout(resolve, 1000));
          clearTurtle(context, currentTurtle.x, currentTurtle.y);
          const distance = (command.value as number) || 0;
          const newX =
            currentTurtle.x +
            distance * Math.cos((currentTurtle.angle * Math.PI) / 180);
          const newY =
            currentTurtle.y +
            distance * Math.sin((currentTurtle.angle * Math.PI) / 180);
          if (currentTurtle.isDrawing) {
            drawingcontext.beginPath();
            drawingcontext.moveTo(currentTurtle.x, currentTurtle.y);
            drawingcontext.lineTo(newX, newY);
            drawingcontext.strokeStyle = currentTurtle.color;
            drawingcontext.stroke();
          }
          currentTurtle.x = newX;
          currentTurtle.y = newY;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          drawTurtle(context, currentTurtle.x, currentTurtle.y, currentTurtle.angle);
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
          currentTurtle.angle =
            (currentTurtle.angle - (command.value as number) + 360) % 360;
          break;
        case 'Repeat Start':
          let loop_instructions = [];
          for (let j = i + 1; j < commands.length; j++) {
            if (commands[j].name === 'Repeat End' && commands[j].value === command.index) {
              break;
            }
            loop_instructions.push(commands[j]);
          }
          for (let k = 0; k < (command.value as number) - 1; k++) {
            drawingcontext = await executeCommandsList(
              loop_instructions,
              context,
              drawingcontext,
              currentTurtle
            );
          }
          break;
        default:
          break;
      }
    }
    return drawingcontext;
  };

  const executeCommands = async () => {
    const canvas = canvasRef.current;
    const drawingcanvas = drawingcanvasRef.current;
    let context = canvas?.getContext('2d');
    let drawingcontext = drawingcanvas?.getContext('2d');
    if (context && drawingcontext) {
      if (start === 0) {
        resetCanvas();
        drawTurtle(
          context,
          initialTurtleState.x,
          initialTurtleState.y,
          initialTurtleState.angle
        );
      }
      let currentTurtle = { ...turtle };
      isPlayingRef.current = true;
      drawingcontext = await executeCommandsList(
        commands,
        context,
        drawingcontext,
        currentTurtle
      );
      isPlayingRef.current = false;
      setStart(0);
      setTurtle(currentTurtle);
    }
  };

  const clearTurtle = (context: CanvasRenderingContext2D, x: number, y: number) => {
    context.clearRect(x - 15, y - 15, 30, 30);
  };

  const drawTurtle = (context: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    const img = new Image();
    img.src = 'img/turtle_canvas.png';
    img.onload = () => {
      context.save();
      context.translate(x, y);
      context.rotate((angle * Math.PI) / 180);
      context.drawImage(img, -15, -15, 30, 30);
      context.restore();
    };
  };

  return (
    <div className="canvas">
      <div className="control-panel">
        <button
          onClick={() => {
            if (!isPlayingRef.current) {
              executeCommands();
            }
            isPlayingRef.current = true;
          }}
        >
          <img src="img/play_button.png" alt="Play" />
        </button>
        <button
          onClick={() => {
            isPlayingRef.current = false;
          }}
        >
          <img src="img/pause_button.png" alt="Pause" />
        </button>
        <button
          onClick={() => {
            isPlayingRef.current = false;
            setStart(0);
            resetCanvas();
          }}
        >
          <img src="img/stop_button.png" alt="Stop" />
        </button>
      </div>
      <div
        className="canvas-container"
        style={{ position: 'relative', border: '0px' }}
      >
        <canvas
          ref={canvasRef}
          id="turtle-canvas"
          width="500"
          height="500"
          style={{ position: 'absolute', zIndex: 1 }}
        ></canvas>
        <canvas
          ref={drawingcanvasRef}
          id="drawing-canvas"
          width="500"
          height="500"
          style={{ position: 'absolute', zIndex: 2 }}
        ></canvas>
      </div>
    </div>
  );
};

export default Canvas;
