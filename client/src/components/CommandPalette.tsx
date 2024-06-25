import React from 'react';

const commands = [
  { type: 'turtle', label: 'Turtle' },
  { type: 'forward', label: 'Forward' },
  { type: 'color', label: 'Color' },
  { type: 'turn-right', label: 'Turn Right' },
  { type: 'turn-left', label: 'Turn Left' },
  { type: 'repeat', label: 'Repeat' },
];

const CommandPalette: React.FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, commandType: string) => {
    e.dataTransfer.setData('command', commandType);
  };

  return (
    <div className="command-palette">
      {commands.map((command) => (
        <div
          key={command.type}
          draggable
          onDragStart={(e) => handleDragStart(e, command.type)}
        >
          <img src={`/images/${command.type}.png`} alt={command.label} />
          <p>{command.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CommandPalette;
