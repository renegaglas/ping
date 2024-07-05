import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Canvas from './components/Canvas';
import CommandPalette from './components/CommandPalette';
import CodeArea from './components/CodeArea';
import Popup from './components/Popup';

interface Command {
  index?: number;
  name: string;
  value?: number | string;
}

const App: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [currentFeature, setCurrentFeature] = useState<string>('save');


  const toggleDrawing = () => {
    setIsDrawing(prev => !prev);
  };

  const handleTutorialClick = async (tutorial: string) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/open/file',
        { path: tutorial },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.data) {
        const commandsFromTutorial: Command[] = response.data;
        setCommands(commandsFromTutorial);
        if (tutorial === 'drawing_tutorial.json') {
          setPopupMessage('Using the forward command, you can make the turtle move forward. And you can draw lines in multiple colors by coupling that with the turtle command that toggles on and off the drawing, and the color command that allows you to pick a color. Try it out!');
          setIsPopupOpen(true);
        } else if (tutorial === 'turn_tutorial.json') {
          setPopupMessage("The turtle isn't obliged to move forward all the time. You can also make it turn right or left to draw even more complex forms. Try it out!");
          setIsPopupOpen(true);
        } else if (tutorial === 'repeat_tutorial.json') {
          setPopupMessage("When writing code, using loops is very useful. The repeat commands allow you to repeat a set of commands multiple times, and so, to implement your loops. The repeat start command specifies the beginning of you loops, as well the number of iterations you want, and the repeat end specifies the end of the loop.Try it out!");
          setIsPopupOpen(true);
        }
      }
    } catch (error) {
      console.log("Couldn't open the tutorial", error);
    }
  };


  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveClick = async (input: string) => {
    const request_content = {
      name: input,
      commands: JSON.stringify(commands),
    }
    try {
      const responseProj = await axios.post(
        'http://localhost:8080/api/open/project',
        { path: 'turtessine_project'},
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      //console.log("la puta respuesta: ", responseProj);
      if (responseProj.data) {
        //console.log("el json de los cojones: " + responseProj.data);
        console.log("open the project: ", responseProj.data);
      }
      //console.log("la request del save XD: ", request_content);
      const response = await axios.post(
        'http://localhost:8080/api/save',
        //{ body: request_content },
        request_content,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.data) {
        console.log('File saved successfully');
      }
    } catch (error) {
      console.log("Couldn't save the file", error);
    }
  };

  const handleLoadClick = async (input: string) => {
    try {
      const responseProj = await axios.post(
        'http://localhost:8080/api/open/project',
        { path: 'turtessine_project'},
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (responseProj.data) {
        console.log("open the project: ", responseProj.data);
      }
      const response = await axios.post(
        'http://localhost:8080/api/load',
        { path: input },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.data) {
        const commandsFromTutorial: Command[] = response.data;
        setCommands(commandsFromTutorial);
      }
    } catch (error) {
      console.log("Couldn't load the file", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    setIsInputVisible(true);
  };

  const handleSubmitClick = (feature: string) => {
    if (feature === 'save') {
      handleSaveClick(inputValue);
      setInputValue('');
    } else if (feature === 'load') {
      handleLoadClick(inputValue);
      setInputValue('');
    }
    setIsInputVisible(false); // Hide the input field after submission
  };

  const test_endpoint = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/hello',
      );
      console.log(response.data);
    } catch (error) {
      console.log("Couldn't reach the endpoint", error);
    }
  };

  return (
    <>
      <div className="header">
         {isInputVisible && (
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter the name of the file"
          />
          <button onClick={() => handleSubmitClick(currentFeature)}>Submit</button>
        </div>
         )}
        <button onClick={() => {
          setCurrentFeature('load');
          handleButtonClick();
          }}
        >Load</button>
        <button onClick={() => {
          setCurrentFeature('save');
          handleButtonClick();
          }}
        >Save</button>
        <div className="tutorials-dropdown">
          <button>Tutorials</button>
          <div className="tutorials-dropdown-content">
            <button onClick={() => handleTutorialClick('drawing_tutorial.json')}>Drawing Tutorial</button>
            <button onClick={() => handleTutorialClick('turn_tutorial.json')}>Turn Tutorial</button>
            <button onClick={() => handleTutorialClick('repeat_tutorial.json')}>Repeat Tutorial</button>
          </div>
        </div>
      </div>
      <div className="app-container">
        <div className="canvas-container">
          <Canvas
            commands={commands}
            isDrawing={isDrawing}
            toggleDrawing={toggleDrawing}
          />
        </div>
        <div className="code-container">
          <CodeArea commands={commands} setCommands={setCommands} />
        </div>
        <div className="commands-container">
          <CommandPalette />
        </div>
        <div>
          {isPopupOpen && (
          <Popup
            message={popupMessage}
            onClose={handleClosePopup}
          />
        )}
        </div>
      </div>
    </>
  );
};

export default App;
