document.addEventListener('DOMContentLoaded', () => {
    const dino = document.querySelector('.dino')
    const grid = document.querySelector('.grid')
    const body = document.querySelector('body')
    const alert = document.getElementById('alert')
    let isJumping = false
    let isGameOver = true
    let returned = true

    function control(e) {
        if (e.keyCode === 32) {
            // console.log("returned: " + returned)
            if (!isJumping && isGameOver === false) {
                isJumping = true
                jump()
            }
            if (!isJumping && isGameOver === true) {
                isJumping = true
                console.log("start")
                returned = false;
                document.querySelectorAll('.obstacle').forEach(e => e.remove());
                isGameOver = false;
                // console.log(isGameOver)
                // clearTimeout(generateObstacles)
                slideBackground()
                generateObstacles()
                jump()
                alert.innerHTML = ''
            }
        }
    }
    document.addEventListener('keydown', control)

    let position = 1
    function jump() {
        let gravity = 1
        let speed = 30
        position = 1
        // let count = 0
        let timerId = setInterval(function () {

            //move down
            if (speed < 4) {
                gravity = 1
                // console.log("test")
                clearInterval(timerId)
                let downTimerId = setInterval(function () {
                    // if (position <= 1) {
                    //     clearInterval(downTimerId)
                    //     isJumping = false
                    // }
                    // position -= 30
                    // count--
                    gravity = gravity * 1.02
                    speed = speed * gravity
                    position = position - speed
                    if (position > 1)
                        dino.style.bottom = position + 'px'
                    else {
                        dino.style.bottom = 1 + 'px'
                        clearInterval(downTimerId)
                        isJumping = false
                    }
                }, 20)

            }
            //move up
            // position += 30
            // count++
            // speed = speed / gravity
            gravity = gravity / 1.02
            speed = speed * gravity
            position = position + speed
            // console.log("speed" + speed)
            // console.log("position" + position)
            if (position > 1)
                dino.style.bottom = position + 'px'
        }, 20)
    }
    let timeout = 0

    function generateObstacles() {
        if (isGameOver === false) {
            // console.log("spawn")
            let randomTime = Math.random() * 4000
            // console.log("random time: " + randomTime)
            let obstaclePosition = 1000
            const obstacle = document.createElement('div')
            obstacle.classList.add('obstacle')
            grid.appendChild(obstacle)
            obstacle.style.left = obstaclePosition + 'px'

            if (isGameOver === false) {
                let timerId = setInterval(function () {
                    if (obstaclePosition > 0 && obstaclePosition < 60 && position < 60) {
                        clearInterval(timerId)
                        // obstaclePosition = 1000
                        alert.innerHTML = 'Game Over'
                        isGameOver = true
                        clearTimeout(timeout)
                        // console.log("game over")
                        //remove all children
                        // body.removeChild(body.firstChild)
                        // while (grid.firstChild) {
                        //     grid.removeChild(grid.lastChild)
                        // }
                        console.log("test")
                        return
                    }
                    if (obstaclePosition < -120) {
                        obstacle.remove()
                    }
                    if (!isGameOver) {
                        obstaclePosition -= 2
                        obstacle.style.left = obstaclePosition + 'px'
                        // console.log(clearTimeout(generateObstacles))
                    } else {
                        console.log("test")
                        console.log("timeout" + timeout)
                        clearTimeout(timeout)
                        obstaclePosition = 1000
                        clearInterval(timerId)
                        return
                        // clearInterval(generateObstacles)
                    }
                    // console.log("obstaclePosition: " + obstaclePosition)
                }, 1)
            } else return
            if (isGameOver === false) timeout = setTimeout(generateObstacles, randomTime)
            else {
                console.log(clearTimeout(generateObstacles))
                clearTimeout(timeout)
            }
        } else {
            clearTimeout(timeout)
            obstaclePosition = 1000
            console.log("return")
            returned = true
            return true
        }
    }

    const slidingBackground = document.querySelector('.slidingBackground')

    let bPosition = 0;
    function slideBackground() {
        {
            let interval = setInterval(function () {
                bPosition -= 2;
                slidingBackground.style.backgroundPosition = bPosition + "px 0px"
                if (isGameOver) {
                    clearInterval(interval)
                }
            }, 1);
        }
    }
})