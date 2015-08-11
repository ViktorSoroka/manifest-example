(function () {

    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        x = 0,
        y = 0,
        dx = 0,
        dy = 0,
        timer;

    function GameLabyrinth() {}

    GameLabyrinth.prototype.getLabyrinth = function () {

        return this.schemeFile;

    };

    GameLabyrinth.factory = function (type, startingX, startingY) {

        if (typeof GameLabyrinth[type] !== 'function') {

            throw Error('Constructor does`t exist!');

        }

        if (typeof GameLabyrinth[type].prototype.getLabyrinth !== 'function') {

            GameLabyrinth[type].prototype = new GameLabyrinth();

        }

        return new GameLabyrinth[type](startingX, startingY);

    };

    GameLabyrinth.easyScheme = function (startingX, startingY) {

        this.startingX = startingX;
        this.startingY = startingY;
        this.schemeFile = "images/easy_maze.png";

    };

    GameLabyrinth.hardScheme  = function (startingX, startingY) {

        this.startingX = startingX;
        this.startingY = startingY;
        this.schemeFile = "images/maze.png";

    };

    drawMaze(GameLabyrinth.factory("hardScheme" , 268, 5));

    function drawFrame() {

        var imgFace = document.getElementById("face");

        if (dx !== 0 || dy !== 0) {

            context.beginPath();
            context.fillStyle = "rgb(254,244,207)";
            context.rect(x, y, 15, 15);
            context.fill();

            // increase player` coordinates
            x += dx;
            y += dy;


            if (checkForCollision()) {

                x -= dx;
                y -= dy;
                stopPlayer();

            }

            // redraw player
            context.drawImage(imgFace, x, y);

            // if finish
            if (y > (canvas.height - 17)) {
                alert("You won!!");
                return;
            }
        }

        timer = setTimeout(function () {

            drawFrame();

        }, 10);

    }

    function drawMaze(shreme) {

        var imgMaze = new Image();

        clearTimeout(timer);
        stopPlayer();

        imgMaze.onload = function () {

            var imgFace = document.getElementById("face");

            canvas.width = imgMaze.width;
            canvas.height = imgMaze.height;

            // draw labyrinth
            context.drawImage(imgMaze, 0, 0);

            // draw player
            x = shreme.startingX;
            y = shreme.startingY;
            context.drawImage(imgFace, x, y);
            context.stroke();

            timer = setTimeout(function () {

                drawFrame();

            }, 10);

        };

        imgMaze.src = shreme.schemeFile;

    }

    function stopPlayer() {

        dx = 0;
        dy = 0;

    }

    function processKey(e) {

        stopPlayer();

        var direction = {
            38: function () {
                dy = -1;
            },
            40: function () {
                dy = 1;
            },
            37: function () {
                dx = -1;
            },
            39: function () {
                dx = 1;
            }
        };

        direction[e.keyCode]();

        return this;

    }

    function checkForCollision() {

        // works with pixels
        var imgData = context.getImageData(x - 1, y - 1, 15 + 2, 15 + 2),
            pixels = imgData.data,
            rgb = [],
            black,
            gray;

        for (var i = 0, n = pixels.length; i < n; i += 4) {

            rgb = [].slice.call(pixels, i, i + 3);

            // check black wall
            black = rgb.every(function (elem) {

                return elem === 0;

            });

            // check gray wall
            gray = rgb.every(function (elem) {

                return elem === 169;

            });

            if (black || gray) return true;

        }

        return false;

    }

    document.getElementById("load-hard").addEventListener("click", function () {

        drawMaze(GameLabyrinth.factory("hardScheme" , 268, 5));

    }, false);

    document.getElementById("load-easy").addEventListener("click", function () {

        drawMaze(GameLabyrinth.factory("easyScheme" , 5, 5));

    }, false);

    document.body.addEventListener("keydown", processKey, false);

}());
