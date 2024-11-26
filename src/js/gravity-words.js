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
      constraintIterations: 4,
      positionIterations: 6,
      velocityIterations: 4
    });
    
    // Adjust gravity for gentler movement
    this.engine.world.gravity.y = 0;
    this.engine.world.gravity.scale = 0.001;
    
    // Skills with different sizes based on importance
    this.skills = [
      { text: 'leadership', size: 1.4 },
      { text: 'communication', size: 1.3 },
      { text: 'management', size: 1.1 },
      { text: 'organization', size: 1.0 },
      { text: 'planning', size: 0.9 },
      { text: 'sql', size: 0.8 },
      { text: 'java', size: 1.2 },
      { text: 'kotlin', size: 1.1 },
      { text: 'web development', size: 1.3 },
      { text: 'curriculum design', size: 1.4 },
      { text: 'curriculum creation', size: 1.2 },
      { text: 'data visualization', size: 1.1 },
      { text: 'data analysis', size: 1.0 },
      { text: 'collaboration', size: 1.3 },
      { text: 'problem solving', size: 1.2 },
      { text: 'android development', size: 1.1 }
    ];

    this.words = [];
    this.particles = [];
    this.draggedBody = null;
    this.dragVelocity = { x: 0, y: 0 };
    this.lastDragPosition = null;
    this.lastDragTime = null;
    
    // Color palettes
    this.colors = {
      light: ['#89B6A5', '#FFD700', '#FF6B6B'], // sage, gold, coral
      dark: ['#89B6A5', '#FFD700', '#FF6B6B']   // same colors for now
    };
    
    this.currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    
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

  getRandomColor() {
    const colors = this.colors[this.currentTheme];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createWords() {
    // Create header boundaries first
    this.createHeaderBoundaries();

    // Create boundary walls slightly inside the canvas
    const margin = 20;
    const walls = [
      Matter.Bodies.rectangle(this.canvas.width/2, -margin, this.canvas.width + margin*2, margin*2, { 
        isStatic: true,
        restitution: 0.7,
        friction: 0.2
      }),
      Matter.Bodies.rectangle(this.canvas.width/2, this.canvas.height + margin, this.canvas.width + margin*2, margin*2, { 
        isStatic: true,
        restitution: 0.7,
        friction: 0.2
      }),
      Matter.Bodies.rectangle(-margin, this.canvas.height/2, margin*2, this.canvas.height + margin*2, { 
        isStatic: true,
        restitution: 0.7,
        friction: 0.2
      }),
      Matter.Bodies.rectangle(this.canvas.width + margin, this.canvas.height/2, margin*2, this.canvas.height + margin*2, { 
        isStatic: true,
        restitution: 0.7,
        friction: 0.2
      })
    ];
    Matter.World.add(this.engine.world, walls);

    this.skills.forEach((skill, i) => {
      const x = Math.random() * (this.canvas.width - 200) + 100;
      const y = Math.random() * (this.canvas.height - 200) + 100;
      
      const word = Matter.Bodies.rectangle(x, y, 150, 40, {
        chamfer: { radius: 10 },
        density: 0.001,
        frictionAir: 0.02,
        friction: 0.1,
        restitution: 0.8,
        label: skill.text,
        angle: 0,
        color: this.getRandomColor() // Assign random color
      });

      // Add initial random velocity
      const speed = 2;
      const angle = Math.random() * Math.PI * 2;
      Matter.Body.setVelocity(word, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      });

      Matter.World.add(this.engine.world, word);
      this.words.push(word);
    });

    // Add gentle rotation over time
    setInterval(() => {
      this.words.forEach(word => {
        if (!this.draggedBody || word !== this.draggedBody) {
          const rotationSpeed = (Math.random() - 0.5) * 0.02;
          Matter.Body.rotate(word, rotationSpeed);
          
          // Keep rotation within ±30 degrees
          const currentAngle = word.angle % (Math.PI * 2);
          const maxAngle = Math.PI / 6; // 30 degrees
          if (Math.abs(currentAngle) > maxAngle) {
            Matter.Body.setAngle(word, Math.sign(currentAngle) * maxAngle);
          }
        }
      });
    }, 1000);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.words.forEach(word => {
        this.ctx.save();
        this.ctx.translate(word.position.x, word.position.y);
        this.ctx.rotate(word.angle);
        
        // Draw text with random color, no background
        this.ctx.fillStyle = word.color;
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
        
        // Calculate velocity with a maximum speed limit
        if (this.lastDragPosition && this.lastDragTime) {
          const dt = Math.max((currentTime - this.lastDragTime) / 1000, 0.016); // Minimum 16ms (60fps)
          this.dragVelocity = {
            x: (currentPosition.x - this.lastDragPosition.x) / dt,
            y: (currentPosition.y - this.lastDragPosition.y) / dt
          };
          
          // Limit maximum velocity
          const maxVelocity = 15;
          const velocityMagnitude = Math.sqrt(
            this.dragVelocity.x * this.dragVelocity.x + 
            this.dragVelocity.y * this.dragVelocity.y
          );
          
          if (velocityMagnitude > maxVelocity) {
            const scale = maxVelocity / velocityMagnitude;
            this.dragVelocity.x *= scale;
            this.dragVelocity.y *= scale;
          }
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
        // Apply throwing velocity with dampening
        const throwDampening = 0.1; // Reduce this value to make throws gentler
        Matter.Body.setVelocity(this.draggedBody, {
          x: this.dragVelocity.x * throwDampening,
          y: this.dragVelocity.y * throwDampening
        });
      }
      this.draggedBody = null;
      this.lastDragPosition = null;
      this.lastDragTime = null;
      this.dragVelocity = { x: 0, y: 0 };
      canvas.style.cursor = 'default';
    });

    // Enhanced collision handling
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const velocity = pair.collision.velocity;
        const force = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        
        if (force > 3) {
          // Add slight random rotation on collision
          const rotationForce = (Math.random() - 0.5) * 0.1;
          Matter.Body.rotate(pair.bodyA, rotationForce);
          Matter.Body.rotate(pair.bodyB, rotationForce);
        }
      });
    });

    // Add resize handler
    window.addEventListener('resize', () => {
      // Remove old boundaries
      const bodies = Matter.Composite.allBodies(this.engine.world);
      bodies.forEach(body => {
        if (body.isStatic && !this.words.includes(body)) {
          Matter.World.remove(this.engine.world, body);
        }
      });
      
      // Recreate boundaries
      this.createHeaderBoundaries();
    });
  }

  createHeaderBoundaries() {
    // Get all header elements
    const headerTitle = document.querySelector('h1');
    const headerSubtext = document.querySelector('.header-subtext'); // Add class to your "I build..." text
    const arrow = document.querySelector('.scroll-arrow');
    
    const createBoundary = (element) => {
        if (element) {
            const rect = element.getBoundingClientRect();
            // Add some padding around the text
            const padding = 10;
            const boundaryBody = Matter.Bodies.rectangle(
                rect.x + rect.width/2,
                rect.y + rect.height/2,
                rect.width + padding * 2,
                rect.height + padding * 2,
                {
                    isStatic: true,
                    restitution: 0.7,
                    friction: 0.2,
                    render: { visible: false }
                }
            );
            Matter.World.add(this.engine.world, boundaryBody);
        }
    };

    // Create boundaries for each text element
    createBoundary(headerTitle);
    
    // For "I build..." text which might be split into multiple elements
    document.querySelectorAll('.header-text').forEach(element => {
        createBoundary(element);
    });
    
    createBoundary(arrow);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, creating GravityWords');
  new GravityWords();
});