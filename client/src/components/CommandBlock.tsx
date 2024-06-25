import React from 'react';
import './CommandBlock.css';

interface CommandBlockProps {
  name: string;
  icon: string;
}

const CommandBlock: React.FC<CommandBlockProps> = ({ name, icon }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('command', name);
  };

  return (
    <div className="command-block" draggable onDragStart={onDragStart}>
      <img src={icon} alt={name} />
      <span>{name}</span>
    </div>
  );
};

export default CommandBlock;
