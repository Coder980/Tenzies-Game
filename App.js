import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [startTime, setStartTime] = React.useState(new Date())
    const [bestTime, setBestTime] = React.useState(
        localStorage.getItem("time") ?
            JSON.parse(localStorage.getItem("time")) :
            "N/A" 
    )
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            updateBestTime((new Date() - startTime) / 1000)
            setTenzies(true)
        }
    }, [dice])
    
    function updateBestTime(time) {
        if (bestTime === "N/A" || time < bestTime) {
            setBestTime(time)
            localStorage.setItem("time", JSON.stringify(time))
        } 
    }

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRolls(oldRolls => oldRolls + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            newGame()
        }
    }
    
    function newGame() {
        setTenzies(false)
        setDice(allNewDice())
        setRolls(0)
        setStartTime(new Date())
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            {tenzies && <h2 className="rolls-txt">Rolls: {rolls}</h2>}
            {tenzies && <h2 className="time-txt">Time: {(new Date() - startTime) / 1000} seconds</h2>}
            {
                tenzies && 
                bestTime !== "N/A" && 
                <h2 className="best-time-txt">Best Time: {bestTime} seconds</h2>
            }
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}