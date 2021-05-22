var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pokemon, pokemon_running, pokemon_collided;
var backgroundImage, invisibleGround;

var obstaclesGroup, obstacle1, obstacle2;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var sol,solImage;

function preload(){
  pokemon_running =loadAnimation("pokemon1.png","pokemon2.png");
  pokemon_collided = loadAnimation("pokemon_collided.png");
  
  backgroundImage = loadImage("fondo0.png");
  
  solImage=loadImage("sol.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  
  //crea el fondo
  scene = createSprite(width,100);
  scene.addImage(backgroundImage);
 scene.scale = 0.5;
 
   edges= createEdgeSprites();
  

  var message = "This is a message";
 console.log(message)
  
  pokemon = createSprite(width/9,height-600,20,50);
  pokemon.addAnimation("running", pokemon_running);
  pokemon.addAnimation("collided", pokemon_collided);
  
  invisibleGround = createSprite(width/300,195,600,10);
  invisibleGround.visible = false;
 
  pokemon.scale = 0.3;
  
  sol = createSprite(width/19,height/25,10,200);
  sol.addImage("sol",solImage);
  sol.scale=0.045
 
  gameOver = createSprite(width/2,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();

  
  pokemon.setCollider("rectangle",0,0,pokemon.width,pokemon.height-70);
  pokemon.debug = true
  
  score = 0;
  
}

function draw() {
  
    background(0);
  //fondo en movimiento
    scene.velocityX = -6
   
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
  
    scene.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
       if (scene.x < 0){
      scene.x = scene. width/5 ;
          
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& pokemon.y >= 100) {
        pokemon.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    pokemon.velocityY = pokemon.velocityY + 0.8
  
   
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(pokemon)){
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     scene.velocityX=0;
     
      
      //change the trex animation
      pokemon.changeAnimation("collided", pokemon_collided);
    
  if(mousePressedOver(restart)) {
      reset();
   }
    
      pokemon.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
   
     obstaclesGroup.setVelocityXEach(0);
       
     
   }
  
 
  //stop trex from falling down
  pokemon.collide(invisibleGround);
console.log(gameState)
  drawSprites();
   //displaying score
  text("Score: "+ score, 2*width/3,height-570);
}

function reset(){
 gameState=PLAY;
 gameOver.visible=false
 restart.visible=false
  obstaclesGroup.destroyEach();
  pokemon.changeAnimation("running",pokemon_running);
  score=0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width/2,165 ,10,40);
   obstacle.velocityX = -(5+ score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale=0.11 ;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale=0.16;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
   
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}