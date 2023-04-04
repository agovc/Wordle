import React, {useState, useRef, useEffect} from 'react';
import { createUseStyles } from 'react-jss'
import words from '/wordleResults.json';

const STATUS = {
    'empty': 'empty',
    'neutral': 'neutral',
    'incorrect': 'incorrect',
    'correct': 'correct',
    'incorrectPosition': 'incorrectPosition'
}

const getWord = () => {
    const random = Math.floor(Math.random() * words.results.length);
    return words.results[random];
}

export default function App() {
    return(<Wordle />)
}

function Wordle() {
    const initialGrid = Array(6).fill(Array(5).fill({ value: null, status: STATUS.empty}));
    const [indices, setIndices] = useState([0, 0]);
    const solution = useRef(getWord());
    const [grid, setGrid] = useState(initialGrid);

    const addLetter = e => {
        const letter = e.key.toUpperCase();

        const [currRow, currCol] = indices;

        if (currCol === 5 && currRow < 6 && letter === "ENTER") {
            setIndices([currRow + 1, 0]);
            getStatus(currRow);
        }

        if (currCol < 5 && letter.length === 1 && letter >= 'A' && letter <= 'Z') {
            const currentGrid = [...grid.map(rows => [...rows])];
            currentGrid[currRow][currCol] = {value: letter, status: STATUS.neutral};
            setGrid(currentGrid);
            setIndices([currRow, currCol + 1])
        }
    }

    const getStatus = (row) => {
        const guess = [...grid[row]];
        const wordMap = new Map();

        for (const letter of solution.current) {
            wordMap.set(letter, wordMap.get(letter) + 1 || 1);
        }

        for (let i = 0; i < guess.length; i++) {
            const currentLetter = guess[i].value;
            let newGuess = {value: currentLetter, status: STATUS.neutral};

            if (wordMap.has(currentLetter) && wordMap.get(currentLetter) > 0) {
                wordMap.set(currentLetter, wordMap.get(currentLetter) - 1);
                if (currentLetter === solution.current[i]) {
                    newGuess.status = STATUS.correct;
                } else {
                    newGuess.status = STATUS.incorrectPosition;
                }
            } else {
                newGuess.status = STATUS.incorrect;
            }

            guess[i] = newGuess;
        }

        const currentGrid = [...grid.map(rows => [...rows])]
        currentGrid[row] = guess;

        setGrid(currentGrid);
    }

    useEffect(() => {
        const [currRow, currCol] = indices;
        if (currCol === 5) {

        }
    },[indices]);

    const styles = useStyles();

    console.log(solution);

    return (
        <div tabIndex={0} onKeyDown={addLetter}>
            {grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className={styles.row}>
                        {row.map((col, colIndex) => {
                            const letter = grid[rowIndex][colIndex];
                            return <Letter status={letter.status} key={`${rowIndex}-${colIndex}`} value={letter.value} />
                        })}
                    </div>
                )
            })}
        </div>
    )
}

function Letter(props) {
    const { value, status } = props;
    const currentLetter = value ? value : " ";
    const styles = useStyles();
    return(
        <div className={[styles.letterContainer, getLetterStyles(status)].join(" ")}>{currentLetter.toUpperCase()}</div>
    )
}

const getLetterStyles = status => {
    const styles = useStyles();
    switch (status) {
        case STATUS.correct: return styles.correct;
        case STATUS.incorrect: return styles.incorrect;
        case STATUS.incorrectPosition: return styles.incorrectPosition;
        case STATUS.neutral: return styles.neutral;
        default:
            return '';
    }
}

const useStyles = createUseStyles({
    letterContainer: {
        width: 40,
        height: 40,
        fontSize: 25,
        fontWeight: 800,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 3,
        border: '1px lightgray solid',
        fontFamily: "sans-serif",
    },
    neutral: {
        border: '1px gray solid',
    },
    row: {
        display: "flex",
    },
    correct: {
        backgroundColor: "#6aaa64",
        border: '1px #6aaa64 solid',
        color: "white"
    },
    incorrect: {
        backgroundColor: "gray",
        border: '1px gray solid',
        color: "white"
    },
    incorrectPosition: {
        backgroundColor: "#c9b458",
        border: '1px #c9b458 solid',
        color: "white"
    }
})