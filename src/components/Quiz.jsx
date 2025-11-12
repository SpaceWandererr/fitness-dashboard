import React, { useState } from "react";

const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyperlinks and Text Markup Language",
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyper Tag Markdown Language",
    ],
    answer: "Hyper Text Markup Language",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Python", "Java", "C", "JavaScript"],
    answer: "JavaScript",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style System",
      "Cascading Style Sheets",
      "Colorful Style Syntax",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question: "Which of the following is a JavaScript framework?",
    options: ["Django", "Flask", "React", "Laravel"],
    answer: "React",
  },
];

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerClick = (option) => {
    setSelected(option);
    if (option === questions[current].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowScore(true);
      }
    }, 700);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowScore(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-gray-100">
      <div className="w-full max-w-md bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-emerald-600/30">
        <h1 className="text-2xl font-semibold text-center text-emerald-400 mb-4">
          🧠 Web Dev Quiz
        </h1>

        {showScore ? (
          <div className="text-center">
            <h2 className="text-xl mb-4">
              You scored{" "}
              <span className="text-emerald-400 font-bold">{score}</span> out of{" "}
              {questions.length} 🎉
            </h2>
            <button
              onClick={restartQuiz}
              className="px-4 py-2 mt-2 bg-emerald-600 hover:bg-emerald-500 rounded-md transition"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-medium mb-4">
              {current + 1}. {questions[current].question}
            </h2>
            <div className="flex flex-col gap-3">
              {questions[current].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerClick(option)}
                  className={`px-4 py-2 rounded-md border transition-all ${
                    selected
                      ? option === questions[current].answer
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : option === selected
                        ? "bg-red-600/80 border-red-500 text-white"
                        : "bg-gray-700/40 border-gray-600"
                      : "bg-gray-700/30 border-gray-600 hover:bg-gray-700/50"
                  }`}
                  disabled={selected !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Question {current + 1} of {questions.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
