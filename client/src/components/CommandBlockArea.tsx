import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';

const CommandBlockArea: React.FC = () => {
  const { commands, setCommands } = useContext(AppContext);
  const [draggedCommand, setDraggedCommand] = useState<Command | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const commandType = e.dataTransfer.getData('command');
    const newCommand = { type: commandType };
    setCommands([...commands, newCommand]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleCommandUpdate = (index: number, value: any) => {
    const updatedCommands = commands.map((cmd, idx) =>
      idx === index ? { ...cmd, value } : cmd
    );
    setCommands(updatedCommands);
  };

  const handleRemoveCommand = (index: number) => {
    setCommands(commands.filter((_, idx) => idx !== index));
  };

  return (
    <div className="command-block-area" onDrop={handleDrop} onDragOver={handleDragOver}>
      {commands.map((command, index) => (
        <div key={index} className="dropped-command">
          <img src={`/images/${command.type}.png`} alt={command.type} />
          {command.type === 'forward' && (
            <div>
              <input
                type="number"
                placeholder="Distance"
                onChange={(e) => handleCommandUpdate(index, parseInt(e.target.value, 10))}
              />
              <button onClick={() => handleCommandUpdate(index, command.value)}>Confirm</button>
            </div>
          )}
          {command.type === 'color' && (
            <div>
              {/* Color palette logic */}
              <button onClick={() => handleCommandUpdate(index, command.value)}>Confirm</button>
            </div>
          )}
          {command.type === 'turn-right' || command.type === 'turn-left' && (
            <div>
              {/* Angle selection logic */}
              <button onClick={() => handleCommandUpdate(index, command.value)}>Confirm</button>
            </div>
          )}
          {command.type === 'repeat' && (
            <div>
              <input
                type="number"
                placeholder="Iterations"
                onChange={(e) => handleCommandUpdate(index, parseInt(e.target.value, 10))}
              />
              <button onClick={() => handleCommandUpdate(index, command.value)}>Confirm</button>
            </div>
          )}
          <button onClick={() => handleRemoveCommand(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default CommandBlockArea;
