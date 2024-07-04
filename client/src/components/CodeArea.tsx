import React, { useState, useEffect } from 'react';
import './CodeArea.css';

interface Command {
  index?: number;
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

  useEffect(() => {
    // This effect runs whenever `commands` changes
    console.log("commands has been modified")
  }, [commands]);


  const onDrophat = (event: React.DragEvent<HTMLDivElement>,index:number) => {
    console.log("onDrophat has been called and abort")
    return;
    onDrop(event, index);
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>,index:number) => {

    console.log('on drop start');
    console.log('commands is set to', commands);
    console.log('index set to', index);
    console.log('event is set to', event);

    const commandName = event.dataTransfer.getData('command');
    //console.log("commandName",commandName);
    if (!commandName)
      {
        //console.log("abord onDrop");
        event.preventDefault();
        return;
      }
    let val_tmp = 0;
    if (commandName === 'Repeat End') {
      for (let i = commands.length - 1; i >= 0; i--) {
        if (commands[i].name === 'Repeat Start' && !commands[i].closed) {
          commands[i].closed = true;
          val_tmp = i;
          break;
        }
      }
    }


    const updatedCommands = [...commands];
    updatedCommands.splice(index, 0, { name: commandName, color: 'black', angle: 0, value: val_tmp, closed :false });

    const lastindex_tmp = event.dataTransfer.getData('index');
    if (lastindex_tmp)
      {
        let lastindex = parseInt(lastindex_tmp);
        if (index < lastindex)
          {
            lastindex += 1;
          }
          updatedCommands.splice(lastindex, 1);
      }

    setCommands(updatedCommands);

    console.log('updatedCommands is set to', updatedCommands);
    event.preventDefault();
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleAngleChange = (angle: number,index:number) => {
    const roundedAngle = Math.round(angle);
    const updatedCommands = [...commands];
    updatedCommands[index].angle = roundedAngle;
    updatedCommands[index].value = roundedAngle;
    setCommands(updatedCommands);
  };

  const handleDistanceSelection = (d: number,index:number) => {
    const updatedCommands = [...commands];
    updatedCommands[index].value = d;
    setCommands(updatedCommands);
  };

  const handleColorSelection = (color: string,index:number) => {
    const updatedCommands = [...commands];
    updatedCommands[index].color = color;
    updatedCommands[index].value = color;
    setCommands(updatedCommands);
  };

  const handleRepeatSelection = (n: number,index:number) => {
    const updatedCommands = [...commands];
    updatedCommands[index].value = n;
    setCommands(updatedCommands);
  };

  const handleDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>,index:number) => {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const centerX = boundingRect.width / 2;
    const centerY = boundingRect.height / 2;
    const deltaX = event.clientX - boundingRect.left - centerX;
    const deltaY = event.clientY - boundingRect.top - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    console.log('angle is set to', angle, "by handleDrag");
    handleAngleChange(angle,index);
  };

  const test = (id:string) => {
    console.log("the function test " + id + " has been called");
    console.log(commands);
    console.log(commands.length);
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>,index:number,name:string) => {

    event.dataTransfer.setData('command', name);
    event.dataTransfer.setData('index', index.toString());
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    console.log("handleMouseEnter");
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    console.log("handleMouseLeave");
    setIsHovered(false);
  };

  const erase = (index:number) => {
    const updatedCommands = [...commands];
    updatedCommands.splice(index, 1);
    setCommands(updatedCommands);

  }

  return (
    <div className="code-area" onDrop={(e) => onDrophat(e, commands.length)} onDragOver={onDragOver} >
      <button className="cleat button" onClick={() => setCommands([])}>Clear</button>
      <div className="code-area-content">
      <div className="arrow" onDrop={(e) => onDrop(e, 0)} onDragOver={onDragOver}>&#8595;</div>
        {commands.map((command, index) => (
          <React.Fragment key={index}>



            <div className="dropped-command" draggable onDragStart={(e) => onDragStart(e,index,command.name)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>{isHovered && (
              <div style={{position: 'absolute', top: '0px', right: '0px', fontSize: '14px', color: 'blue' }} onClick={() => erase(index)}>
                &#10060;
              </div>
            )}

            {command.name && <span>{command.name}</span>}
              <img
                src={command.name === 'Color' ? Colorfiles[command.color || 'black'] : CommandIcons[command.name]}
                alt={command.name}
              />
              {command.value && <div><span>value = {command.value}</span><br /></div>}

            {command.name === 'Forward' && (
              <input
                type="number"
                value={command.value}
                onChange={(e) =>  handleDistanceSelection(parseInt(e.target.value),index)}
              />
            )}
            {command.name === 'Repeat Start' && (
              <input
                type="number"
                min="1"
                onChange={(e) => {
                  if (parseInt(e.target.value) < 1) e.target.value = '1';
                  handleRepeatSelection(parseInt(e.target.value),index)
                }}
              />
            )}
            {command.name === 'Color' && (
              <div className="color-palette">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => {handleColorSelection(color, index)}}
                  />
                ))}
              </div>
            )}

          {(command.name === 'Turn Right' || command.name === 'Turn Left') && (
            <div className="angle-input">
              <div
                className="turtle-icon"
                onMouseMove={(e) => handleDrag(e,index)}
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
                  //if (Number.isNaN(angle_tmp)) angle_tmp = 0;
                  angle_tmp = Number(angle_tmp);
                  if (angle_tmp < -180) angle_tmp = -180;
                  else if (angle_tmp > 180) angle_tmp = 180;
                  console.log('angle is set to', angle_tmp, "by input field");

                  handleAngleChange(angle_tmp, index);
                }}
              />
            </div>
            )}
            </div>
            {index < commands.length  && (
              <div className="arrow" onDrop={(e) => onDrop(e, index + 1)} onDragOver={onDragOver}>&#8595;</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CodeArea;
