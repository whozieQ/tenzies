import React from 'react'
import Die from './Die'


//this function isn't specific to the App component
function rollDie(){
    const num = Math.floor(Math.random() * 6) + 1
    return num
}

export default function App() {

    const numDice = 10
    const [numAttempts, setNumAttempts] = React.useState(1)
//create single die object with new die roll
    function getNewDie(){
        return  { 
            value: rollDie(), 
            locked: false 
        }
    }
//populate default array with die objects containing random dice roll values
    const [diceArray, setDiceArray] = React.useState(
        Array.from({length:numDice}, ()=> getNewDie())
    )

// re-rolls the value for each unlocked die in the array
//and updates the number of rolls count
    function rollUnlockedDice(newGame){
        setDiceArray(oldArray => oldArray.map(die => {
            return !newGame && die.locked ? die : getNewDie()
        }))
        newGame ? setNumAttempts(1) : setNumAttempts(prevAttempts => prevAttempts + 1)
    }

// count the number of array items that matches the value in the first item
// if all 10 match it -- we have tenzies, otherwise, we don't
    const [tenzies, setTenzies] = React.useState(false)
    React.useEffect( ()=>{
        setTenzies(diceArray.filter( dice => dice.value === diceArray[0].value)
            .length === numDice ? true : false)
        }
        ,[diceArray])

    const [highScore, setHighScore] = React.useState(JSON.parse(localStorage.getItem("tenzies")) || 1000)

    React.useEffect(()=>{
        console.log(highScore)
        console.log(numAttempts)
        if (tenzies && (highScore > numAttempts)){
                console.log(`Updating best score from ${highScore} to ${numAttempts}`)
                localStorage.setItem("tenzies",JSON.stringify(numAttempts))
                setHighScore(numAttempts)
            }
        }
        ,[tenzies]
    )
// clicking on a die will toggle the locked state for that die 
    function handleClick(diceId) {
        setDiceArray(oldArray => oldArray.map( (die, id) => {
            return diceId === id ? {...die, locked: !die.locked} : die
        }))
    }

// generate the list of Die components, one for each item in the diceArray
    function getDieElements(){
        return diceArray.map( (item, i) => {
            return <Die onClick={()=>handleClick(i)} value={item.value} locked={item.locked} key={i}/>
        })
    }


    return (
        <main className="main--container">
            <h1>Tenzies!</h1>
            <p className="main--instructions">Roll until all TEN dice have the same number. Click on a die to lock it into that number.</p>
            <p className="main--status"> {tenzies ? "You got Tenzies in " : "No luck yet after "}{numAttempts} {numAttempts === 1 ? "try":"tries"}<br/><i>Best Score: {highScore}</i></p>
            <div className="dice--container">
                {getDieElements()} 
            </div>
            {tenzies ? 
                <button className="rollDice" onClick={()=>rollUnlockedDice(true)}>New Game</button> :
                <button className="rollDice" onClick={()=>rollUnlockedDice(false)}>Roll</button>
                }
        </main>
    )
}


