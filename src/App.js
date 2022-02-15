import React, { useEffect } from "react";
import { nanoid } from "nanoid";
import Die from "./Die";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [attemp, setAttemp] = React.useState(0);

  //const [record, setRecord] = React.useState(100);

  const rec = parseInt(localStorage.getItem("record"));
  // console.log("RECORD " + rec);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      console.log("HAI VINTO");
    }
  }, [dice]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDice());
    }
    return newDice;
  }

  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDice();
        })
      );
      setAttemp((oldAttemp) => oldAttemp + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      isNewRecord();
      setAttemp(0);
    }
  }

  function isNewRecord() {
    if (attemp < rec) localStorage.setItem("record", JSON.stringify(attemp));
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <div className="main">
      {tenzies && <Confetti />}
      <h1>Tenzies</h1>
      <p>
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <p>Attemps: {attemp}</p>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <p>Record: {rec === 10000 ? "Try" : rec}</p>
    </div>
  );
}

export default App;
