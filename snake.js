// setup of the starting 'draw' properties of the snake
// var drawableSnake = { color: 'green', pixels: snake }

// add snake to list of things i'm going to draw
// var drawableObjects = [drawableSnake]

// use the draw method to draw the snake
// CHUNK.draw(drawableObjects)

var draw = function(snakeToDraw, apple) {
    var drawableSnake = { color: "green", pixels: snakeToDraw };
    var drawableApple =  { color: "red", pixels: [apple] }
    var drawableObjects = [drawableSnake, drawableApple];
    CHUNK.draw(drawableObjects)
}

var moveSegment = function(segment) {
    if(segment.direction === "down") {
        return { top: segment.top + 1, left: segment.left }
    } else if (segment.direction === "up") {
        return { top: segment.top - 1, left: segment.left }
    } else if (segment.direction === "right") {
        return { top: segment.top, left: segment.left + 1 }
    } else if (segment.direction === "left") {
        return { top: segment.top, left: segment.left - 1}
    }
    return segment
}

var segmentFurtherForwardThan = function(index, snake) {
    if (snake[index - 1] === undefined) {
        return snake[index]
    }
    
    return snake[index - 1]
}

var moveSnake = function(snake) {
    return snake.map(function(oldSegment, segmentIndex) {
        var newSegment = moveSegment(oldSegment)
        newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction
        return newSegment
    })
}

var growSnake = function(snake) {
    var indexOfLastSegment = snake.length - 1;
    var lastSegment = snake[indexOfLastSegment];
    snake.push({ top: lastSegment.top, left: lastSegment.left })
    return snake
}

var changeDirection = function(direction) {
    snake[0].direction = direction
}

var ate = function(snake, otherThing) {
    var head = snake[0]
    return CHUNK.detectCollisionBetween([head], otherThing)
}

var advanceGame = function() {
    newSnake = moveSnake(snake);
    if (ate(newSnake, snake)) {
        CHUNK.endGame();
        CHUNK.flashMessage("Oops, you ate yourself!")
    }
    if (CHUNK.detectCollisionBetween([apple], snake)) {
        snake = growSnake(newSnake);
        apple = CHUNK.randomLocation();
    }
    if (CHUNK.detectCollisionBetween(snake, CHUNK.gameBoundaries())) {
        CHUNK.endGame();
        CHUNK.flashMessage("Slam! You've hit a wall!")
    }
    snake = newSnake
    draw(snake, apple)
}


// setup start position (and length) of snake
var apple = { top: 8, left: 10 }
var snake = [{ top: 1, left: 0, direction: 'down'}, { top: 0, left: 0, direction: 'down' }]
CHUNK.executeNTimesPerSecond(advanceGame, 4)
CHUNK.onArrowKey(changeDirection)