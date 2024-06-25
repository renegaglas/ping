import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

const ControlButtons: React.FC = () => {
  const { play, pause, stop } = useContext(AppContext);

  return (
    <div className="control-buttons">
      <button className="control-button play" onClick={play}>▶</button>
      <button className="control-button pause" onClick={pause}>||</button>
      <button className="control-button stop" onClick={stop}>■</button>
    </div>
  );
};

export default ControlButtons;
