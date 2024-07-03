import React, { useState } from 'react';
import './CodeArea.css';

interface Command {
  name: string;
  value?: number | string;
  color?: string;
  angle?: number;
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
  'Repeat': 'img/repeat.png'
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

  const onDrop = (event: React.DragEvent<HTMLDivElement>,index:number) => {

    console.log('on drop start');
    console.log('index set to', index);
    console.log('event is set to', event);

    const commandName = event.dataTransfer.getData('command');

    console.log('commands is set to', commands);
    commands.splice(index, 0, { name: commandName, color: 'black', angle: 0 });
    console.log('commands is set to', commands);
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

  const test = (id:string) => {
    console.log("the function test " + id + " has been called");
  };

  return (
    <div className="code-area" onDrop={(e) => onDrop(e, commands.length)} onDragOver={onDragOver}>
      <div className="code-area-content">
        {commands.map((command, index) => (
          <React.Fragment key={index}>
            <p color='black'>testing</p>
            <div className="dropped-command">

            <img
              src={command.name === 'Color' ? Colorfiles[currentColor] : CommandIcons[command.name]}
              alt={command.name}
            />
            {command.name === 'Forward' && (
              <input
                type="number"
                onChange={(e) => setCurrentCommand({ ...command, value: parseInt(e.target.value) })}
              />
            )}
            {command.name === 'Color' && (
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

          {(command.name === 'Turn Right' || command.name === 'Turn Left') && (
            <div className="angle-input">
              <div
                className="turtle-icon"
                onMouseMove={handleDrag}
                onMouseDown={(e) => e.preventDefault()}
                style={{ transform: `rotate(${command.angle}deg)` }}
              >
                <img src="img/turtle_canvas.png" alt="turtle" />
                <div className="rotation-handle"></div>
              </div>
              <input
                type="number"
                value={command.angle}
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





            </div>
            {index < commands.length - 1 && (
              <div className="arrow" onDrop={(e) => onDrop(e, index)} onDragOver={onDragOver}>&#8595;</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CodeArea;
