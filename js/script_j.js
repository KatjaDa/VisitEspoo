document.addEventListener('DOMContentLoaded', () => {
    const hedgehog = document.querySelector('.hedgehog')
    const grid = document.querySelector('.grid')
    const guideText = document.getElementById('guideText')
    const scoreText = document.getElementById('scoreText')
    const highScoreText = document.getElementById('highScoreText')
    const canvas = document.getElementById("canvas")

    scoreText.innerHTML = "Score: " + 0
    highScoreText.innerHTML = "Highscore: " + 0
    guideText.innerHTML = "Press the spacebar to start!"

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

    function jump() {
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

    // Return a random number between the input values including the min and max values.
    function randomIntFromInterval(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
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
                    if (obstaclePosition > 0 && obstaclePosition < 50 && playerPosition < 50) {
                        clearInterval(timerId)
                        guideText.innerHTML = 'Game Over. Press the spacebar to try again!'
                        isGameOver = true
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
            console.log("spawnMinInterval" + spawnMinInterval)
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