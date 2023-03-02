document.addEventListener("DOMContentLoaded", () => {
    //INIT
    const squares = document.querySelectorAll('.grid div')
    const scoreDisplay = document.querySelector('span')
    const startBtn = document.querySelector('.start')

    const width = 10 //depends on the width of the grid. 
    let currentIndex = 0
    let appleIndex = 0
    let currentSnake = [2, 1, 0]
    let direction = 1 // 1->right, width->down, -width->up, -1->left 
    let score = 0
    let speed = 0.95 //define the level of speed we increase after everymove
    let intervalTime = 0
    let interval = 0
    
    //START
    function startGame() {
        currentSnake.forEach(index => squares[index].classList.remove('snake'))
        squares[appleIndex].classList.remove('apple')
        clearInterval(interval) //info: https://developer.mozilla.org/en-US/docs/Web/API/clearInterval
        score = 0 //initialize score
        randomApple() //create 1st apple
        direction = 1 //initial direction is right
        scoreDisplay.innerText = score
        intervalTime = 1000 // 1000ms interval Time for us
        currentSnake = [2, 1, 0] //initial snake
        currentIndex = 0
        currentSnake.forEach(index => squares[index].classList.add('snake')) //init: add the snake in the game
        interval = setInterval(movesSnake, intervalTime) //https://developer.mozilla.org/en-US/docs/Web/API/setInterval
    }
    //MOVES
    function movesSnake() {

        //result when hitting borders of grid and self
        if (
            (currentSnake[0] + width >= (width * width) && direction === width) || //hit floor/bottom wall
            (currentSnake[0] % width === (width - 1) && direction === 1) || //hit right wall
            (currentSnake[0] % width === 0 && direction === -1) || //hit leftwall
            (currentSnake[0] - width < 0 && direction === -width) || //hit ceiling/top wall
            squares[currentSnake[0] + direction].classList.contains('snake') //if the direction square has/contains 'snake', namely itself, then it hits itself
        ) 
        {
            return clearInterval(interval)
        }

        const tail = currentSnake.pop() // remove last item of the array
        squares[tail].classList.remove('snake') //removes class of snake from TAIL
        currentSnake.unshift(currentSnake[0]+direction) //gives direction to the head of the array. Unshift: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift

        //result when snake eats an apple
        if (squares[currentSnake[0]].classList.contains('apple'))
        {
            squares[currentSnake[0]].classList.remove('apple')
            squares[tail].classList.add('snake')
            currentSnake.push(tail)
            randomApple() //create new apple, right after the one is eaten
            score++
            scoreDisplay.textContent = score //display current score
            clearInterval(interval)
            intervalTime = intervalTime * speed //we drop the interval between every move, therefore the Game becomes faster
            interval = setInterval(movesSnake, intervalTime)
            
        }
        squares[currentSnake[0]].classList.add('snake')
    }

    function randomApple()
    {
        do {
            appleIndex = Math.floor(Math.random() * squares.length)
        } while(squares[appleIndex].classList.contains('snake')) //pick new apple square until it is not on a square where the snake exists
        squares[appleIndex].classList.add('apple')//create apple, namely draw this square
    }
    //CONTROL
    function controlDirection(e) {
        squares[currentIndex].classList.remove('snake')
        //Snake cannot move towards opposite-to-current direction 
        if (e.keyCode === 39 && direction !== -1) { //i.e. from right cannot change directly to left
            direction = 1 //right-arrow
        } else if (e.keyCode === 38 && direction !== +width) {
            direction = -width //up-arrow
        } else if (e.keyCode === 37 && direction !== 1) {
            direction = -1 //left-arrow
        } else if (e.keyCode === 40 && direction !== -width) {
            direction = +width //down-arrow 
        }
    }

    //listener keyup
    document.addEventListener('keyup', controlDirection) //when release the fired 'key', run function control(...){...}
    //listener startButton
    startBtn.addEventListener('click', startGame) //when click 'Start', then run function startGame(...){...}
})