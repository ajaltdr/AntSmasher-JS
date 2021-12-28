let ants=[];

const canvas = document.querySelector('canvas');
const ct = canvas.getContext('2d');

canvas.height = window.innerHeight; // gets height of the screen
canvas.width = window.innerWidth; // gets width of the screen


      

// Randomly generates interger for position
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

// Randomly generates interger for position
function getDirection() {
  return Math.random() > 0.5 ? 1 : -1;
}

function getDistance(x1, y1, x2, y2) {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}

  // Generates multiple balls
  function multiAnts(numAnts) {
    const img = new Image();
  img.src = 'ant.png';
  img.onload = () => {
    for (let i = 0; i < numAnts; i++) {
      let radius = 10;
      let x = getRandomInt(radius, canvas.width - radius);
      let y = getRandomInt(radius, canvas.height - radius);
      let dx = getRandomInt(-3, 3);
      let dy = getRandomInt(-3, 3);

      // Detect collision and modify center
      if (i !== 0) {
        for (let j = 0; j < i; j++) {
          let dis = getDistance(x, y, ants[j].x, ants[j].y);
          if (dis <= (radius + ants[j].radius) ** 2) {
            x = getRandomInt(radius, canvas.width - radius);
            y = getRandomInt(radius, canvas.height - radius);
            j = -1;
          }
        }
      }

        let myAnts = new Ants(x, y, dx, dy, img)
        ants.push(myAnts);
    }    
  }}


class Ants{
    constructor(x, y, dx, dy,ant){
      this.x=x;
      this.y=y;
      this.dx=dx;
      this.dy=dy;
      this.radius=10;
      this.ant = ant;
    }

    // Detects collision with walls
    detectWallCollision() {
      if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0)
        this.dx = -this.dx;
      if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0)
        this.dy = -this.dy;
    };

    // Bounce Back after colliding with another ball
    bounceBack = (secondBall) => {
      let vecCollision = { x: this.x - secondBall.x, y: this.y - secondBall.y }; //creating a vector for the collision that took place
      let distance = Math.sqrt(getDistance(this.x, this.y, secondBall.x, secondBall.y)); //the distance of the collision vector
  

      // normalized collision vector
      let normVector = {
        x: vecCollision.x / distance,
        y: vecCollision.y / distance,
      };
      
      // relative velocity of the
      let relVelocity = {
        x: this.dx - secondBall.dx,
        y: this.dy - secondBall.dy,
      };
      
      // the speed of the collision
      let speed = relVelocity.x * normVector.x + relVelocity.y * normVector.y;
  
      this.dx -= speed * normVector.x;
      this.dy -= speed * normVector.y;
      secondBall.dx += speed * normVector.x;
      secondBall.dy += speed * normVector.y;
    };

    // Detects collision with another ball
    detectAntColiisions(){
      for (let k = 0; k < ants.length; k++) {
          if (this === ants[k]) continue;
    
          if (getDistance
              (
                  this.x, this.y, ants[k].x, ants[k].y) <=
                      (this.radius + ants[k].radius) ** 2
              ) {
                console.log("colided")
                  this.bounceBack(ants[k]);

               }
          }
        }
          
    draw(){
      ct.drawImage(this.ant, this.x - this.radius, this.y - this.radius,20,20);
    }
    

    move(){
      this.detectWallCollision();
      this.detectAntColiisions();
      this.x += this.dx;
      this.y += this.dy;
      this.draw();
  
  };
  }

  // RequestAnimationFrame 
function animate(){
  requestAnimationFrame(animate);
  ct.clearRect(0, 0, canvas.width, canvas.height);
  ants.forEach((myAnts) => myAnts.move());
  
}

// Passing the number of balls
multiAnts(50);
animate();
      
const destruct = (ant) => {
  const updatedAnts = ants.filter((items, index) => ant !== index);
  ants = updatedAnts;
};

canvas.addEventListener('mousedown', (event) => {
  let x = event.x;
  let y = event.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  for (let i = 0; i < ants.length; i++) {
    if (getDistance(x, y, ants[i].x, ants[i].y) <= ants[i].radius ** 2) {
      destruct(i);
    }
  }
});
   