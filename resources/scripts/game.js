/*
    contains all the game logic & rendering

    `gameInterface`
*/

const rand = function(min,max){
    return Math.floor(Math.random() * (max-min) + min);
};

(function(scope){

    const isCollision = function(rect1,rect2){
        return rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x && rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y;   
    };


    var snake = [];
    var snakeLength = 1;
    var player = {
        x: 4,
        y: 4,
        w: 1,
        h: 1,
        color: "5EF85E",
        isDead: false
    };

    var apple = { // apple entity
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        color: "ff1e1e"
    };

    var score = 0;

    window.player = player;

    var canvas, ctx, viewport = [0,0]; // dom stuff

    var keyboard = { // keyboard for moving the player
        left: false,
        right: false,
        down: false,
        up: false
    };

    var plainX; // size of board
    var plainY;

    window.apple = apple;

    var size; // size of each square on the board

    var snakeDirection = false; // up | down | left | right


    $(()=>{
        var get = scope["canvasInterface"].get();
        canvas = get.canvas;
        ctx = get.ctx;
        viewport = get.viewport;

        scope["canvasInterface"].onResize(newViewport=>{
            viewport = newViewport;

            size = 45;

            plainX = Math.floor( viewport[0]/size );
            plainY = Math.floor( viewport[1]/size );

            console.log("resize",...viewport, plainX, plainY);
            if ( !player.hasInit ) {
                
                
                
            }
        });

        const draw = function(entity){
            if ( entity.color )  {
                ctx.fillStyle = "#" + entity.color;
            }
            ctx.fillRect(entity.x * size, entity.y * size, entity.w * size, entity.h * size);

        };

        var moveTick = 0;
    
        function update(){

            // calculate time delta
            var now = _time();
            var delta = (now-last)/1000;
            last = now;

            if ( player.isDead ) {
                delta /= 4;
            }

            moveTick += delta;

            if ( moveTick > 1/20 ) { // run the game at 20 fps
                moveTick = 0;

                if ( snakeDirection ) {
                
                    snake = [{ // save previous cords
                        x: player.x,
                        y: player.y,
                        w:1,
                        h:1
                    }, ...snake]; // push to the start of the array
    
                    snake.length = Math.min(snakeLength,snake.length); // cut off the back part
                }
               

                // player movement
                switch(snakeDirection){
                    case "up": player.y--; break;
                    case "down": player.y++; break;

                    case "left": player.x--; break;
                    case "right": player.x++; break;
                }
    
                // player boundaries
                if (player.x < 0 ) {
                    player.x = plainX;
                }
                if ( player.y < 0 ) {
                    player.y = plainY;
                }
    
                if (player.x > plainX ) {
                    player.x = 0;
                }
                if ( player.y > plainY ) {
                    player.y = 0;
                }
    
                
    
                // clear canvas
                ctx.clearRect(0,0,...viewport);
    
                // render player
                if ( player.hasInit ) {
                    draw(player);
    
                    snake.forEach( (k,i)=>{
    
                        if ( i < 6 ) { 
                            ctx.globalAlpha = 1- (i/snakeLength); // make snake fade out
                        }
                        draw(k);
                    });
    
                    ctx.globalAlpha = 1;
    
                    // render apple
                    draw(apple);
    
                    // check collision with apple
                    if ( isCollision(player,apple) ) {
                        score++; // inc score
                        snakeLength++;
    
                        // generate new apple
                        newApple();
    
                        displayScore();
    
                    }
    
                    snake.forEach(k=>{ 
                        // player crashed!
                        if ( isCollision(player, k) ) {
                            if ( !player.isDead ) {
                                k.color = "#991e1e";
                                // run this code once
                                setTimeout(function(){
                                    pageInterface.showPage('menu');
                                },600);
                            }
                            player.isDead = true;
                        }
                    });
                }
            }
            
            


            // request for next frame
            requestAnimationFrame(update);
        };

        //setInterval(update, 1000/25); // run game at a solid 25 FPS

        var last = _time();
        update();

        const keyEvent = function(type, event) {
            var value = type == "down";

            var keyCode = event.which || event.keycode || event.keyCode;
             
            if ( value && !player.isDead ) {

                // move left
                if ( (keyCode == 65 || keyCode == 37) && snakeDirection != "right" ) {
                    snakeDirection = "left";
                }

                // move right
                if ( (keyCode == 68 || keyCode == 39) && snakeDirection != "left" ) {
                    snakeDirection = "right";
                }

                // move up
                if ( (keyCode == 87 || keyCode == 38) && snakeDirection != "down" ) {
                    snakeDirection = "up";
                }

                // move down
                if ( (keyCode == 83 || keyCode == 40) && snakeDirection != "up" ) {
                    snakeDirection = "down";
                }
            }
        };

        // dom events
        $(window).on('keydown', function(e){
            keyEvent("down", e);
        }); 
        $(window).on('keyup', function(e){
            keyEvent("up", e);
        }); 
    });

    const newApple = function(){ // new random apple
        apple.x = Math.floor( Math.random() * (plainX-1) );
        apple.y = Math.floor( Math.random() * (plainY-2) );
    };

    const displayScore = function(){ // updates score on the dom
        $('#game-ui-score > h1').text( 'Score: ' + score );
    };

    // start the game
    const start = function(){

        score = 0;
        snake = []; // reset snake
        snakeLength = 1;
        snakeDirection = false;

        newApple(); // reset apple
        displayScore();

        player.isDead = false; // reset player
        player.x = Math.floor(plainX/2);
        player.y = Math.floor(plainY/2);
        player.hasInit = true;
    };


    scope["gameInterface"] = {
        start
    };




})(window);
