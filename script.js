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
      this.radius=1;
      this.ant = ant;
    }
          
    draw(){
      ct.drawImage(this.ant, this.x - this.radius, this.y - this.radius);
    }
    

    move(){
      // this.detectWallCollision();
      // this.detectBallColiisions();
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
multiAnts(10);
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
   