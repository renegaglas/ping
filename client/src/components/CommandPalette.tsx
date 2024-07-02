import React from 'react';
import './CommandPalette.css';
import CommandBlock from './CommandBlock';

const CommandPalette: React.FC = () => {
  return (
    <div className="command-palette">
      <CommandBlock name="Turtle" icon="img/turtle.png" />
      <CommandBlock name="Forward" icon="img/forward.png" />
      <CommandBlock name="Color" icon="img/color_black.png" />
      <CommandBlock name="Turn Right" icon="img/turn_right.png" />
      <CommandBlock name="Turn Left" icon="img/turn_left.png" />
      <CommandBlock name="Repeat Start" icon="img/repeat_start.png" />
      <CommandBlock name="Repeat End" icon="img/repeat_end.png" />
    </div>
  );
};

export default CommandPalette;
