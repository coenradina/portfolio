class GravityWords {
  constructor() {
    // Debug log
    console.log('Initializing GravityWords');
    
    this.canvas = document.getElementById('gravityCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set initial canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Debug background to see if canvas is rendering
    this.ctx.fillStyle = 'rgba(137, 182, 165, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.engine = Matter.Engine.create({ 
      enableSleeping: false,
      gravity: { x: 0, y: 0 }
    });
    
    // Skills with different sizes based on importance
    this.skills = [
      { text: 'Leadership', size: 1.2 },
      { text: 'Communication', size: 1.2 },
      { text: 'Management', size: 1.1 },
      { text: 'Organization', size: 1.1 },
      { text: 'Planning', size: 1.0 },
      { text: 'SQL', size: 1.0 },
      { text: 'Web Development', size: 1.1 },
      { text: 'Curriculum Design', size: 1.2 }
    ];

    this.words = [];
    this.particles = [];
    this.draggedBody = null;
    this.dragVelocity = { x: 0, y: 0 };
    this.lastDragPosition = null;
    this.lastDragTime = null;
    
    // Initialize immediately
    this.init();
  }

  init() {
    console.log('Starting initialization');
    this.createWords();
    this.setupEvents();
    
    // Start the physics engine
    Matter.Runner.run(this.engine);
    
    // Start animation loop
    this.animate();
    console.log('Initialization complete');
  }

  createWords() {
    this.skills.forEach((skill, i) => {
      const x = Math.random() * (this.canvas.width - 200) + 100;
      const y = Math.random() * (this.canvas.height - 200) + 100;
      
      const word = Matter.Bodies.rectangle(x, y, 150, 40, {
        render: { fillStyle: 'rgba(137, 182, 165, 0.8)' },
        chamfer: { radius: 10 },
        density: 0.001,
        frictionAir: 0.05,
        restitution: 0.8,
        label: skill.text,
        isStatic: false  // Make words dynamic again
      });

      Matter.World.add(this.engine.world, word);
      this.words.push(word);
      console.log(`Created word: ${skill.text} at ${x},${y}`);
    });

    // Add boundaries to keep words contained
    const walls = [
      Matter.Bodies.rectangle(this.canvas.width/2, -10, this.canvas.width, 20, { isStatic: true }), // top
      Matter.Bodies.rectangle(this.canvas.width/2, this.canvas.height+10, this.canvas.width, 20, { isStatic: true }), // bottom
      Matter.Bodies.rectangle(-10, this.canvas.height/2, 20, this.canvas.height, { isStatic: true }), // left
      Matter.Bodies.rectangle(this.canvas.width+10, this.canvas.height/2, 20, this.canvas.height, { isStatic: true }) // right
    ];
    Matter.World.add(this.engine.world, walls);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.words.forEach(word => {
      this.ctx.save();
      this.ctx.translate(word.position.x, word.position.y);
      this.ctx.rotate(word.angle);
      
      // Draw background with hover effect
      this.ctx.fillStyle = word === this.draggedBody ? 
        'rgba(255, 255, 255, 0.2)' : 
        'rgba(255, 255, 255, 0.1)';
      this.ctx.fillRect(-75, -20, 150, 40);
      
      // Draw text
      this.ctx.fillStyle = '#89B6A5';
      this.ctx.font = '16px "Fira Code"';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(word.label, 0, 0);
      
      this.ctx.restore();
    });
    
    requestAnimationFrame(() => this.animate());
  }

  setupEvents() {
    const canvas = this.canvas;
    
    canvas.addEventListener('mousedown', (e) => {
      const mousePosition = {
        x: e.offsetX,
        y: e.offsetY
      };
      
      const clickedBody = this.words.find(word => {
        const bounds = word.bounds;
        return mousePosition.x >= bounds.min.x && 
               mousePosition.x <= bounds.max.x && 
               mousePosition.y >= bounds.min.y && 
               mousePosition.y <= bounds.max.y;
      });

      if (clickedBody) {
        this.draggedBody = clickedBody;
        this.lastDragPosition = mousePosition;
        this.lastDragTime = Date.now();
        canvas.style.cursor = 'grabbing';
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (this.draggedBody) {
        const currentPosition = { x: e.offsetX, y: e.offsetY };
        const currentTime = Date.now();
        
        // Calculate velocity
        if (this.lastDragPosition && this.lastDragTime) {
          const dt = (currentTime - this.lastDragTime) / 1000; // Convert to seconds
          this.dragVelocity = {
            x: (currentPosition.x - this.lastDragPosition.x) / dt,
            y: (currentPosition.y - this.lastDragPosition.y) / dt
          };
        }
        
        Matter.Body.setPosition(this.draggedBody, currentPosition);
        Matter.Body.setVelocity(this.draggedBody, { x: 0, y: 0 });
        
        this.lastDragPosition = currentPosition;
        this.lastDragTime = currentTime;
      } else {
        // Hover effect
        const mousePosition = { x: e.offsetX, y: e.offsetY };
        const hoveredBody = this.words.find(word => {
          const bounds = word.bounds;
          return mousePosition.x >= bounds.min.x && 
                 mousePosition.x <= bounds.max.x && 
                 mousePosition.y >= bounds.min.y && 
                 mousePosition.y <= bounds.max.y;
        });
        canvas.style.cursor = hoveredBody ? 'grab' : 'default';
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.draggedBody && this.dragVelocity) {
        // Apply throwing velocity
        Matter.Body.setVelocity(this.draggedBody, {
          x: this.dragVelocity.x * 0.2, // Reduce velocity for more control
          y: this.dragVelocity.y * 0.2
        });
      }
      this.draggedBody = null;
      this.lastDragPosition = null;
      this.lastDragTime = null;
      this.dragVelocity = { x: 0, y: 0 };
      canvas.style.cursor = 'default';
    });

    // Add collision detection
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const velocity = pair.collision.velocity;
        const force = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (force > 3) {
          // Add collision effects here if desired
          console.log('Collision!', force);
        }
      });
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, creating GravityWords');
  new GravityWords();
});