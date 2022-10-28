import React from 'react'
import Confetti from 'react-confetti'
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
        console.log(newGame)
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

//generate winning status text
    function getWinningText(){
        let showBest = true
        const tries =  `${numAttempts} ${numAttempts === 1 ? "try":"tries"}` 
        const bestScore = `Best Score: ${highScore}`
        let message = "Let's play!"
        if (tenzies){
            const status = `You got Tenzies in ${tries}` 
            if (highScore >= numAttempts) {
                message = `New BEST Score! ${status}!`
                showBest = false
            } else {
                message = `Good try! ${status}. ` 
                showBest = true
            }
        } else {
            message = `No luck yet after ${tries}`
            showBest = true
        }
        return (
            <p className="main--status"> 
                {message} 
                {showBest && <br />}
                {showBest && <i>{bestScore}</i>}
            </p> 
        )

    }

    return (
        <main className="main--container">
            {tenzies &&  <Confetti />}
            <h1>Tenzies!</h1>
            <p className="main--instructions">Roll until all TEN dice have the same number. Click on a die to lock it into that number.</p>
            {getWinningText()}
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


