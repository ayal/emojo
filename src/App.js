import { useMemo, useRef, useState, useEffect } from "react";
import "./styles.css";
import words from "./words.json";

window.__words = words;

const uniq = (arr) => arr.filter(function (x, index) {
  return arr.indexOf(x) === index;
});

function rint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getQ = (p) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(p);
}

const setQ = (p, v) => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get(p) !== v) {
    urlParams.set(p, v);
    history.pushState({}, '', `${location.pathname}?${urlParams}`)
  }
}


export default function App() {
  const keys = useMemo(() => Object.keys(words), [words]);
  const qidx = getQ('idx');
  const [idx, setIdx] = useState(qidx && Number(qidx) ? Number(qidx) : rint(0, keys.length - 1));
  useEffect(() => {
    setQ('idx', idx);
  }, [idx])
  useEffect(() => {
    window.onpopstate = function (e) {
      setGuesses([]);
      setAnswers(false);
      const qidx = getQ('idx');
      if (qidx !== idx) {
        setIdx(qidx);
      }
    };
  }, [])
  const ref = useRef();
  const [answers, setAnswers] = useState();
  const [guesses, setGuesses] = useState([]);



  const emoji = keys[idx];
  const legitWords = uniq(words[emoji].flatMap((x) =>
    [...x.split(" ").map((y) => y.toLowerCase()), x]
  ));
  const answerWords = uniq(words[emoji].flatMap((x) =>
    [...x.split(" ").map((y) => y.toLowerCase())]
  ));

  const guess = (e) => {
    const guessWord = ref.current.value.trim();
    ref.current.value = "";

    if (!guessWord) {
      return;
    }

    let ok = false;
    let partial = false;
    for (const sWord of legitWords) {
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

    <div className="app">
      <div style={{ fontSize: 60 }}>{emoji}</div>
      <div className="input-button">
        <input ref={ref} onKeyDown={(e) => e.key === 'Enter' && guess()} />
        <button onClick={(e) => guess()}>Guess Word</button>
      </div>
      <div className="guess-list">
        {guesses.map(({ ok, partial, guessWord }) => {
          return (
            <span key={guessWord} className="guess" style={{ background: ok ? partial ? "#FCEAAF" : "#7dda9a" : "#F598AA" }}>
              {guessWord}
            </span>
          );
        })}
      </div>
      <button role="button" className="answers-button secondary" onClick={setAnswers}>Show Answers</button>
      <div className="answers">{answers ? answerWords.map(x => <span key={x} className="answer">{x}</span>) : null}</div>
      <button role="button" className="new-game-button secondary" onClick={() => {
        setGuesses([]);
        setAnswers(false);
        setIdx(rint(0, keys.length - 1));
      }}>New Emojo</button>
    </div>
  );
}
