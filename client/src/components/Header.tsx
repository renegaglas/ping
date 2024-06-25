import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="header">
      <button className="header-button">load</button>
      <button className="header-button">save</button>
      <button className="header-button tutorial-button">
        tutorial
        <div className="tutorial-list">
          <div className="tutorial-item">Repeat Tutorial</div>
          <div className="tutorial-item">Forward Tutorial</div>
          <div className="tutorial-item">Turn Tutorial</div>
        </div>
      </button>
    </div>
  );
};

export default Header;
