import React, { useState } from 'react';
import './CommandBlock.css';

interface CommandBlockProps {
  name: string;
  icon: string;
}

const helptext: { [key: string]: string } = {
  'Turtle': 'Permet à la tortue de dessiner ou non quand elle se déplace',
  'Forward': 'Permet à la tortue d\'avancer du nombre de pixel donné',
  'Color': 'Permet de changer la couleur du trait de la tortue',
  'Turn Right': 'Permet de tourner la tortue vers la droite avec l\'angle donné',
  'Turn Left': 'Permet de tourner la tortue vers la gauche avec l\'angle donné',
  'Repeat Start': 'Permet de repeter n fois les instruction entre cette commande et la prochaine commande \'Repeat End\'',
  'Repeat End': 'permet de fermer la commande \'Repeat Start\''
};

const CommandBlock: React.FC<CommandBlockProps> = ({ name, icon }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    console.log("handleMouseEnter");
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    console.log("handleMouseLeave");
    setIsHovered(false);
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('command', name);
  };

  return (
    <div className="command-block" draggable onDragStart={onDragStart}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <img src={icon} alt={name} />
      <span>{name}</span>
      {isHovered && (
        <div style={{ marginTop: '10px', fontSize: '14px', color: 'blue' }}>
          {helptext[name]}
        </div>
      )}
    </div>
  );
};

export default CommandBlock;
