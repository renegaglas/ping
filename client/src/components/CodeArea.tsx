import React, { useState } from 'react';
import './CodeArea.css';

interface Command {
  name: string;
  value?: number | string;
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

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black'];

const CodeArea: React.FC<CodeAreaProps> = ({ commands, setCommands }) => {
  const [currentCommand, setCurrentCommand] = useState<Command | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);

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
      setCurrentAngle(0);
    }
  };

  const handleAngleChange = (angle: number) => {
    const roundedAngle = Math.round(angle);
    setCurrentAngle(roundedAngle);
    if (currentCommand) {
      setCurrentCommand({ ...currentCommand, value: roundedAngle });
    }
  };

  const handleDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const centerX = boundingRect.width / 2;
    const centerY = boundingRect.height / 2;
    const deltaX = event.clientX - boundingRect.left - centerX;
    const deltaY = event.clientY - boundingRect.top - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    handleAngleChange(angle);
  };

  return (
    <div className="code-area" onDrop={onDrop} onDragOver={onDragOver}>
      <div className="code-area-content">
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
            {currentCommand.name === 'Color' && (
              <div className="color-palette">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentCommand({ ...currentCommand, value: color })}
                  />
                ))}
              </div>
            )}
            {(currentCommand.name === 'Turn Right' || currentCommand.name === 'Turn Left') && (
              <div className="angle-input">
                <div
                  className="turtle-icon"
                  onMouseMove={handleDrag}
                  onMouseDown={(e) => e.preventDefault()}
                  style={{ transform: `rotate(${currentAngle}deg)` }}
                >
                  <img src="img/turtle_canvas.png" alt="turtle" />
                  <div className="rotation-handle"></div>
                </div>
                <span>{currentAngle}°</span>
              </div>
            )}
            <button onClick={handleConfirm}>Confirm</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeArea;
