import { useMemo, useRef, useState, useEffect } from "react";
import "./styles.css";
import words from "./words.json";

function rint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getQ = (p)=> {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(p);
}

const setQ = (p, v)=> {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(p, v);
  history.replaceState({}, '', `${location.pathname}?${urlParams}`)
}


export default function App() {
  const keys = useMemo(() => Object.keys(words), [words]);
  const qidx = getQ('idx');
  const [idx, setIdx] = useState(qidx && Number(qidx) ? Number(qidx) : rint(0, keys.length - 1));
  useEffect(()=>{
    setQ('idx', idx);
  }, [idx])
  const ref = useRef();
  const [answers, setAnswers] = useState();
  const [guesses, setGuesses] = useState([]);
  
  

  const selected = keys[idx];
  const selectedWords = words[selected].flatMap((x) =>
    [...x.split(" ").map((y) => y.toLowerCase()), x]
  );

  const guess = (e) => {
    const guessWord = ref.current.value;
    ref.current.value = "";

    if (!guessWord.trim()) {
      return;
    }
    
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
                <span className="guess" style={{ background: ok ? partial ? "#FCEAAF" : "#7DDAD9" : "#F598AA" }}>
                  {guessWord}
                </span>
              );
            })}
          </div>
          <button role="button" class="answers-button secondary" onClick={setAnswers}>Show Answers</button>
          <div className="answers">{answers ? words[selected].map(x => <span className="answer">{x}</span>) : null}</div>
          <button role="button" class="new-game-button secondary" onClick={()=>{
            setGuesses([]);
            setAnswers(false);
            setIdx(rint(0, keys.length - 1));
          }}>New Game</button>
        </div>
      }
    </div>
  );
}
