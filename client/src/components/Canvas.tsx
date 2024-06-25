import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../AppContext';

const Canvas: React.FC = () => {
    const { turtlePosition, drawing } = useContext(AppContext);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, 500);
            if (drawing) {
                ctx.beginPath();
                ctx.arc(Turtle, 0, 5);
                ctx.fill();
            } else {
                ctx.clearRect(ctx.draw);
            }
        }
    }, [turtlePosition, drawing]);

    return <canvas ref={canvasRef} width={800} height={400} />;
};

export default Canvas;
