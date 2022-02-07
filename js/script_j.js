document.addEventListener('DOMContentLoaded', () => {
    let isTouchDevice = false

    const hedgehog = document.querySelector('.hedgehog')
    const grid = document.querySelector('.grid')
    const guideText = document.getElementById('guideText')
    const scoreText = document.getElementById('scoreText')
    const highScoreText = document.getElementById('highScoreText')
    const canvas = document.getElementById("canvas")
    const audioVolume = 0.16;

    scoreText.innerHTML = "Score: " + 0
    highScoreText.innerHTML = "Highscore: " + 0

    // Check if an element is in the viewport.
    function isElementInViewport(el) {
        let rect = el.getBoundingClientRect()
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
    }

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

    const audioClips = []

    for (let i = 0; i < 5; i++) {
        audioClips.push(new Audio("audio/hedgehog_jump_" + (i + 1) + ".wav"))
        audioClips[i].volume = audioVolume
    }
    audioClips.push(new Audio("audio/hedgehog_game_over.wav"))
    audioClips[5].volume = audioVolume

    const audioClipTenPoints = new Audio("audio/hedgehog_ten_points.wav")
    audioClipTenPoints.volume = audioVolume

    const audioClipsScore = []

    for (let i = 0; i < 9; i++) {
        audioClipsScore.push(new Audio("audio/hedgehog_score_" + (i + 1) + ".wav"))
        audioClipsScore[i].volume = audioVolume
    }

    // Stop all "audioClips" clips (not "audioClipsScore" clips).
    function stopAudioClips() {
        audioClips.forEach(function (audio) {
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

        /* Choose randomly one of the jump audio clips to play.
        Play the chosen sound if the game over sound isn't playing 
        or has played long enough so that it can be interrupted. */
        let randomJumpSound = randomIntFromInterval(0, 4)
        if ((audioClips[5].currentTime === 0 || audioClips[5].currentTime > 0.3)) {
            stopAudioClips()
            audioClips[randomJumpSound].play().catch(() => {
                // The audio clip doesn't play if the user hasn't interacted with the document yet.
            });
        }

        let gravity = 1
        let speed = 10
        playerPosition = 1

        let timerId = setInterval(function () {
            // Move down
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
            // Move up
            gravity = gravity / 1.02
            speed = speed * gravity
            playerPosition = playerPosition + speed
            if (playerPosition > 1)
                hedgehog.style.bottom = playerPosition + 'px'
        }, 20)
    }

    /* The timeout between spawning obstacles. 
    Clear this to stop looping the generateObstacles() function and stop spawning obstacles. */
    let timeout = 0

    function generateObstacles() {
        if (isGameOver === false) {
            let obstacles = []
            let randomTime = randomIntFromInterval(spawnMinInterval, spawnMaxInterval)
            let numberOfObstacles = 1

            if (slideSpeed >= 2.55) {
                if (randomIntFromInterval(1, score) > 9) {
                    numberOfObstacles++
                }
            }
            if (slideSpeed >= 2.9) {
                if (randomIntFromInterval(1, score) > 30)
                    numberOfObstacles++
            }

            if (randomIntFromInterval(1, 9) === 9 && numberOfObstacles > 1) {
                numberOfObstacles = randomIntFromInterval(1, 2)
            }

            for (let i = 0; i < numberOfObstacles; i++) {
                let whichObstacle = randomIntFromInterval(1, 3)
                const obstacle = document.createElement('section')
                obstacle.classList.add('obstacle')
                obstacle.style.backgroundImage = "url('images/obstacle_" + whichObstacle + ".png')"
                obstacle.position = 1000 + i * 60
                obstacle.style.left = obstacle.position + 'px'
                obstacles.push(obstacle)
                grid.appendChild(obstacles[i])
                randomTime += 20 * i
            }

            if (isGameOver === false) {
                let timerId = setInterval(function () {
                    for (let i = 0; i < obstacles.length; i++) {
                        if (obstacles[i].position > 20 && obstacles[i].position < 80 && playerPosition < 44) {
                            clearInterval(timerId)
                            // Show game over message based on if the user is using a touchscreen device or not
                            if (isTouchDevice) {
                                guideText.innerHTML = "Game Over. Tap the screen to try again!"
                            } else {
                                guideText.innerHTML = "Game Over. Press the spacebar to try again!"
                            }
                            hedgehog.style.backgroundImage = "url('images/Hedgehog.png')"
                            isGameOver = true
                            stopAudioClips()
                            audioClips[5].play()
                            clearTimeout(timeout)
                            return
                        }
                        if (obstacles[i].position < -70) {
                            obstacles[i].remove()
                            obstacles.shift()
                            score++
                            if (score >= highScore) {
                                highScore = score
                                highScoreText.innerHTML = "Highscore: " + highScore
                            }
                            scoreCounterTo10++
                            if (scoreCounterTo10 === 10) {
                                audioClipTenPoints.play()
                                scoreCounterTo10 = 0
                            } else {
                                audioClipsScore[(-1 + scoreCounterTo10)].play()
                            }
                            scoreText.innerHTML = "Score: " + score
                            if (obstacles.length === 0) {
                                clearInterval(timerId)
                                return
                            }
                        }
                        // Move obstacle according to the slide speed if the game is not over
                        if (!isGameOver && obstacles.length > 0) {
                            obstacles[i].position -= slideSpeed
                            obstacles[i].style.left = obstacles[i].position + 'px'
                        } else {
                            clearTimeout(timeout)
                            clearInterval(timerId)
                            return
                        }
                    }
                }, 1)
            } else return
            if (isGameOver === false) timeout = setTimeout(generateObstacles, randomTime)
            else {
                clearTimeout(timeout)
            }
        } else {
            clearTimeout(timeout)
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
            if (spawnMaxInterval > 800) {
                spawnMaxInterval -= 0.12
            }
            if (spawnMinInterval > 400) {
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
        scoreCounterTo10 = 0
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
        if (e.keyCode === 32 && isElementInViewport(hedgehog)) {
            initiateJump()
        }
        if (isElementInViewport(hedgehog)) {
            window.onkeydown = function (e) {
                return !(e.keyCode == 32)
            }
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
        isTouchDevice = true
        /* Only try jumping if the screen is touched with one finger.
        Otherwise stop trying to jump. */
        if (evt.touches.length === 1 && isElementInViewport(hedgehog)) {
            initiateJump()
        } else {
            releaseJump()
        }
    }, { passive: true })

    canvas.addEventListener("touchend", function () {
        isTouchDevice = true
        releaseJump()
    }, { passive: true })

    canvas.addEventListener("touchcancel", function () {
        isTouchDevice = true
        releaseJump()
    }, { passive: true })
})