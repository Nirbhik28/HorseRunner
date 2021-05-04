var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var jumpSound , checkPointSound, dieSound;
var sun,sunI;


function preload(){
  trex_running =   loadAnimation("001.png","002.png","003.png","004.png","005.png","006.png","007.png","008.png","009.png","010.png","011.png","012.png","013.png","014.png");
  trex_collided = loadAnimation("001.png");
  
  groundImage = loadImage("unt.png");
  
  cloudImage = loadImage("cloud1.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("reset.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  sunI=loadImage("sun.png")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  sun=createSprite(windowWidth*4/5,windowHeight*1/5,10,10);
  sun.addImage(sunI);
  sun.scale=0.25
  trex = createSprite(windowWidth/12,windowHeight*9/10,20,50);
  trex.scale=1.5;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //trex.debug=true;
  trex.setCollider('circle',0,0,17.5)
  
  
  ground = createSprite(windowWidth/3,windowHeight*9/10,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.depth=0;
  
  
  gameOver = createSprite(windowWidth/2,windowHeight/2);
  gameOver.addImage(gameOverImg);
  
  
  restart = createSprite(windowWidth/2,windowHeight*0.7);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.75;
  restart.scale = 0.25;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(windowWidth/3,(windowHeight*9/10)+5,windowWidth*2/3,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("skyblue");
  text("Score: "+ score, windowWidth*3/6,windowHeight/4);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    //change the trex animation
    trex.changeAnimation("running", trex_running);
    
    if((keyDown("space")||touches.length>0) && trex.collide(invisibleGround)) {
      trex.velocityY = -windowHeight*3/50;
      jumpSound.play();
      touches=[];
    }
  
    trex.velocityY = trex.velocityY + windowHeight/200;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    if(score>0&&score%100===0){
      checkPointSound.play();
    }
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)||touches.length>0)
  { 
    reset();
    touches=[];
  }
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  
  drawSprites();
}

function reset()
{
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  score=0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(windowWidth,windowHeight*6/10,windowWidth/15,windowHeight/20);
    cloud.y = random(windowHeight*2/5,windowHeight*3/5);
    cloud.addImage(cloudImage);
    cloud.scale = 0.15;
    cloud.velocityX =-3;
    
     //assign lifetime to the variable
    cloud.lifetime = 700;
    
    //adjust the depth
    cloud.depth=gameOver.depth;
    gameOver.depth=gameOver.depth+1;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(windowWidth,windowHeight*0.835,windowWidth/60,trex.y);
   obstacle.depth=trex.depth-1;
    obstacle.velocityX = -(8+ 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.40;
    obstacle.lifetime = 400;
    //obstacle.debug=true;
    obstacle.setCollider('rectangle',0,10,205,150)
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

