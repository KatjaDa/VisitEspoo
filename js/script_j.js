document.addEventListener('DOMContentLoaded', () => {
    const dino = document.querySelector('.dino')
    const grid = document.querySelector('.grid')
    const body = document.querySelector('body')
    const alert = document.getElementById('alert')
    let isJumping = false
    let isGameOver = false

    function control(e) {
        if (e.keyCode === 32) {
            if (!isJumping) {
                isJumping = true
                jump()
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
                    gravity = gravity*1.02
                    speed = speed*gravity
                    position = position - speed
                    if(position > 1)
                        dino.style.bottom = position + 'px'
                    else{
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
            gravity = gravity/1.02
            speed = speed*gravity
            position = position + speed
            // console.log("speed" + speed)
            // console.log("position" + position)
            if(position > 1)
                dino.style.bottom = position + 'px'
        }, 20)
    }

    function generateObstacles() {
        let randomTime = Math.random() * 4000
        console.log("random time: " + randomTime)
        let obstaclePosition = 1000
        const obstacle = document.createElement('div')
        if (!isGameOver) obstacle.classList.add('obstacle')
        grid.appendChild(obstacle)
        obstacle.style.left = obstaclePosition + 'px'

        let timerId = setInterval(function () {
            if (obstaclePosition > 0 && obstaclePosition < 60 && position < 60) {
                clearInterval(timerId)
                alert.innerHTML = 'Game Over'
                isGameOver = true
                //remove all children
                body.removeChild(body.firstChild)
                while (grid.firstChild) {
                    grid.removeChild(grid.lastChild)
                }

            }
            obstaclePosition -= 2
            obstacle.style.left = obstaclePosition + 'px'
        }, 1)
        if (!isGameOver) setTimeout(generateObstacles, randomTime)
    }
    generateObstacles()
})