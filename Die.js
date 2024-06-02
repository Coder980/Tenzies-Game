import React from "react"
import {dotPositionMatrix} from "./diceData"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    
    function createDieDots(number) {
        return dotPositionMatrix[number].map(dotPosition => {
            return (
                <div
                    className="dice-dot"
                    style={{
                        "--top": `${dotPosition[0]}%`,
                        "--left": `${dotPosition[1]}%`
                    }}
                ></div>
            )
        })
    }
    
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {createDieDots(props.value)}
        </div>
    )
}