document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is using a touchscreen device or not
    function checkIfTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0))
    }
    let isTouchDevice = checkIfTouchDevice()

    const hedgehog = document.querySelector('.hedgehog')
    const grid = document.querySelector('.grid')
    const guideText = document.getElementById('guideText')
    const scoreText = document.getElementById('scoreText')
    const highScoreText = document.getElementById('highScoreText')
    const canvas = document.getElementById("canvas")

    scoreText.innerHTML = "Score: " + 0
    highScoreText.innerHTML = "Highscore: " + 0

    if (isTouchDevice) {
        guideText.innerHTML = "Tap the screen to start exploring Espoo! Can you dodge all the attractions?"
    } else {
        guideText.innerHTML = "Press the spacebar to start exploring Espoo! Can you dodge all the attractions?"
    }

    let isJumping = false
    let isGameOver = true
    let slideSpeed = 2
    let spawnMaxInterval = 3500
    let spawnMinInterval = 1000
    let tryToJump = 0
    let intervalSet = false
    let score = 0
    let highScore = 0
    let playerPosition = 1
    let scoreCounterTo10 = 0

    const audioClips = [new Audio("../audio/hedgehog_jump_1.wav"), 
    new Audio("../audio/hedgehog_jump_2.wav"),
    new Audio("../audio/hedgehog_jump_3.wav"),
    new Audio("../audio/hedgehog_jump_4.wav"),
    new Audio("../audio/hedgehog_jump_5.wav"),
    new Audio("../audio/hedgehog_score.wav"),
    new Audio("../audio/hedgehog_game_over.wav")]

    function stopAllAudio(){
        audioClips.forEach(function(audio){
            audio.pause()
            audio.currentTime = 0
        })
    }

    // Return a random number between the input values including the min and max values.
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function jump() {
        hedgehog.style.backgroundImage = "url('images/Hedgehog_jump.png')"
        let randomJumpSound = randomIntFromInterval(0,4)
        stopAllAudio()
        audioClips[randomJumpSound].play()

        let gravity = 1
        let speed = 13
        playerPosition = 1

        let timerId = setInterval(function () {
            //move down
            if (speed < 3) {
                gravity = 1
                clearInterval(timerId)
                let downTimerId = setInterval(function () {
                    gravity = gravity * 1.02
                    speed = speed * gravity
                    playerPosition = playerPosition - speed
                    if (playerPosition > 1)
                        hedgehog.style.bottom = playerPosition + 'px'
                    else {
                        hedgehog.style.bottom = 1 + 'px'
                        clearInterval(downTimerId)
                        isJumping = false
                        hedgehog.style.backgroundImage = "url('images/Hedgehog_run.gif')"
                    }
                }, 20)
            }
            //move up
            gravity = gravity / 1.02
            speed = speed * gravity
            playerPosition = playerPosition + speed
            if (playerPosition > 1)
                hedgehog.style.bottom = playerPosition + 'px'
        }, 20)
    }

    // The timeout between spawning obstacles. 
    // Clear this to stop looping the generateObstacles() function and stop spawning obstacles.
    let timeout = 0

    function generateObstacles() {
        if (isGameOver === false) {
            let randomTime = randomIntFromInterval(spawnMinInterval, spawnMaxInterval)
            let obstaclePosition = 1000
            const obstacle = document.createElement('div')
            obstacle.classList.add('obstacle')
            obstacleRemoved = false

            let whichObstacle = randomIntFromInterval(1, 3)
            obstacle.style.backgroundImage = "url('images/obstacle_" + whichObstacle + ".png')"

            grid.appendChild(obstacle)
            obstacle.style.left = obstaclePosition + 'px'

            if (isGameOver === false) {
                let timerId = setInterval(function () {
                    if (obstaclePosition > 0 && obstaclePosition < 52 && playerPosition < 52) {
                        clearInterval(timerId)
                        // Show game over message based on if the user is using a touchscreen device or not
                        if (isTouchDevice) {
                            guideText.innerHTML = "Game Over. Tap the screen to try again!"
                        } else {
                            guideText.innerHTML = "Game Over. Press the spacebar to try again!"
                        }
                        hedgehog.style.backgroundImage = "url('images/Hedgehog.png')"
                        isGameOver = true
                        stopAllAudio()
                        audioClips[6].play()
                        clearTimeout(timeout)
                        return
                    }
                    if (obstaclePosition < -120) {
                        obstacle.remove()
                        score++
                        if (score >= highScore) {
                            highScore = score
                            highScoreText.innerHTML = "Highscore: " + highScore
                        }
                        scoreCounterTo10++
                        if(scoreCounterTo10 === 10){
                            audioClips[5].play()
                            scoreCounterTo10 = 0
                        }
                        scoreText.innerHTML = "Score: " + score
                        obstacleRemoved = true
                        clearInterval(timerId)
                        return
                    }
                    if (!isGameOver) {
                        obstaclePosition -= slideSpeed
                        obstacle.style.left = obstaclePosition + 'px'
                    } else {
                        clearTimeout(timeout)
                        obstaclePosition = 1000
                        clearInterval(timerId)
                        return
                    }
                }, 1)
            } else return
            if (isGameOver === false) timeout = setTimeout(generateObstacles, randomTime)
            else {
                clearTimeout(timeout)
            }
        } else {
            clearTimeout(timeout)
            obstaclePosition = 1000
            return true
        }
    }

    const slidingBackground = document.querySelector('.slidingBackground')
    let backgroundPosition = 0

    /* Slide the background endlessly to the left while the game is running.
    Stop sliding on game over. */
    function slideBackground() {
        let interval = setInterval(function () {
            backgroundPosition -= slideSpeed
            slidingBackground.style.backgroundPosition = backgroundPosition + "px 0px"
            if (isGameOver) {
                clearInterval(interval)
                slideSpeed = 2
                spawnMaxInterval = 3500
                spawnMinInterval = 1000
            }
            if (spawnMaxInterval >= 1000) {
                spawnMaxInterval -= 0.04
            }
            if (spawnMinInterval >= 400) {
                spawnMinInterval -= 0.04
            }
            slideSpeed += 0.0001
        }, 1)
    }

    function startGame() {
        isJumping = true
        document.querySelectorAll('.obstacle').forEach(e => e.remove())
        isGameOver = false
        slideBackground()
        generateObstacles()
        jump()
        guideText.innerHTML = ''
        score = 0
        scoreText.innerHTML = "Score: " + score
    }

    // Try jumping until the player releases the jump control.
    function initiateJump() {
        if (intervalSet === false) {
            tryToJump = setInterval(function () {
                intervalSet = true
                if (!isJumping && isGameOver === false) {
                    isJumping = true
                    jump()
                } else if (!isJumping && isGameOver === true) {
                    startGame()
                }
            }, 1)
        } else if (!isJumping && isGameOver === false) {
            isJumping = true
            jump()
        } else if (!isJumping && isGameOver === true) {
            startGame()
        }
    }

    // Stop trying to jump.
    function releaseJump() {
        clearInterval(tryToJump)
        intervalSet = false
    }

    // Check if the spacebar key was pressed on a keyboard.
    function keyboardControl(e) {
        if (e.keyCode === 32) {
            initiateJump()
        }
    }

    // Check if the spacebar key was pressed on a keyboard.
    function keyboardControlRelease(e) {
        if (e.keyCode === 32) {
            releaseJump()
        }
    }

    // Listeners for keyboard control
    document.addEventListener('keydown', keyboardControl)
    document.addEventListener('keyup', keyboardControlRelease)

    // Passive listeners for touch controls.
    canvas.addEventListener("touchstart", function (evt) {
        // Only try jumping if the screen is touched with one finger.
        // Otherwise stop trying to jump.
        if (evt.touches.length === 1) {
            initiateJump()
        } else {
            releaseJump()
        }
        console.log("touchstart")
    }, { passive: true })

    canvas.addEventListener("touchend", function () {
        releaseJump()
    }, { passive: true })

    canvas.addEventListener("touchcancel", function () {
        releaseJump()
    }, { passive: true })
})