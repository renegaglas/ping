import React from 'react';

const CommandList: React.FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, command: string) => {
    e.dataTransfer.setData('command', command);
  };

  return (
    <div className="command-list">
      <div className="command-item" draggable onDragStart={(e) => handleDragStart(e, 'turtle')}>
        <img src="../../img/turtle.png" alt="Turtle" /> Turtle
      </div>
      <div className="command-item" draggable onDragStart={(e) => handleDragStart(e, 'forward')}>
        <img src="../../img/forward.png" alt="Forward" /> Forward
      </div>
      <div className="command-item" draggable onDragStart={(e) => handleDragStart(e, 'color')}>
        <img src="../../img/color.png" alt="Color" /> Color
      </div>
      <div className="command-item" draggable onDragStart={(e) => handleDragStart(e, 'turn-right')}>
        <img src="../../img/turn_right.png" alt="Turn Right" /> Turn Right
      </div>
      <div className="command-item" draggable onDragStart={(e) => handleDragStart(e, 'turn-left')}>
        <img src="../../img/turn_left.png" alt="Turn Left" /> Turn Left
      </div>
      <div className="command-item" draggable onDragStart={(e) => handleDragStart(e, 'repeat')}>
        <img src="../../img/repeat.png" alt="Repeat" /> Repeat
      </div>
    </div>
  );
};

export default CommandList;
