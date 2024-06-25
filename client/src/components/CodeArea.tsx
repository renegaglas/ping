import React, { useState } from 'react';
import './CodeArea.css';

interface Command {
  name: string;
  value?: number;
}

interface CodeAreaProps {
  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
}

const CommandIcons: { [key: string]: string } = {
  'Turtle': 'img/turtle.png',
  'Forward': 'img/forward.png',
  'Color': 'img/color.png',
  'Turn Right': 'img/turn_right.png',
  'Turn Left': 'img/turn_left.png',
  'Repeat': 'img/repeat.png'
};

const CodeArea: React.FC<CodeAreaProps> = ({ commands, setCommands }) => {
  const [currentCommand, setCurrentCommand] = useState<Command | null>(null);

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const commandName = event.dataTransfer.getData('command');
    setCurrentCommand({ name: commandName });
    event.preventDefault();
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleConfirm = () => {
    if (currentCommand) {
      setCommands([...commands, currentCommand]);
      setCurrentCommand(null);
    }
  };

  return (
    <div className="code-area" onDrop={onDrop} onDragOver={onDragOver}>
      {commands.map((command, index) => (
        <React.Fragment key={index}>
          <div className="dropped-command">
            <img src={CommandIcons[command.name]} alt={command.name} />
            {command.value && <span>{command.value}</span>}
          </div>
          {index < commands.length - 1 && (
            <div className="arrow">&#8595;</div> // Unicode for down arrow
          )}
        </React.Fragment>
      ))}
      {currentCommand && (
        <div className="command-input">
          <img src={CommandIcons[currentCommand.name]} alt={currentCommand.name} />
          {currentCommand.name === 'Forward' && (
            <input
              type="number"
              onChange={(e) => setCurrentCommand({ ...currentCommand, value: parseInt(e.target.value) })}
            />
          )}
          <button onClick={handleConfirm}>Confirm</button>
        </div>
      )}
    </div>
  );
};

export default CodeArea;
