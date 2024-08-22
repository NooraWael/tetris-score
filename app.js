//add the main event listener
document.addEventListener('DOMContentLoaded', () => {
    //find the div grid
const grid = document.querySelector('.grid')


//make all the squares an array so we can work with them
let squares = Array.from(document.querySelectorAll('.grid div'))

//get the score and start button tags
const ScoreDisplay = document.querySelector('#score')
const StartBtn = document.querySelector('#start-button')
const PauseBtn = document.querySelector('#pause-button');
const restartBtn = document.querySelector('#restart-button');
const LivesDisplay = document.querySelector('#lives-count');
let finalScore = 0
let lives = 3;
let score = 0
let timerId
let speed = 15; // Lower number = faster movement (60 fps / speed)
let moveSpeed = 150;
let framesCount = 0;
let startTime = null; // Variable to hold start time
let pausedTime = 0;
let timerInterval = null;
const TimerDisplay = document.querySelector('#timer');

const lowScoreGif = "https://media.giphy.com/media/2Vppv6nEFbPD7B3uvb/giphy.gif"; // Below 50
const mediumScoreGif = "https://media.giphy.com/media/y0NFayaBeiWEU/giphy.gif"; // 50-99
const highScoreGif = "https://media.giphy.com/media/aEZgmm8GEL7cdMGx5t/giphy.gif"; // Above 100
const lineClearSound = document.getElementById('lineClearSound');
let isPaused2 = false;


//add the main event listener
document.addEventListener('DOMContentLoaded', () => {
    //find the div grid
const grid = document.querySelector('.grid')

   
//make all the squares an array so we can work with them
let squares = Array.from(document.querySelectorAll('.grid div'))

//get the score and start button tags
const ScoreDisplay = document.querySelector('#score')
const StartBtn = document.querySelector('#start-button')
const PauseBtn = document.querySelector('#pause-button');
const restartBtn = document.querySelector('#restart-button');
const LivesDisplay = document.querySelector('#lives-count');
let finalScore = 0
let lives = 3;
let score = 0
let timerId
let speed = 15; // Lower number = faster movement (60 fps / speed)
let moveSpeed = 150;
let framesCount = 0;
let startTime = null; // Variable to hold start time
let pausedTime = 0;
let timerInterval = null;
const TimerDisplay = document.querySelector('#timer');

const lowScoreGif = "https://media.giphy.com/media/2Vppv6nEFbPD7B3uvb/giphy.gif"; // Below 50
const mediumScoreGif = "https://media.giphy.com/media/y0NFayaBeiWEU/giphy.gif"; // 50-99
const highScoreGif = "https://media.giphy.com/media/aEZgmm8GEL7cdMGx5t/giphy.gif"; // Above 100
const lineClearSound = document.getElementById('lineClearSound');
let isPaused2 = false;
    // Function to start the timer
    function startTimer() {
        if(!startTime){
            startTime = Date.now(); // Set start time to current timestamp
        }

        if(pausedTime) {
            startTime = Date.now() - pausedTime
        }
       

        // Update timer display every second
        timerInterval = setInterval(updateTimer, 1000);
    }

   // Function to stop the timer
   function stopTimer() {
    clearInterval(timerInterval); // Clear interval
}
       // Function to update the timer display
       function updateTimer() {
        const currentTime = Date.now() - startTime; // Calculate elapsed time in milliseconds
        const seconds = Math.floor((currentTime / 1000) % 60); // Calculate seconds
        const minutes = Math.floor(currentTime / (1000 * 60)); // Calculate minutes

        TimerDisplay.innerHTML = `Time: ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Update timer display
    }
    const colors = [
        'salmon',        // Darker orange
        'mediumorchid',   // Darker purple
        'skyblue',       // Darker blue
        'seagreen',      // Darker green
        'plum'           // Darker lavender
      ]

    //final width
    const width = 10

    //for displaying the next tetromino 
    let nextRandom = 0

    //L tetris
    const lTetromino = [
        [1, width +1, width*2+1 ,2],
        [width, width +1, width+2, width*2+2],
        [1,width+1, width*2+1,width*2],
        [width, width*2,width*2+1,width*2+2]
    ]

    //z tetris
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      // t tetris
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      //o tetris
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      //i tetris
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]

      const allOfthem = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]
    
   

      //starting point
      let currentPosition = 4;
      let currentRotation = 0;

      //random selection using Math.random
      let random = Math.floor(Math.random()*allOfthem.length)
      
      
      let current = allOfthem[random][currentRotation]
      let currentTetrimino = allOfthem[random]

    //draw 
    function draw(){
        current.forEach(index => {
            squares[currentPosition +index].classList.add('tetromino')
            squares[currentPosition +index].style.backgroundColor = colors[random]
        })
    }

   //undraw 
   function undraw(){
    current.forEach(index => {
        squares[currentPosition +index].classList.remove('tetromino')
        squares[currentPosition +index].style.backgroundColor = ''
    })
   }



    let isMovingLeft = false;
let isMovingRight = false;
let isRotating = false;
isMovingDown = false; 

function control(e) {
  if (e.keyCode === 37 || e.keyCode === 65) { // Left arrow or 'A'
    isMovingLeft = true;
  } else if (e.keyCode === 39 || e.keyCode === 68) { // Right arrow or 'D'
    isMovingRight = true;
  } else if (e.keyCode === 40 || e.keyCode === 83) { // Down arrow or 'S'
    // No flag needed, handled in animate
    isMovingDown = true;
  } 
}

function keyupControl(e) {
  if (e.keyCode === 37 || e.keyCode === 65) { // Left arrow or 'A'
    isMovingLeft = false;
  } else if (e.keyCode === 39 || e.keyCode === 68) { // Right arrow or 'D'
    isMovingRight = false;
  } else if (e.keyCode === 40 || e.keyCode === 83) {
    isMovingDown = false;
  } else if(e.keyCode === 38){
    if (!isRotating) {
      isRotating = true;
    }
  }
}



    document.addEventListener('keydown', control);
    document.addEventListener('keyup', keyupControl);

   function moveDown(){
    if (isPaused()) return;
    undraw()
  // Check if the tetromino can move down
  if (!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    currentPosition += width;
  }
    draw()
    freeze()
   }


   //to make sure tetromino doesnt go off the grid
   function freeze(){
    if(current.some(index => squares[currentPosition + index + width ].classList.contains('taken'))){
        current.forEach(index =>squares[currentPosition + index  ].classList.add('taken'))
        //start new tetromino
        random = nextRandom
        nextRandom = Math.floor(Math.random()*allOfthem.length)
        current = allOfthem[random][currentRotation]
        currentTetrimino = allOfthem[random]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
      
        gameOver()
    }
   }



   //function to move to the left
   function moveLeft(){
    if (isPaused()) return;
    undraw()
    //checking if there is no remainder when moduled with width
    const isAtEdge = current.some(index=> (currentPosition + index) % width === 0)

    if(!isAtEdge){
        currentPosition -= 1
    }


    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }

    draw()
   }

   function moveRight(){
    if (isPaused()) return;
    undraw()
    const isAtEdge = current.some(index=> (currentPosition + index) % width === width -1)

    if(!isAtEdge){
        currentPosition += 1
    }

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
    draw()
   }
   function canRotate() {
    const nextRotationIndex = (currentRotation + 1) % currentTetrimino.length;
    const nextRotation = currentTetrimino[nextRotationIndex];

    for (let i = 0; i < nextRotation.length; i++) {
      const newPosition = currentPosition + nextRotation[i];
      if (
        newPosition >= squares.length || // Out of bounds
        squares[newPosition].classList.contains('taken') // Blocked by another piece
      ) {
        return false;
      }
    }

    return true;
  }
   function rotate(){
    if (isPaused()) return;
      
    if (currentTetrimino === iTetromino && currentRotation % 2 === 0) {
      console.log("it works")
      const leftPositions = [
        currentPosition - 1,
        currentPosition + width - 1,
        currentPosition + 2 * width - 1,
        currentPosition + 3 * width - 1
      ];

      const rightPositions = [
        currentPosition + 1,
        currentPosition + width + 1,
        currentPosition + 2 * width + 1,
        currentPosition + 3 * width + 1
      ];

      const leftObstacle = leftPositions.some(pos => pos >= 0 && squares[pos].classList.contains('taken'));
      const rightObstacle = rightPositions.some(pos => pos < squares.length && squares[pos].classList.contains('taken'));

      if (leftObstacle && rightObstacle) {
        // Prevent rotation if there's an obstacle on both sides
        return;
      }
    }

    if (!canRotate()){
      return
    }

    undraw()
    currentRotation ++
    if(currentRotation === current.length){
        currentRotation = 0 
    }
    current = allOfthem[random][currentRotation]
    isPaused2 = true
    checkRotatedPosition()
    isPaused2 = false
    draw()
   }

   function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }

   //show next
   const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
   let displayIndex = 0


   //array of teteriminos only first rotation
   const upNextTetrominoes =
   [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
   ]

    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
          square.classList.remove('tetromino')
          square.style.backgroundColor = ''
    
        })
        upNextTetrominoes[nextRandom].forEach( index => {
          displaySquares[displayIndex + index].classList.add('tetromino')
          displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
         
        })
      }

      StartBtn.addEventListener('click', () => {
        playBackgroundMusic();
        if (!timerId) {
            draw();
            animate();  
            startTimer();
            nextRandom = Math.floor(Math.random() * allOfthem.length);
            displayShape();
        }
    });

    PauseBtn.addEventListener('click', () => {
        if (timerId) {
            cancelAnimationFrame(timerId);
            stopTimer();
            timerId = null;
            pausedTime = Date.now() - startTime;
            pause()
        }
    });

    let speed2 = 3;
    function animate() {
        if (isPaused2) return; // Early exit if paused
      
        timerId = requestAnimationFrame(animate);
        framesCount++;
      
        // Handle movement based on flags
        if (isMovingLeft && framesCount % speed2 === 0) {
          moveLeft();
          return
        }else 
        if (isMovingRight  && framesCount % speed2 === 0 ) {
          moveRight();
          return
        }else if(isMovingDown && framesCount % speed2 === 0){
            moveDown();
            return
        }else if (isRotating && !isMovingLeft && !isMovingRight && !isMovingDown ) { // Prevent conflicts
          rotate();
          isRotating = false; // Reset flag after rotation
          return
        }else if (framesCount % speed === 0) {
          moveDown(); // Move down as usual
          return
        }
      }
      

      function addScore() {
        for (let i = 0; i < 199; i += width) {
            // Define a row as an array of indices
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
    
            // Check if the row is fully occupied
            if (row.every(index => squares[index].classList.contains('taken'))) {
                // Update the score and display it
                score += 10;
                if (score < 50) {
                    document.getElementById('levegif').src = lowScoreGif;
                  } else if (score < 100) {
                    document.getElementById('levegif').src = mediumScoreGif;
                  } else {
                    document.getElementById('levegif').src = highScoreGif;
                  }
                  showLevelGif();
                  simulateLineClear()
                ScoreDisplay.innerHTML = score;
    
                // Clear the row by removing the 'taken' class
                row.forEach(index => {squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            });
    
                // Remove the cleared row from the squares array
                const squaresRemoved = squares.splice(i, width);
    
                // Add the removed row to the start of the squares array
                squares = squaresRemoved.concat(squares);
    
                // Reattach the squares to the grid in their new order
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }
    
      // Function to check game over condition
      function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            lives--;
            updateLivesDisplay();
            LivesDisplay.innerHTML = lives
            if (lives <= 0) {
                ScoreDisplay.innerHTML = 'Game Over';
                
                cancelAnimationFrame(timerId); // Cancel animation frame
                clearInterval(timerId); // Clear interval
                const modal = document.getElementById('game-over-modal');
                modal.style.display = 'block'; // Display game over modal

                // Add event listener to restart button in modal
                const restartBtnModal = document.getElementById('restart-button-modal');
                restartBtnModal.addEventListener('click', () => {
                    modal.style.display = 'none'; // Hide modal
                    restartGame(true); // Restart game with score reset
                });

                // Add event listener to close button in modal
                const closeModal = document.getElementsByClassName('close')[0];
                closeModal.addEventListener('click', () => {
                    modal.style.display = 'none'; // Hide modal
                });
            } else {
                restartGame(false); // Restart game without resetting score
            }
        }
    }

    function restartGame(resetScore) {
        cancelAnimationFrame(timerId);
        clearInterval(timerId);
        timerId = null;
        for (let i = 0; i < 200; i++) {
            squares[i].classList.remove('taken');
            squares[i].classList.remove('tetromino');
            squares[i].style.backgroundColor = '';
        }
        if (resetScore) {
            score = 0 // Reset score if resetScore is true
            lives = 3
            LivesDisplay.innerHTML = 3
            updateLivesDisplay()
            stopTimer()
            timerInterval = null
            timerId = null
            startTime = null // Reset the start time
            pausedTime = null // Reset paused time
            TimerDisplay.innerHTML = 'Time: 00:00' // Reset timer display
            startTimer()
            
        }

        
        ScoreDisplay.innerHTML = score;
        currentPosition = 4;
        currentRotation = 0;
        random = Math.floor(Math.random() * allOfthem.length);
        current = allOfthem[random][currentRotation];
        draw();
        displayShape();
        if (!timerId) {
            animate()
           
        }
    }

   

    restartBtn.addEventListener('click', () => {
        cancelAnimationFrame(timerId);
        clearInterval(timerId);
        stopTimer()
        timerId = null;
        startTime = null; // Reset the start time
        pausedTime = null; // Reset paused time
        TimerDisplay.innerHTML = 'Time: 00:00'; // Reset timer display
        timerInterval = null
        startTimer()
        for (let i = 0; i < 200; i++) {
            squares[i].classList.remove('taken');
                squares[i].classList.remove('tetromino');
                squares[i].style.backgroundColor = '';
            
        }
        // Reset variables
        score = 0;
        lives = 3
        updateLivesDisplay()
        ScoreDisplay.innerHTML = score;
        LivesDisplay.innerHTML = lives;
        //starting point
         currentPosition = 4;
         currentRotation = 0;
  
        //random selection using Math.random
         random = Math.floor(Math.random()*allOfthem.length)
        
        
         current = allOfthem[random][currentRotation]
    
        // Redraw initial tetromino and display shape
        draw();
        displayShape();
        if (!timerId) {
            animate()
        }
    });


    function isPaused() {
        return !timerId; // Returns true if timerId is null (paused)
    }

    function updateLivesDisplay() {
        const hearts = document.querySelectorAll('.heart');
        for (let i = 0; i < 3; i++) {
            hearts[i].style.visibility = i < lives ? 'visible' : 'hidden';
        }
    }

         // Function to play background music
         function playBackgroundMusic() {
            const backgroundMusic = document.getElementById('backgroundMusic');
            backgroundMusic.volume = 0.5; // Adjust volume (0.0 to 1.0)
            backgroundMusic.play();
        }

        function pause(){
            const backgroundMusic = document.getElementById('backgroundMusic');
            backgroundMusic.pause();
        }

        function simulateLineClear() {
            // Your Tetris game logic to detect when lines are cleared
            // Example: If a line is cleared, call playLineClearSound()
            setTimeout(() => {
                playLineClearSound();
            }, 50); // Play sound 1 second after line clear (adjust timing as needed)
        }

        function playLineClearSound() {
            lineClearSound.currentTime = 0; // Rewind to the start
            lineClearSound.play();
        }
    

        
})

function showLevelGif() {
    const gifElement = document.getElementById('levegif');
    gifElement.style.display = 'block'; // Show the GIF initially
  
    // Hide the GIF after a delay (5-10 seconds)
    setTimeout(() => {
      gifElement.style.display = 'none';
    }, Math.floor(Math.random() * (10000 - 5000)) + 5000); // Random delay between 5-10 seconds
  }


  const playerName = localStorage.getItem('playerName');
  const ws = new WebSocket('ws://localhost:8080/ws');

  ws.onopen = function() {
      console.log('Connected to the server');
      // Send player's name to the server
      ws.send(JSON.stringify({ type: 'name', name: playerName }));
  };
  ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    updateLeaderboard(data);
};

let currentPage = 1;
const pageSize = 5; // Number of scores per page
let scoresData = []; // This will hold your fetched scores

function updateLeaderboard(data) {
    scoresData = data; // Assuming data is an array of scores
    renderPage(currentPage);
}

function renderPage(page) {
    const leaderboardTable = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
    leaderboardTable.innerHTML = ''; // Clear previous rows

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageItems = scoresData.slice(startIndex, endIndex);

    pageItems.forEach((item, index) => {
      if (!item.time) {
        return; // In forEach, return acts like continue in a normal loop
    }
        let row = leaderboardTable.insertRow();
        let rankCell = row.insertCell(0);
        let nameCell = row.insertCell(1);
        let scoreCell = row.insertCell(2);
        let timeCell = row.insertCell(3);

        rankCell.innerHTML = startIndex + index + 1;
        nameCell.innerHTML = item.name;
        scoreCell.innerHTML = item.score;
        timeCell.innerHTML = item.time;
    });

    // Update page number display
    document.getElementById('page-number').innerText = page;
}

const prevButton = document.getElementById('prevPageButton');
const nextButton = document.getElementById('nextPageButton');

prevButton.addEventListener('click', function() {
    changePage(-1);
});

nextButton.addEventListener('click', function() {
    changePage(1);
});

function changePage(direction) {
  const newPage = currentPage + direction;
  const totalPages = Math.ceil(scoresData.length / pageSize);

  if (newPage > 0 && newPage <= totalPages) {
      currentPage = newPage;
      renderPage(currentPage);
  }
}


  ws.onerror = function(error) {
      console.error('WebSocket Error:', error);
  };

  ws.onclose = function() {
      console.log('WebSocket connection closed');
  };







    // Function to start the timer
    function startTimer() {
        if(!startTime){
            startTime = Date.now(); // Set start time to current timestamp
        }

        if(pausedTime) {
            startTime = Date.now() - pausedTime
        }
       

        // Update timer display every second
        timerInterval = setInterval(updateTimer, 1000);
    }

   // Function to stop the timer
   function stopTimer() {
    clearInterval(timerInterval); // Clear interval
}
       // Function to update the timer display
       function updateTimer() {
        const currentTime = Date.now() - startTime; // Calculate elapsed time in milliseconds
        const seconds = Math.floor((currentTime / 1000) % 60); // Calculate seconds
        const minutes = Math.floor(currentTime / (1000 * 60)); // Calculate minutes

        TimerDisplay.innerHTML = `Time: ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Update timer display
    }
    const colors = [
        'salmon',        // Darker orange
        'mediumorchid',   // Darker purple
        'skyblue',       // Darker blue
        'seagreen',      // Darker green
        'plum'           // Darker lavender
      ]

    //final width
    const width = 10

    //for displaying the next tetromino 
    let nextRandom = 0

    //L tetris
    const lTetromino = [
        [1, width +1, width*2+1 ,2],
        [width, width +1, width+2, width*2+2],
        [1,width+1, width*2+1,width*2],
        [width, width*2,width*2+1,width*2+2]
    ]

    //z tetris
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      // t tetris
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      //o tetris
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      //i tetris
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]

      const allOfthem = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]
    
   

      //starting point
      let currentPosition = 4;
      let currentRotation = 0;

      //random selection using Math.random
      let random = Math.floor(Math.random()*allOfthem.length)
      
      
      let current = allOfthem[random][currentRotation]
      let currentTetrimino = allOfthem[random]

    //draw 
    function draw(){
        current.forEach(index => {
            squares[currentPosition +index].classList.add('tetromino')
            squares[currentPosition +index].style.backgroundColor = colors[random]
        })
    }

   //undraw 
   function undraw(){
    current.forEach(index => {
        squares[currentPosition +index].classList.remove('tetromino')
        squares[currentPosition +index].style.backgroundColor = ''
    })
   }

  // Store intervals for continuous key presses
    let moveLeftInterval, moveRightInterval, moveDownInterval;

    let isMovingLeft = false;
let isMovingRight = false;
let isRotating = false;
isMovingDown = false; 

function control(e) {
  if (e.keyCode === 37 || e.keyCode === 65) { // Left arrow or 'A'
    isMovingLeft = true;
  } else if (e.keyCode === 39 || e.keyCode === 68) { // Right arrow or 'D'
    isMovingRight = true;
  } else if (e.keyCode === 40 || e.keyCode === 83) { // Down arrow or 'S'
    // No flag needed, handled in animate
    isMovingDown = true;
  } 
}

function keyupControl(e) {
  if (e.keyCode === 37 || e.keyCode === 65) { // Left arrow or 'A'
    isMovingLeft = false;
  } else if (e.keyCode === 39 || e.keyCode === 68) { // Right arrow or 'D'
    isMovingRight = false;
  } else if (e.keyCode === 40 || e.keyCode === 83) {
    isMovingDown = false;
  } else if(e.keyCode === 38){
    if (!isRotating) {
      isRotating = true;
    }
  }
}

    function rotationControl(e){
        if (e.keyCode === 38 || e.keyCode === 83){

        cancelAnimationFrame(timerId)
        rotate();
        animate();
    }
    }

    // function stopControl(e) {

    //     if (e.keyCode === 37 || e.keyCode === 65) { // Left arrow or 'A'
    //         clearInterval(moveLeftInterval);
    //         isPaused2 = false
    //         moveLeftInterval = null;
    //     } else if (e.keyCode === 39 || e.keyCode === 68) { // Right arrow or 'D'
    //         clearInterval(moveRightInterval);
    //         isPaused2 = false
    //         moveRightInterval = null;
    //     } else if (e.keyCode === 40 || e.keyCode === 83) { // Down arrow or 'S'
    //         clearInterval(moveDownInterval);
    //         isPaused2 = false
    //         moveDownInterval = null;
    //     }else if  (e.keyCode === 38 || e.keyCode === 87){
    //         isPaused2 = false
    //     }
    // }

    document.addEventListener('keydown', control);
    document.addEventListener('keyup', keyupControl);

   function moveDown(){
    if (isPaused()) return;
    undraw()
  // Check if the tetromino can move down
  if (!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    currentPosition += width;
  }
    draw()
    freeze()
   }


   //to make sure tetromino doesnt go off the grid
   function freeze(){
    if(current.some(index => squares[currentPosition + index + width ].classList.contains('taken'))){
        current.forEach(index =>squares[currentPosition + index  ].classList.add('taken'))
        //start new tetromino
        random = nextRandom
        nextRandom = Math.floor(Math.random()*allOfthem.length)
        current = allOfthem[random][currentRotation]
        currentTetrimino = allOfthem[random]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
      
        gameOver()
    }
   }



   //function to move to the left
   function moveLeft(){
    if (isPaused()) return;
    undraw()
    //checking if there is no remainder when moduled with width
    const isAtEdge = current.some(index=> (currentPosition + index) % width === 0)

    if(!isAtEdge){
        currentPosition -= 1
    }


    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }

    draw()
   }

   function moveRight(){
    if (isPaused()) return;
    undraw()
    const isAtEdge = current.some(index=> (currentPosition + index) % width === width -1)

    if(!isAtEdge){
        currentPosition += 1
    }

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
    draw()
   }
   function canRotate() {
    const nextRotationIndex = (currentRotation + 1) % currentTetrimino.length;
    const nextRotation = currentTetrimino[nextRotationIndex];

    for (let i = 0; i < nextRotation.length; i++) {
      const newPosition = currentPosition + nextRotation[i];
      if (
        newPosition >= squares.length || // Out of bounds
        squares[newPosition].classList.contains('taken') // Blocked by another piece
      ) {
        return false;
      }
    }

    return true;
  }
   function rotate(){
    if (isPaused()) return;
      
    if (currentTetrimino === iTetromino && currentRotation % 2 === 0) {
      console.log("it works")
      const leftPositions = [
        currentPosition - 1,
        currentPosition + width - 1,
        currentPosition + 2 * width - 1,
        currentPosition + 3 * width - 1
      ];

      const rightPositions = [
        currentPosition + 1,
        currentPosition + width + 1,
        currentPosition + 2 * width + 1,
        currentPosition + 3 * width + 1
      ];

      const leftObstacle = leftPositions.some(pos => pos >= 0 && squares[pos].classList.contains('taken'));
      const rightObstacle = rightPositions.some(pos => pos < squares.length && squares[pos].classList.contains('taken'));

      if (leftObstacle && rightObstacle) {
        // Prevent rotation if there's an obstacle on both sides
        return;
      }
    }

    if (!canRotate()){
      return
    }

    undraw()
    currentRotation ++
    if(currentRotation === current.length){
        currentRotation = 0 
    }
    current = allOfthem[random][currentRotation]
    isPaused2 = true
    checkRotatedPosition()
    isPaused2 = false
    draw()
   }

   function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }

   //show next
   const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
   let displayIndex = 0


   //array of teteriminos only first rotation
   const upNextTetrominoes =
   [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
   ]

    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
          square.classList.remove('tetromino')
          square.style.backgroundColor = ''
    
        })
        upNextTetrominoes[nextRandom].forEach( index => {
          displaySquares[displayIndex + index].classList.add('tetromino')
          displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
         
        })
      }

      StartBtn.addEventListener('click', () => {
        playBackgroundMusic();
        if (!timerId) {
            draw();
            animate();  
            startTimer();
            nextRandom = Math.floor(Math.random() * allOfthem.length);
            displayShape();
        }
    });

    PauseBtn.addEventListener('click', () => {
        if (timerId) {
            cancelAnimationFrame(timerId);
            stopTimer();
            timerId = null;
            pausedTime = Date.now() - startTime;
            pause()
        }
    });

    let speed2 = 3;
    function animate() {
        if (isPaused2) return; // Early exit if paused
      
        timerId = requestAnimationFrame(animate);
        framesCount++;
      
        // Handle movement based on flags
        if (isMovingLeft && framesCount % speed2 === 0) {
          moveLeft();
          return
        }else 
        if (isMovingRight  && framesCount % speed2 === 0 ) {
          moveRight();
          return
        }else if(isMovingDown && framesCount % speed2 === 0){
            moveDown();
            return
        }else if (isRotating && !isMovingLeft && !isMovingRight && !isMovingDown ) { // Prevent conflicts
          rotate();
          isRotating = false; // Reset flag after rotation
          return
        }else if (framesCount % speed === 0) {
          moveDown(); // Move down as usual
          return
        }
      }
      

      function addScore() {
        for (let i = 0; i < 199; i += width) {
            // Define a row as an array of indices
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
    
            // Check if the row is fully occupied
            if (row.every(index => squares[index].classList.contains('taken'))) {
                // Update the score and display it
                score += 10;
                if (score < 50) {
                    document.getElementById('levegif').src = lowScoreGif;
                  } else if (score < 100) {
                    document.getElementById('levegif').src = mediumScoreGif;
                  } else {
                    document.getElementById('levegif').src = highScoreGif;
                  }
                  showLevelGif();
                  simulateLineClear()
                ScoreDisplay.innerHTML = score;
    
                // Clear the row by removing the 'taken' class
                row.forEach(index => {squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            });
    
                // Remove the cleared row from the squares array
                const squaresRemoved = squares.splice(i, width);
    
                // Add the removed row to the start of the squares array
                squares = squaresRemoved.concat(squares);
    
                // Reattach the squares to the grid in their new order
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }
    
      // Function to check game over condition
      function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            lives--;
            updateLivesDisplay();
            LivesDisplay.innerHTML = lives
            if (lives <= 0) {
                ScoreDisplay.innerHTML = 'Game Over';
                finalScore = score;


                console.log("sending info to websocket")
                ws.send(JSON.stringify({name: playerName, score: finalScore, time: TimerDisplay.textContent}));

              
              
                cancelAnimationFrame(timerId); // Cancel animation frame
                clearInterval(timerId); // Clear interval
                const modal = document.getElementById('game-over-modal');
                modal.style.display = 'block'; // Display game over modal

                // Add event listener to restart button in modal
                const restartBtnModal = document.getElementById('restart-button-modal');
                restartBtnModal.addEventListener('click', () => {
                    modal.style.display = 'none'; // Hide modal
                    restartGame(true); // Restart game with score reset
                });

                // Add event listener to close button in modal
                const closeModal = document.getElementsByClassName('close')[0];
                closeModal.addEventListener('click', () => {
                    modal.style.display = 'none'; // Hide modal
                });
            } else {
                restartGame(false); // Restart game without resetting score
            }
        }
    }

    function restartGame(resetScore) {
        cancelAnimationFrame(timerId);
        clearInterval(timerId);
        timerId = null;
        for (let i = 0; i < 200; i++) {
            squares[i].classList.remove('taken');
            squares[i].classList.remove('tetromino');
            squares[i].style.backgroundColor = '';
        }
        if (resetScore) {
            score = 0 // Reset score if resetScore is true
            lives = 3
            LivesDisplay.innerHTML = 3
            updateLivesDisplay()
            stopTimer()
            timerInterval = null
            timerId = null
            startTime = null // Reset the start time
            pausedTime = null // Reset paused time
            TimerDisplay.innerHTML = 'Time: 00:00' // Reset timer display
            startTimer()
            
        }

        
        ScoreDisplay.innerHTML = score;
        currentPosition = 4;
        currentRotation = 0;
        random = Math.floor(Math.random() * allOfthem.length);
        current = allOfthem[random][currentRotation];
        draw();
        displayShape();
        if (!timerId) {
            animate()
           
        }
    }

   

    restartBtn.addEventListener('click', () => {
        cancelAnimationFrame(timerId);
        clearInterval(timerId);
        stopTimer()
        timerId = null;
        startTime = null; // Reset the start time
        pausedTime = null; // Reset paused time
        TimerDisplay.innerHTML = 'Time: 00:00'; // Reset timer display
        timerInterval = null
        startTimer()
        for (let i = 0; i < 200; i++) {
            squares[i].classList.remove('taken');
                squares[i].classList.remove('tetromino');
                squares[i].style.backgroundColor = '';
            
        }
        // Reset variables
        score = 0;
        lives = 3
        updateLivesDisplay()
        ScoreDisplay.innerHTML = score;
        LivesDisplay.innerHTML = lives;
        //starting point
         currentPosition = 4;
         currentRotation = 0;
  
        //random selection using Math.random
         random = Math.floor(Math.random()*allOfthem.length)
        
        
         current = allOfthem[random][currentRotation]
    
        // Redraw initial tetromino and display shape
        draw();
        displayShape();
        if (!timerId) {
            animate()
        }
    });


    function isPaused() {
        return !timerId; // Returns true if timerId is null (paused)
    }

    function updateLivesDisplay() {
        const hearts = document.querySelectorAll('.heart');
        for (let i = 0; i < 3; i++) {
            hearts[i].style.visibility = i < lives ? 'visible' : 'hidden';
        }
    }

         // Function to play background music
         function playBackgroundMusic() {
            const backgroundMusic = document.getElementById('backgroundMusic');
            backgroundMusic.volume = 0.5; // Adjust volume (0.0 to 1.0)
            backgroundMusic.play();
        }

        function pause(){
            const backgroundMusic = document.getElementById('backgroundMusic');
            backgroundMusic.pause();
        }

        function simulateLineClear() {
            // Your Tetris game logic to detect when lines are cleared
            // Example: If a line is cleared, call playLineClearSound()
            setTimeout(() => {
                playLineClearSound();
            }, 50); // Play sound 1 second after line clear (adjust timing as needed)
        }

        function playLineClearSound() {
            lineClearSound.currentTime = 0; // Rewind to the start
            lineClearSound.play();
        }
    

        
})

function showLevelGif() {
    const gifElement = document.getElementById('levegif');
    gifElement.style.display = 'block'; // Show the GIF initially
  
    // Hide the GIF after a delay (5-10 seconds)
    setTimeout(() => {
      gifElement.style.display = 'none';
    }, Math.floor(Math.random() * (10000 - 5000)) + 5000); // Random delay between 5-10 seconds
  }


  function getPlayerPercentile(playerName, playerScore) {
    const scoresTable = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
    const rows = scoresTable.rows;
    let scores = [];

    // Collect all scores
    for (let i = 0; i < rows.length; i++) {
        const name = rows[i].cells[1].innerText; // Assuming the name is in the second column
        const score = parseInt(rows[i].cells[2].innerText, 10); // Assuming the score is in the third column
        scores.push({ name, score });
    }

    // Sort scores primarily by score in descending order and by name for tie-breaking
    scores.sort((a, b) => {
        if (b.score === a.score) { // If scores are equal, sort by name
            return a.name.localeCompare(b.name);
        }
        return b.score - a.score;
    });

    // Find the index of the player based on name and score
    const index = scores.findIndex(s => s.name === playerName && s.score === playerScore);

    if (index !== -1) {
        // Calculate the percentile
        const percentile = ((scores.length - index) / scores.length) * 100;
        return `${percentile.toFixed(2)}%`;  // Return the percentile as a string formatted to two decimal places with a percent sign
    } else {
        console.log("Player not found in the current scores.");
        return null;  // Return null if the player is not found
    }
}
