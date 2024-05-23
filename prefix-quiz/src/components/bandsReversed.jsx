import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormGroup } from '@mui/material';
import { useRef, useState } from "react";

const BandsReversed = function ({ data }) {
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
    const { frequency, wavelength } = data[index];

    setCorrectAnswer(`${wavelength}`);
    setQuestion(`${frequency}`);
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
          <p>What is the nominal wavelength of the band with nominal frequency of <strong>{question}</strong> MHz?</p>
          <FormGroup row>
            <TextField
              inputRef={(ref) => (answerFieldRef.current = ref)}
              id="outlined-basic"
              label="Your answer (m)"
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

export default BandsReversed;
