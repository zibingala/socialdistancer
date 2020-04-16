//number of viruses generated
let virus_count = 80;
//starting safety distance
let virus_distance = 400;
// virus[]= [ virus pos X , virus pos Y , is virus alive 1/0 ]
let virus = [];
//speed of virus's random movement
let virus_speed = 5;
//img used for png of virus
let img;

//PLAYER
//player = [ pos X, pos Y]
let player = [];
let dead = false;

//UTILITIES
//mode 0 = start menu, 1 = game , 2 = you lost , 3 = you won
let mode = 0;
//number of viruses left - decreased by shoot
let frag_left = virus_count;
//textSize calculated from windowSize
let textSIZE;


//projectile
let projectile_count = 0;
//projectile array contains: [posX , posY , velX , velY , life start moment(if 0 -> dead)] 
//VELOCITY OF PROJECTILE DEPENDS ON PLAYER-MOUSE DISTANCE!!!!!
let projectile = [];
//projectile lifetime in milliseconds
let projectile_life = 5 * 1000;




function setup() {
    
createCanvas(windowWidth, windowHeight);
    //define textsize for whole app based on canvas size
    textSIZE=min(displayWidth/20,displayHeight/20);
    

    background(0,100,10);
    
//PLAYER
    //player kezdopozicio
    player[0]=[width/2, height/2];
    
//VIRUS
    img= loadImage('Virus.png');
    //random kezdopozicio a virusoknak
    for (let i = 0; i< virus_count; i++)
        {
    virus[i] = [random(width) , random(height) , 1]; 
            //eltavolitani a kozepetol kezdésnél
    if (abs(width/2-virus[i][0])<virus_distance) {virus[i][0]=virus[i][0]-(width/2-virus[i][0]);}
    if (abs(height/2-virus[i][1])<virus_distance) {virus[i][1]=virus[i][1]-(height/2-virus[i][1]);}
        }
    
    
}

function draw() {
    background(0,100,10,30);
    if(frag_left===0){mode=3;}
    
    
switch(mode){

//YOU START
    case 0 :
 
        textAlign(CENTER);
        textSize(textSIZE);
        fill(random(255),random(255),random(255),50);
               textSize(textSIZE*2);
        text('SOCIAL DISTANCER', width/2, height/2);
                textSize(textSIZE*1);
                fill(random(255),random(255),random(255),50);
        text('SEND HOME W/ CLICK + MOVE w/ WASD', width/2 , height/2 + 3*textSIZE);
                fill(random(255),random(255),random(255),50);
        text('NOW START WITH CLICK', width/2 , height/2 + 5*textSIZE);
        
        
        break;
        
//YOU PLAY
    case 1 :      
    //random movement of virus
    for (let i = 0; i < virus_count; i++)
    {
        if(virus[i][2]===1){
            virus[i][0]= check_x(virus[i][0]+random(-virus_speed,virus_speed));
            virus[i][1]= check_y(virus[i][1]+random(-virus_speed,virus_speed));
        
            imageMode(CENTER);
            tint(255,100,200,200);
            image(img, virus[i][0], virus[i][1]);
    
//VIRUS TOUCHES PLAYER --> PLAYER DIES
        if (contact(virus[i][0], virus[i][1], player[0][0], player[0][1])) {dead=true;mode=2;}
        } //IF(virus[i][2]=1)ends --- az if virus is alive!!
    
    } //for cycle of virus ends
    
    Player_movement();
    
    if(projectile_count>0){Shoot();}
    
//"UI"
textSize(textSIZE);
textAlign(CENTER);
fill(random(255),random(255),random(255),50);
text(frag_left + ' social(s) left to distance', width/2, textSIZE*2);


        break; //mode(1) ends

//YOU LOST
    case 2 :
textSize(textSIZE);
textAlign(CENTER,CENTER);
fill(random(255),random(255),random(255),50);
text('SOMEONE INFECTED YOU!!!', width/2, height/2);
text('CLICK TO RETRY', width/2, height/2 + 2*textSIZE);
        break; //mode(2) ends
        
//YOU WON
    case 3 :
textSize(textSIZE);
textAlign(CENTER,CENTER);
fill(random(255),random(255),random(255),50);
text('DISTANCED SUCCESSFULLY!!!! YOU ARE LEFT ALONE!!!', width/2, height/2);
text('CLICK TO RESTART', width/2, height/2 + 2*textSIZE);
        break;
} //switch(mode) ends
} //draw(ends)



function Player_movement()
{
    if (keyIsDown(87)){player[0][1]-=2;} //W
    if (keyIsDown(83)){player[0][1]+=2;} //S
    if (keyIsDown(65)){player[0][0]-=2;} //A
    if (keyIsDown(68)){player[0][0]+=2;} //D

    
    fill(200,0,0);
    rectMode(CENTER);
    player[0][0] = check_x(player[0][0]);
    player[0][1] = check_y(player[0][1]);
    rect(player[0][0], player[0][1], 50,50);
    
    
}



//checks if two things contacts - returns boolean
function contact(obj1_x, obj1_y, obj2_x , obj2_y )
{
    if(abs(obj1_x-obj2_x) <20 && abs(obj1_y-obj2_y) < 20) 
    { return true; } else{return false;} 
    
}

function check_x(x){    if(x < 0) {x=width;} if(x > width) {x=0;}   return x;}

function check_y(y){    if(y < 0) {y=height;} if(y > height) {y=0;} return y;}



//projectile shoot
function mousePressed()
{
switch(mode)
{case 0 : mode = 1; 

break;
case 1 : 
 projectile_count++;
    // projectile pos inherited from player and velocity based on mouse pos
    projectile[projectile_count-1] = [player[0][0], player[0][1] , (mouseX-player[0][0])/100 , (mouseY-player[0][1])/100 , millis()];
break;
        
    case 2 :
        restart();
    break;
    case 3 :
        restart();
    break;
        
}
}
function Shoot()
{
for(let i = 0; i<projectile_count; i++)
    {   
        if(projectile[i][4]!=0 && millis()-projectile[i][4] < projectile_life) //projectile is alive!
        {
        fill(0,0,255)
        projectile[i][0]= check_x(projectile[i][0]+projectile[i][2]);
        projectile[i][1]= check_y(projectile[i][1]+projectile[i][3]);
        circle(projectile[i][0], projectile[i][1], 20);
        
            //check if contact any virus that is alive!
        for (let k = 0 ; k<virus_count ; k++)
        {
            if(virus[k][2] === 1)
            {
            if(contact(virus[k][0], virus[k][1], projectile[i][0], projectile[i][1])){virus[k][2]=0;projectile[i][4]=0;frag_left--;}    
            }
        }
        
        
        } 
        
        
    }
    
}




function keyPressed()
{
    switch(key){
        case 'w' : player[0][1]-=10; break;
        case 's' : player[0][1]+=10; break;
        case 'a' : player[0][0]-=10; break;
        case 'd' : player[0][0]+=10; break;
    }   
}



function restart()
{
    background(0,100,10);
    
    //player kezdopozicio
    player[0]=[width/2, height/2];
    
    //random kezdopozicio a virusoknak
    for (let i = 0; i< virus_count; i++)
        {
            virus[i] = [random(width) , random(height) , 1]; 
            //eltavolitani a kozepetol kezdésnél
            if (abs(width/2-virus[i][0])<virus_distance) {virus[i][0]=virus[i][0]-(width/2-virus[i][0]);}
            if (abs(height/2-virus[i][1])<virus_distance) {virus[i][1]=virus[i][1]-(height/2-virus[i][1]);}
        }
    frag_left=virus_count;
    projectile_count = 0;
    dead=false;
    mode = 0;
}