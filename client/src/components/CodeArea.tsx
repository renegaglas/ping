import React, { useState } from 'react';
import './CodeArea.css';

interface Command {
  index: number;
  name: string;
  value?: number | string;
  color?: string;
  angle?: number;
  closed?: boolean;
}

interface CodeAreaProps {
  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
}

const CommandIcons: { [key: string]: string } = {
  'Turtle': 'img/turtle.png',
  'Forward': 'img/forward.png',
  'Color': 'img/color_black.png',
  'Turn Right': 'img/turn_right.png',
  'Turn Left': 'img/turn_left.png',
  'Repeat Start': 'img/repeat_start.png',
  'Repeat End': 'img/repeat_end.png'
};

const Colorfiles: { [key: string]: string } = {
  'black': 'img/color_black.png',
  'pink': 'img/color_pink.png',
  'purple': 'img/color_purple.png',
  'blue': 'img/color_blue.png',
  'green': 'img/color_green.png',
  'yellow': 'img/color_yellow.png',
  'orange': 'img/color_orange.png',
  'red': 'img/color_red.png',
};

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'black'];

const CodeArea: React.FC<CodeAreaProps> = ({ commands, setCommands }) => {
  const [currentCommand, setCurrentCommand] = useState<Command | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [currentColor, setCurrentColor] = useState<string>('black'); // Default color

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const commandName = event.dataTransfer.getData('command');
    //console.log("commandName",commandName);
    if (!commandName)
      {
        //console.log("abord onDrop");
        event.preventDefault();
        return;
      }
    let new_command: Command = { index: commands.length, name: commandName, color: 'black', angle: 0 , closed: false};
    if (commandName === 'Repeat End') {
      for (let i = commands.length - 1; i >= 0; i--) {
        if (commands[i].name === 'Repeat Start' && !commands[i].closed) {
          commands[i].closed = true;
          new_command.value = i;
          break;
        }
      }
    }
    setCurrentCommand(new_command);
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
      setCurrentColor('black');
    }
  };

  const handleAngleChange = (angle: number) => {
    const roundedAngle = Math.round(angle);
    setCurrentAngle(roundedAngle);
    if (currentCommand) {
      setCurrentCommand({ ...currentCommand, value: roundedAngle, angle: roundedAngle });
    }
  };

  const handleColorSelection = (color: string) => {
    setCurrentColor(color);
    if (currentCommand) {
      setCurrentCommand({ ...currentCommand, value: color, color: color });
    }
  };

  const handleDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const centerX = boundingRect.width / 2;
    const centerY = boundingRect.height / 2;
    const deltaX = event.clientX - boundingRect.left - centerX;
    const deltaY = event.clientY - boundingRect.top - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    console.log('angle is set to', angle, "by handleDrag");
    handleAngleChange(angle);
  };

  return (
    <div className="code-area" onDrop={onDrop} onDragOver={onDragOver}>
      <button className="cleat button" onClick={() => setCommands([])}>Clear</button>
      <div className="code-area-content">
        {commands.map((command, index) => (
          <React.Fragment key={index}>
            <div className="dropped-command">
              {command.name && <span>{command.name}</span>}
              <img
                src={command.name === 'Color' ? Colorfiles[command.color || 'black'] : CommandIcons[command.name]}
                alt={command.name}
              />
              {command.value && <div><span>value = {command.value}</span><br /></div>}
            </div>
            {index < commands.length - 1 && (
              <div className="arrow">&#8595;</div>
            )}
          </React.Fragment>
        ))}
        {currentCommand && (
          <div className="command-input">
            <img
              src={currentCommand.name === 'Color' ? Colorfiles[currentColor] : CommandIcons[currentCommand.name]}
              alt={currentCommand.name}
            />
            {currentCommand.name === 'Forward' && (
              <input
                type="number"
                onChange={(e) => setCurrentCommand({ ...currentCommand, value: parseInt(e.target.value) })}
              />
            )}
            {currentCommand.name === 'Repeat Start' && (
              <input
                type="number"
                min="1"
                onChange={(e) => {
                  if (parseInt(e.target.value) < 1) e.target.value = '1';
                  setCurrentCommand({ ...currentCommand, value: parseInt(e.target.value) })
                }}
              />
            )}
            {currentCommand.name === 'Color' && (
              <div className="color-palette">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelection(color)}
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
                style={{ transform: `rotate(${currentCommand.angle}deg)` }}
              >
                <img src="img/turtle_canvas.png" alt="turtle" />
                <div className="rotation-handle"></div>
              </div>
              <input
                type="number"
                value={currentCommand.angle}
                onChange={(e) =>
                  {
                  let angle_tmp = parseInt(e.target.value);
                  if (angle_tmp < -180) angle_tmp = -180;
                  if (angle_tmp > 180) angle_tmp = 180;
                  console.log('angle is set to', angle_tmp, "by input field");

                  handleAngleChange(angle_tmp);
                }}
              />
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
