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
    x.split(" ").map((y) => y.toLowerCase())
  );

  const guess = (e) => {
    const guessWord = ref.current.value;
    ref.current.value = "";
    console.log("guess word is", guessWord);
    if (selectedWords.includes(guessWord.toLowerCase())) {
      setGuesses((prev) => [...prev, { ok: true, guessWord }]);
    } else {
      setGuesses((prev) => [...prev, { ok: false, guessWord }]);
    }
  };
  return (
    <div className="App">
      {
        <div class="app">
          <div style={{ fontSize: 60 }}>{selected}</div>
          <div>{`${words[selected].length} words`}</div>
          <div class="input-button">
            <input ref={ref} />
            <button onClick={(e) => guess(e.target.value)}>guess</button>
          </div>
          <div class="guess-list">
            {guesses.map(({ ok, guessWord }) => {
              return (
                <div style={{ background: ok ? "green" : "red" }}>
                  {guessWord}
                </div>
              );
            })}
          </div>
          <button onClick={setAnswers}>Show Answers</button>
          {answers ? <div>{words[selected].join(",")}</div> : null}
        </div>
      }
    </div>
  );
}
