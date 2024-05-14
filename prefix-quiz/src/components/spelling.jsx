import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormGroup } from '@mui/material';
import { useRef, useState } from "react";
import Speech from "speak-tts";

const tableEn = {
  0: 'Zero',
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  A: "Alpha",
  B: "Bravo",
  C: "Charlie",
  D: "Delta",
  E: "Echo",
  F: "Foxtrot",
  G: "Golf",
  H: "Hotel",
  I: "India",
  J: "Juliet",
  K: "Kilo",
  L: "Lima",
  M: "Mike",
  N: "November",
  O: "Oscar",
  P: "Papa",
  Q: "Quebec",
  R: "Romeo",
  S: "Sierra",
  T: "Tango",
  U: "Uniform",
  V: "Victor",
  W: "Whiskey",
  X: "X-ray",
  Y: "Yankee",
  Z: "Zulu",
};

function getRandomChar(keys) {
  return keys[Math.floor(Math.random() * keys.length)];
}

function getRandomCharList(keys, length) {
  const chars = [];

  for (let i = 0; i < length; i += 1) {
    chars.push(getRandomChar(keys));
  }

  return chars.join("");
}

let voices = [];

const speech = new Speech();
speech
  .init({
    volume: 0.5,
    lang: "en-GB",
    rate: 1,
    pitch: 1,
    //'voice':'Google UK English Male',
    //'splitSentences': false,
  })
  .then((data) => {
    console.log("Speech is ready", data);
    voices = data.voices;
    //   _prepareSpeakButton(speech);
  })
  .catch((e) => {
    console.error("An error occured while initializing : ", e);
  });

function convertToSpelling(table, str) {
    console.log('voices', voices)
  const words = [];
  for (const char of str.split("")) {
    if (table[char] != null) {
      words.push(table[char]);
    } else {
      words.push(char);
    }
  }

  return words.join(" ");
}

const Spelling = function ({ data, primaryPrefixMap }) {
  const keys = Object.keys(primaryPrefixMap);
  const alphabet = Object.keys(tableEn);
  const [question, setQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [missed, setMissed] = useState([]);

  const answerFieldRef = useRef(null);

  const generateQuestion = () => {
    setIsAnswerCorrect(null);

    if (answerFieldRef.current != null) {
      answerFieldRef.current.value = null;
    }

    const index = Math.floor(Math.random() * data.length);
    const prefix = keys[index];
    let digit = Math.floor(Math.random() * 11);
    const characters = getRandomCharList(alphabet.slice(10, alphabet.length), 3);

    const answer = prefix + `${digit}` + characters;
    const spelled = convertToSpelling(tableEn, answer);

    setQuestion(spelled);
    setCorrectAnswer(answer);
    setIsQuizStarted(true);
  };

  const submitAnswer = () => {
    const answer = answerFieldRef.current.value.trim().toLowerCase();
    const isCorrect = answer === correctAnswer.toLowerCase();
    if (!isCorrect) {
      setMissed([...missed, question]);
    }

    setIsAnswerCorrect(isCorrect);
    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  return (
    <>
      {!isQuizStarted && (
        <Button variant="contained" onClick={() => generateQuestion()}>
          Start
        </Button>
      )}
      {question && (
        <>
          <p>
            Press to hear a call:{" "}
            <Button onClick={() => {
                const index = Math.floor(Math.random() * voices.length);
            const randomVoice = voices[index].name
            speech.setVoice(randomVoice)
            speech
      .speak({
        queue: false,
        voice: randomVoice,
        text: question});}}>Play</Button>
            ?
          </p>
          <FormGroup row>
            <TextField
              inputRef={(ref) => (answerFieldRef.current = ref)}
              id="outlined-basic"
              label="Your answer"
              variant="outlined"
              onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
            />
            <Button variant="contained" onClick={() => submitAnswer()}>
              Submit
            </Button>
          </FormGroup>
        </>
      )}
      {isAnswerCorrect != null && (
        <>
          {isAnswerCorrect ? (
            <p style={{ color: "lime", fontWeight: "bold", fontSize: 18 }}>
              Correct!
            </p>
          ) : (
            <p style={{ color: "red", fontWeight: "bold", fontSize: 18 }}>
              Correct answer: {correctAnswer}
            </p>
          )}
        </>
      )}
      {/* {missed.length > 0 && <p>Wrong answers: {missed.join(",")}</p>} */}
    </>
  );
};

export default Spelling;
