import React, { useRef, useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';
import turtleImg from '../../img/turtle_canvas.png';

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { turtlePosition, setTurtlePosition } = useContext(AppContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const img = new Image();
    img.src = turtleImg;

    img.onload = () => {
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, turtlePosition.x, turtlePosition.y, 50, 50); // Adjust the size as needed
      }
    };
  }, [turtlePosition]);

  return <canvas ref={canvasRef} className="drawing-canvas" width={600} height={400}></canvas>;
};

export default DrawingCanvas;
