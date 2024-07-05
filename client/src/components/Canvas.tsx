import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

interface Command {
  index?: number;
  name: string;
  value?: number | string;
  closed?: boolean;
  currRep: number;
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
  // currIndex represents the index in the commandsList of the command that must be
  // executed next
  // example: if currIndex === 0 then the next command to execute is commands[0], so
  // it hasn't ended but it might have started
  const [currIndex, setCurrIndex] = useState(0);
  const isPlayingRef = useRef(false);
  //let start2 = start;

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
    for (let i = currIndex; i < commands.length; i++) {
      console.log("Current iteration: ", i);
      console.log("currIndex: ", currIndex);
      if (!isPlayingRef.current) {
        setStart(i);
        return null;
      }

      const command = commands[i];
      //setCurrIndex(i);
      console.log("curr command[i]: ", commands[i]);

      console.log("Executing " + command.name);
      switch (command.name) {
        case 'Forward':
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
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
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
          drawTurtle(context, currentTurtle.x, currentTurtle.y, currentTurtle.angle);
          break;
        case 'Turtle':
          currentTurtle.isDrawing = !currentTurtle.isDrawing;
          break;
        case 'Color':
          currentTurtle.color = command.value as string;
          break;
        case 'Turn Right':
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
          clearTurtle(context, currentTurtle.x, currentTurtle.y);
          currentTurtle.angle = (currentTurtle.angle + (command.value as number)) % 360;
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
          drawTurtle(context, currentTurtle.x, currentTurtle.y, currentTurtle.angle);
          break;
        case 'Turn Left':
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
          clearTurtle(context, currentTurtle.x, currentTurtle.y);
          currentTurtle.angle =
            (currentTurtle.angle - (command.value as number) + 360) % 360;
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
          drawTurtle(context, currentTurtle.x, currentTurtle.y, currentTurtle.angle);
          break;
        case 'Repeat Start':
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
          let loop_instructions = [];
          for (let j = i + 1; j < commands.length; j++) {
            if (commands[j].name === 'Repeat End' && commands[j].value === command.index) {
              break;
            }
            loop_instructions.push(commands[j]);
          }
          for (; command.currRep < (command.value as number) - 1; command.currRep++) {
            console.log("Repeating for the " + command.currRep + "th time");
            let tmp = await executeCommandsList(
              loop_instructions,
              context,
              drawingcontext,
              currentTurtle
            );
            if (!tmp)
              {
                return;
              }
            drawingcontext = tmp;

          }
          command.currRep = 0;
          break;
        case 'Repeat End':
          await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
          break;
        default:
          break;
      }
      console.log("Done executing");

      console.log("currIndex before: ", currIndex);
      setCurrIndex(i + 1);
      console.log("currIndex after: ", currIndex);
    }
    return drawingcontext;
  };

  const executeCommands = async () => {
    const canvas = canvasRef.current;
    const drawingcanvas = drawingcanvasRef.current;
    let context = canvas?.getContext('2d');
    let drawingcontext = drawingcanvas?.getContext('2d');
    console.log("Play: currIndex: ", currIndex);
    if (context && drawingcontext) {
      if (currIndex === 0) {
        resetCanvas();
        drawTurtle(
          context,
          initialTurtleState.x,
          initialTurtleState.y,
          initialTurtleState.angle
        );
      }
      let currentTurtle = { ...turtle };
      //isPlayingRef.current = true;
      let x = await executeCommandsList(
        commands,
        context,
        drawingcontext,
        currentTurtle
      );
      if (!drawingcontext)
        {
          return;
        }
      //isPlayingRef.current = false;
      if (currIndex === commands.length) {
        console.log("currIndex === commands.length, done");
        setStart(0);
        setCurrIndex(0);
        //start2 = 0;
        //console.log("start2 set to 0")
      }
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
            //console.log("start when playing:", start)
            //console.log("start2 when playing:", start2)
            if (!isPlayingRef.current) {
              isPlayingRef.current = true;
              console.log("before executing commands");
              executeCommands();
            }
          }}
        >
          <img src="img/play_button.png" alt="Play" />
        </button>
        <button
          onClick={() => {
            //console.log("start when pausing:", start)
            //console.log("start2 when pausing:", start2)
            isPlayingRef.current = false;
          }}
        >
          <img src="img/pause_button.png" alt="Pause" />
        </button>
        <button
          onClick={() => {
            isPlayingRef.current = false;
            setStart(0);
            setCurrIndex(0);

            // we set all currReps to 0
            for (let i = 0; i < commands.length; i++) {
              commands[i].currRep = 0;
            }
            //start2 = 0;
            //console.log("start2 set to 0 because of stoping")
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
