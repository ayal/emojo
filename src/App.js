import { useMemo, useRef, useState } from "react";
import "./styles.css";
import words from "./words.json";

function rint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function App() {
  const ref = useRef();
  const [answers, setAnswers] = useState();
  const [guesses, setGuesses] = useState([]);
  const keys = useMemo(() => Object.keys(words), [words]);
  const idx = useMemo(() => rint(0, keys.length - 1), [keys]);

  const selected = keys[idx];
  const selectedWords = words[selected].flatMap((x) =>
    [...x.split(" ").map((y) => y.toLowerCase()), x]
  );

  const guess = (e) => {
    const guessWord = ref.current.value;
    ref.current.value = "";
    console.log("guess word is", guessWord);
    let ok = false;
    let partial = false;
    for (const sWord of selectedWords) {
      if (sWord === guessWord.toLowerCase()) {
        ok = true;
        partial = false;
        break;
      }
      else if (sWord.indexOf(guessWord) === 0) {
        ok = true;
        partial = true;
      }
    }
    setGuesses((prev) => [...prev, { ok, guessWord, partial }]);
  };
  return (
    <div className="App">
      {
        <div className="app">
          <div style={{ fontSize: 60 }}>{selected}</div>
          <div>{`${words[selected].length} words`}</div>
          <div className="input-button">
            <input ref={ref} onKeyDown={(e) => e.key === 'Enter' && guess()} />
            <button onClick={(e) => guess()}>guess</button>
          </div>
          <div className="guess-list">
            {guesses.map(({ ok, partial, guessWord }) => {
              return (
                <div className="guess" style={{ background: ok ? partial ? "yellow" : "green" : "red" }}>
                  {guessWord}
                </div>
              );
            })}
          </div>
          <button onClick={setAnswers}>Show Answers</button>
          <div className="answers">{answers ? words[selected].map(x => <span className="answer is-small">{x}</span>) : null}</div>
        </div>
      }
    </div>
  );
}
