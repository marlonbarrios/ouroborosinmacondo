'use client';

import { useEffect, useRef, useState } from 'react';

export default function DigitalOrganism({ className = '' }: { className?: string }) {
  const [isClient, setIsClient] = useState(false);
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sketchRef.current || !isClient) return;

    const loadLibraries = async () => {
      const [p5Module, ToneModule] = await Promise.all([
        import('p5'),
        import('tone')
      ]);
      
      const p5 = p5Module.default;
      const Tone = ToneModule;

      const sketch = (p: any) => {
        // AI Story Generation Variables
        let storyDisplay: any;
        let storyText: any;
        let lastStoryTime = 0;
        const storyInterval = 30000; // Generate story every 30 seconds
        let currentActivity = 'wandering';
        let activityHistory: any[] = [];
        let storyQueue: any[] = [];
        let isGeneratingStory = false;

        // Story variables for display
        let currentStoryText = '';
        let storyOpacity = 0;
        let tickerX = 0;
        const storiesStarted = true; // Auto-start
        
        // Language variables
        let selectedLanguage = 'English';
        let showLanguageDropdown = false;
        const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese', 'Arabic', 'Russian'];

        // Activity detection variables
        const activityDetector: {
            lastPosition: any | null,
            movementHistory: number[],
            currentState: string,
            stateStartTime: number,
            restingThreshold: number,
            exploringThreshold: number,
            huntingThreshold: number
        } = {
            lastPosition: null,
            movementHistory: [],
            currentState: 'wandering',
            stateStartTime: 0,
            restingThreshold: 0.5,
            exploringThreshold: 2.0,
            huntingThreshold: 1.5
        };

        // The amount of points in the path
        const points = 40;  // Fixed number of segments

        // The distance between the points (will be adjusted based on canvas size)
        const baseSegmentLength = 45;
        let segmentLength: number;

        // Array to store all points of the snake
        const segments: any[] = [];

        // Variables for Perlin noise
        let noiseOffsetX = 0;
        let noiseOffsetY = 10000;
        const baseNoiseSpeed = 0.02;
        let noiseSpeed = baseNoiseSpeed;
        const baseNoiseAmount = 30;
        let noiseAmount: number;

        // Variables for autonomous movement
        let targetX: number;
        let targetY: number;
        const changeDirectionTime = 0;
        const directionInterval = 100;
        let speedMultiplier = 1;
        const restTimer = 0;

        // Sound variables
        let osc: any;
        let reverb: any;
        let delay: any;
        let filter: any;
        const soundTimer = 0;
        const soundInterval = 100;
        let soundEnabled = false;
        let audioStarted = false;

        // Movement variables
        let lastPosition: any;
        let movementAmount = 0;
        const soundThreshold = 0.5;
        let lastSoundTime = 0;
        const minSoundInterval = 50;
        const lastSoundIntensity = 0;
        let soundDecay = 0.95;

        // Rest variables
        let isResting = false;
        let restPosition: any = null;
        let restDuration = 0;
        let timeSinceLastRest = 0;
        let minTimeBetweenRests = 600;

        // Edge exploration variables
        let edgeExploring = false;
        let edgeTimer = 0;
        let edgePoint: any = null;
        let edgeDirection = 1;
        let edgeParticles: any[] = [];

        // Evolution variables
        let evolutionTime = 0;
        let complexityLevel = 0;
        let maxComplexity = 5;
        let lastEvolutionCheck = 0;
        let evolutionInterval = 30000;

        // Glow variables
        let headGlow = 0;
        let maxGlow = 1.5;
        let glowDecay = 0.95;
        let edgeGlowDistance = 200;
        let edgeIntensity = 0;

        // Body glow variables
        let bodyGlow: number[] = [];
        let maxBodyGlow = 2.0;
        let bodyGlowDecay = 0.97;

        // Click variables
        let clickOsc: any;
        let clickEnv: any;
        let lastClickTime = 0;
        let minClickInterval = 100;
        let clickIntensity = 0;

        // Self exploration variables
        let selfExploring = false;
        let selfExploreTimer = 0;
        let selfExploreTarget = 0;
        let squeakOsc: any;
        // let squeakEnv: any; // Removed unused variable
        let lastSqueakTime = 0;

        // Velocity tracking variables
        const velocityHistory: number[] = [];
        const historyLength = 10;
        let turnAmount = 0;
        let lastDirection: any;

        // Snake metrics variables
        let curvature = 0;
        let bendAmount = 0;
        let stretchAmount = 0;

        // Sniffing variables
        let sniffingIntensity = 0;
        let sniffingFrequency = 0;
        // Removed other unused sniffing variables
        // const sniffingPhase = 0; 
        // const lastSniffPoint: any = null;
        const harmonics: any[] = [];
        // const sniffingSoundTimer = 0;

        // Drone variables
        let droneOsc1: any, droneOsc2: any;
        let droneFilter: any;
        // Removed other unused drone variables
        // let droneLfo: any;
        // let droneReverb: any;
        let droneDepth = 0;

        // Intersection variables
        let intersectionEffects: any[] = [];
        let maxIntersectionEffects = 20;
        let intersectionGlow = 0;
        let intersectionSound: any;
        let lastIntersectionSound = 0;
        let minIntersectionSoundInterval = 300;

        // Ouroboros variables
        let isOuroboros = false;
        let ouroborosTimer = 0;
        let ouroborosEffects: any[] = [];
        let ouroborosSound: any;
        let lastOuroborosSound = 0;
        let ouroborosDuration = 180;

        // Trail variables
        let trail: any[] = [];
        let trailLength = 300;
        let trailOpacity: number[] = [];
        let trailDecay = 0.997;
        let trailWidth = 100;
        let trailSpread = 2;

        // Nutrient variables
        let nutrients: any[] = [];
        let metabolicTimer = 0;
        let metabolicRate = 0.015;
        let maxNutrients = 400;
        let reabsorptionRadius = 150;

        // Food particle variables
        let foodParticles: any[] = [];
        let attractionForce = 0.5;
        let foodRadius = 15;
        let maxFoodParticles = 50;
        let foodAttractionRadius = 200;

        // Organism growth variables
        let organismSize = 1.0;
        let maxOrganismSize = 2.5;
        let digestionEnergy = 0;
        let energyDecayRate = 0.001;
        let particleNutrition = 0.05;

        // Background color variables
        let bgColor = {
            r: 5,
            g: 5,
            b: 10,
            targetR: 5,
            targetG: 5,
            targetB: 10,
            noiseOffsetR: 0,
            noiseOffsetG: 1000,
            noiseOffsetB: 2000,
            noiseSpeed: 0.0005,
            lerpSpeed: 0.005
        };

        // Day/night cycle
        let dayNightCycle = {
            hour: 0,
            brightness: 0,
            lastUpdate: 0,
            updateInterval: 1000,
            activityLevel: 0,
            minBrightness: 0.02,
            maxBrightness: 0.2,
            minActivity: 0.3,
            maxActivity: 1.5,
            colors: {
                night: { r: 15, g: 113, b: 115 },
                dawn: { r: 216, g: 164, b: 127 },
                day: { r: 239, g: 131, b: 84 },
                dusk: { r: 238, g: 75, b: 106 },
                deepNight: { r: 223, g: 59, b: 87 }
            }
        };

        // Performance tracking variables
        let lastFrameTime = 0;
        let frameTimeThreshold = 1000/30; // 30 FPS minimum
        let lastCleanupTime = 0;
        let cleanupInterval = 1000; // Cleanup every second
        let isProcessingCluster = false;
        let maxProcessingTime = 16; // Max ms for processing

        // Safety limits
        let MAX_TRAIL_LENGTH = 300;
        let MAX_NUTRIENT_AGE = 10;
        let MAX_CLUSTER_SIZE = 15;
        let MIN_PERFORMANCE_FPS = 30;

        // Nutrient folding variables
        let foldingNutrients = false;
        let foldTarget = null;
        let foldProgress = 0;
        let foldDuration = 150;
        let nutrientCluster: any[] = [];
        let digestingTimer = 0;

        // Evolution state
        let evolutionState = {
            movement: 0,
            sound: 0,
            awakening: 0,
            startTime: 0,
            evolutionDuration: 180000
        };

        // Volume fluctuation
        let volumeFluctuation = 0;
        let volumeNoiseOffset = 0;
        let volumeNoiseSpeed = 0.001;
        let volumeNoiseAmount = 0.3;

        // Fragment system
        let fragments: any[] = [];
        let fragmenting = false;
        let reassembling = false;
        let fragmentTimer = 0;
        let fragmentDuration = 200;

        // Spawn particles
        let spawnParticles: any[] = [];

        // Absorption particles
        let absorptionParticles: any[] = [];
        
        // Glow trail particles for head movement
        let glowTrailParticles: any[] = [];
        const maxTrailParticles = 50;

        // Evolution variables
        let evolutionLevel = 0;
        let maxEvolution = 5;
        let growthFactor = 1.0;
        let colorEvolution = 0;
        let soundEvolution = 0;
        let lastTouchTime = 0;
        let touchCooldown = 1000;

        // Define the strict color palette
        const PALETTE = {
            deepTeal: { r: 25, g: 83, b: 95 },    // 19535f
            jade: { r: 11, g: 122, b: 117 },      // 0b7a75
            sand: { r: 215, g: 201, b: 170 },     // d7c9aa
            rust: { r: 123, g: 45, b: 38 },       // 7b2d26
            pearl: { r: 240, g: 243, b: 245 }     // f0f3f5
        };

        // Audio setup
        async function setupAudio() {
          try {
            await Tone.start();
            
            // Initialize audio components with proper gain
            osc = new Tone.Oscillator({
              frequency: 440,
              type: "sawtooth",
              volume: -12
            });
            
            reverb = new Tone.Reverb({
              decay: 2,
              wet: 0.3
            }).toDestination();
            
            delay = new Tone.PingPongDelay({
              delayTime: 0.2,
              feedback: 0.4,
              wet: 0.2
            }).connect(reverb);
            
            filter = new Tone.Filter({
              frequency: 800,
              type: "lowpass",
              Q: 3
            }).connect(delay);
            
            osc.connect(filter);
            
            // Initialize drone oscillators
            droneOsc1 = new Tone.Oscillator({
              frequency: 40,
              type: "sine",
              volume: -24
            }).connect(reverb);
            
            droneOsc2 = new Tone.Oscillator({
              frequency: 43,
              type: "sine",
              volume: -24
            }).connect(reverb);
            
            droneFilter = new Tone.Filter({
              frequency: 800,
              type: "lowpass",
              Q: 12
            }).connect(reverb);
            
            // Click and squeak sounds
            clickOsc = new Tone.Oscillator({
              frequency: 1000,
              type: "sine",
              volume: -18
            }).connect(filter);
            
            squeakOsc = new Tone.Oscillator({
              frequency: 300,
              type: "sine",
              volume: -18
            }).connect(filter);
            
            // Intersection sound synth
            intersectionSound = new Tone.Synth({
              oscillator: { type: "sine" },
              envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.2,
                release: 0.5
              },
              volume: -20 // Safe volume setting
            }).connect(reverb);
            
            // Ouroboros sound - a mystical chord
            ouroborosSound = new Tone.PolySynth(Tone.Synth, {
              oscillator: { type: "sine" },
              envelope: {
                attack: 0.02,
                decay: 0.3,
                sustain: 0.4,
                release: 1
              },
              volume: -25 // Safe volume setting
            }).connect(reverb);
            
            console.log('Audio system initialized');
          } catch (error) {
            console.error('Audio setup failed:', error);
          }
        }

        p.setup = () => {
          let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
          canvas.position(0, 0);
          canvas.style('pointer-events', 'auto');
          
          // Initialize segment length based on canvas size
          segmentLength = baseSegmentLength * (p.sqrt(p.windowWidth * p.windowHeight) / p.sqrt(800 * 600));
          noiseAmount = baseNoiseAmount * (p.sqrt(p.windowWidth * p.windowHeight) / p.sqrt(800 * 600));
          
          // Initialize the snake segments in a relaxed curve
          let centerX = p.windowWidth / 2;
          let centerY = p.windowHeight / 2;
          
          for (let i = 0; i < points; i++) {
            // Create a gentle S-curve with some natural variation
            let t = i / (points - 1);  // Normalized position along the snake
            let curveX = centerX + p.sin(t * p.PI * 1.5) * 200;  // Wider, gentler curve
            
            // Add some height variation for a more natural rest position
            let curveY = centerY + p.cos(t * p.PI * 2) * 100 + p.sin(t * p.PI * 0.5) * 50;  // Combined waves for organic shape
            
            // Add some random variation
            let offsetX = p.noise(i * 0.5) * 40 - 20;
            let offsetY = p.noise(i * 0.5 + 100) * 40 - 20;
            
            let x = curveX + offsetX;
            let y = curveY + offsetY;
            
            segments.push(p.createVector(x, y));
          }
          
          // Initialize target position at the head of the snake
          targetX = segments[0].x;
          targetY = segments[0].y;
          
          // Initialize body glow array
          for (let i = 0; i < points; i++) {
            bodyGlow.push(0);
          }
          
          // Initialize trail arrays
          for (let i = 0; i < trailLength; i++) {
            trail.push(p.createVector(0, 0));
            trailOpacity.push(0);
          }
          
          // Setup audio
          setupAudio();
          
          // Set initial background color
          updateBackground();
          
          console.log('Digital organism ready. Press SPACEBAR for stories every 30 seconds.');
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          // Adjust snake properties based on new canvas size
          segmentLength = baseSegmentLength * (p.sqrt(p.windowWidth * p.windowHeight) / p.sqrt(800 * 600));
          noiseAmount = baseNoiseAmount * (p.sqrt(p.windowWidth * p.windowHeight) / p.sqrt(800 * 600));
          
          // Ensure snake is within bounds after resize
          for (let segment of segments) {
            segment.x = p.constrain(segment.x, 0, p.windowWidth);
            segment.y = p.constrain(segment.y, 0, p.windowHeight);
          }
          
          // Update target position if it's out of bounds
          targetX = p.constrain(targetX, 100, p.windowWidth - 100);
          targetY = p.constrain(targetY, 100, p.windowHeight - 100);
        };

        p.keyPressed = () => {
          if (p.key === ' ') {
            // Spacebar triggers story generation
            generateStory();
            lastStoryTime = p.millis();
            
            // Also enable sound if not started
            if (!soundEnabled) {
              soundEnabled = true;
              audioStarted = true;
              
              if (Tone.context.state !== 'running') {
                Tone.start().then(() => {
                  startSound();
                });
              } else {
                startSound();
              }
              console.log('Sound enabled');
            }
          }
        };

        function startSound() {
          if (osc && !osc.started) {
            osc.start();
          }
          
          if (droneOsc1 && !droneOsc1.started) {
            droneOsc1.start();
          }
          
          if (droneOsc2 && !droneOsc2.started) {
            droneOsc2.start();
          }
          
          console.log('Sound components started');
        }

        // Main draw function
        p.draw = () => {
          try {
            // Performance check
            let currentTime = p.millis();
            let frameTime = currentTime - lastFrameTime;
            if (frameTime > frameTimeThreshold) {
              cleanupResources();
            }
            lastFrameTime = currentTime;
            
            // Regular cleanup
            if (currentTime - lastCleanupTime > cleanupInterval) {
              cleanupResources();
              lastCleanupTime = currentTime;
            }
            
            // Clear and update background with full organic color system
            p.clear();
            updateBackground();
            
            // Store last valid position
            if (!lastPosition) {
              lastPosition = p.createVector(segments[0].x, segments[0].y);
            }
            
            // Evolve complexity over time
            evolveComplexity();
            
            // Detect current activity
            currentActivity = detectActivity();
            
            // Update time-based behavior
            updateTimeBasedBehavior();
            
            // Update evolution system
            updateEvolution();
            
            // Update movement behavior
            updateMovement();
            
            // Update segments
            updateSegments();
            
            // Calculate movement metrics
            calculateMovementMetrics();
            
            // Update metabolic cycle
            updateMetabolicCycle();
            
            // Update trail with full organic behavior
            updateTrail();
            
            // Draw nutrients FIRST (before trail and snake)
            // Draw story ticker first (background layer)
            drawStoryTicker();
            
            drawNutrients();
            
            // Draw trail (underneath the snake) with organic colors
            drawTrail();
            
            // Draw the organism with full palette system
            drawOrganism();
            
            // Draw glowing trail behind the head
            updateAndDrawGlowTrail();
            
            // Update and draw food particles
            updateFoodParticles();
            
            // Add food attraction behavior
            if (foodParticles.length > 0) {
              attractToFood();
            }
            
            // Update spawn effects
            updateSpawnEffects();
            
            // Update digestion effects
            updateDigestionEffects();
            
            // Update growth system
            updateGrowth();
            
            // Update sound system with COMPLETE isolation - VISUAL NEVER AFFECTED
            if (soundEnabled && audioStarted) {
              // Schedule audio updates asynchronously to completely isolate from visual rendering
              setTimeout(() => {
                try {
                  updateSound();
                } catch (error) {
                  console.warn('updateSound error (visual protected):', error);
                  // Disable problematic audio temporarily
                  soundEnabled = false;
                  setTimeout(() => { soundEnabled = true; }, 1000);
                }
              }, 0);
              
              setTimeout(() => {
                try {
                  updateDrone();
                } catch (error) {
                  console.warn('updateDrone error (visual protected):', error);
                }
              }, 1);
              
              setTimeout(() => {
                try {
                  updateAmbientSound();
                } catch (error) {
                  console.warn('updateAmbientSound error (visual protected):', error);
                }
              }, 2);
            }
            
            // Draw language dropdown
            drawLanguageDropdown();
            
            // Auto-generate stories
            if (storiesStarted && p.millis() - lastStoryTime > storyInterval) {
              generateStory();
              lastStoryTime = p.millis();
            }
            
            // Check for intersections and Ouroboros
            checkSelfIntersection();
            updateIntersectionEffects();
            updateOuroborosEffects();
            
            // Update environment displays
            updateEnvironmentDisplay();
            
          } catch (e) {
            console.error('Draw error:', e);
            // Reset critical states
            foldingNutrients = false;
            isProcessingCluster = false;
            nutrients = nutrients || [];
          }
        };

        function updateMovement() {
          if (!p.mouseIsPressed) {
            timeSinceLastRest++;
            
            // Check if snake should rest
            if (!isResting && timeSinceLastRest > minTimeBetweenRests && p.random(1) < 0.005) {
              isResting = true;
              restDuration = p.random(200, 400);
              
              restPosition = p.createVector(
                p.random(100, p.width - 100),
                p.height - p.random(50, 150)
              );
              
              speedMultiplier = 0.3;
              edgeExploring = false;
            }
            
            if (isResting) {
              targetX = restPosition.x + p.sin(p.frameCount * 0.02) * 15;
              targetY = restPosition.y + p.cos(p.frameCount * 0.02) * 5;
              
              restDuration--;
              if (restDuration <= 0) {
                isResting = false;
                timeSinceLastRest = 0;
                speedMultiplier = 1;
              }
            } else if (!edgeExploring) {
              // Random chance to start edge exploration
              if (p.random(1) < 0.02) {
                startEdgeExploration();
              }
            }
            
            if (edgeExploring) {
              updateEdgeExploration();
            }
            
            if (!p.mouseIsPressed && !isResting && !edgeExploring) {
              updateAutonomousMovement();
            }
            
            speedMultiplier = p.constrain(1 + complexityLevel * 0.2, 0.5, 2.5);
          } else {
            // Mouse control
            isResting = false;
            timeSinceLastRest = 0;
            targetX = p.mouseX;
            targetY = p.mouseY;
            speedMultiplier = 2;
            edgeExploring = false;
          }
          
          // Check for self exploration
          if (!isResting && !edgeExploring && p.random(1) < 0.01) {
            selfExploring = true;
            selfExploreTimer = p.random(100, 200);
            selfExploreTarget = p.floor(p.random(5, segments.length - 1));
          }
          
          if (selfExploring) {
            updateSelfExploration();
          }
        }

        function startEdgeExploration() {
          edgeExploring = true;
          edgeTimer = p.random(200, 400);
          let side = p.floor(p.random(4));
          switch(side) {
            case 0: // top
              edgePoint = p.createVector(p.random(p.width), 50);
              break;
            case 1: // right
              edgePoint = p.createVector(p.width - 50, p.random(p.height));
              break;
            case 2: // bottom
              edgePoint = p.createVector(p.random(p.width), p.height - 50);
              break;
            case 3: // left
              edgePoint = p.createVector(50, p.random(p.height));
              break;
          }
          edgeDirection = p.random(1) < 0.5 ? 1 : -1;
        }

        function updateEdgeExploration() {
          // Enhanced sniffing behavior near edges
          sniffingIntensity = p.lerp(sniffingIntensity, 1.5, 0.1);
          sniffingFrequency = p.map(speedMultiplier, 0.5, 1.2, 0.2, 0.4);
          
          // More dramatic edge movement
          let edgeOffset = p.sin(p.frameCount * 0.1) * 30;
          let investigationDepth = p.sin(p.frameCount * 0.05) * 40;
          
          // Create investigation particles
          if (p.frameCount % 5 === 0) {
            edgeParticles.push({
              x: segments[0].x + p.random(-20, 20),
              y: segments[0].y + p.random(-20, 20),
              age: 0,
              size: p.random(4, 8),
              color: p.color(255, 200, 200, 200)
            });
          }
          
          // Update edge behavior based on position
          if (edgePoint.x < 100) {  // Left edge
            edgePoint.y += edgeDirection * 3;
            targetX = 50 + edgeOffset;
            targetY = edgePoint.y + investigationDepth;
            edgeIntensity = p.map(segments[0].x, 100, 0, 0, 1);
          } else if (edgePoint.x > p.width - 100) {  // Right edge
            edgePoint.y += edgeDirection * 3;
            targetX = p.width - 50 + edgeOffset;
            targetY = edgePoint.y + investigationDepth;
            edgeIntensity = p.map(segments[0].x, p.width-100, p.width, 0, 1);
          } else if (edgePoint.y < 100) {  // Top edge
            edgePoint.x += edgeDirection * 3;
            targetX = edgePoint.x + investigationDepth;
            targetY = 50 + edgeOffset;
            edgeIntensity = p.map(segments[0].y, 100, 0, 0, 1);
          } else {  // Bottom edge
            edgePoint.x += edgeDirection * 3;
            targetX = edgePoint.x + investigationDepth;
            targetY = p.height - 50 + edgeOffset;
            edgeIntensity = p.map(segments[0].y, p.height-100, p.height, 0, 1);
          }
          
          // Update and draw edge particles
          for (let i = edgeParticles.length - 1; i >= 0; i--) {
            let particle = edgeParticles[i];
            particle.age += 0.05;
            
            // Particle movement
            let angle = p.noise(particle.x * 0.01, particle.y * 0.01, p.frameCount * 0.02) * p.TWO_PI;
            particle.x += p.cos(angle) * 2;
            particle.y += p.sin(angle) * 2;
            
            // Draw particle with glow
            p.noStroke();
            for (let j = 3; j > 0; j--) {
              let alpha = p.map(j, 3, 0, 50, 150) * (1 - particle.age);
              particle.color.setAlpha(alpha);
              p.fill(particle.color);
              p.circle(particle.x, particle.y, particle.size * j);
            }
            
            // Remove old particles
            if (particle.age > 1) {
              edgeParticles.splice(i, 1);
            }
          }
          
          // Add extra glow when near edges
          headGlow = p.max(headGlow, edgeIntensity * 2);
          
          // Sound effects for edge exploration
          if (soundEnabled && audioStarted) {
            makeClickSound();
          }
          
          edgeTimer--;
          if (edgeTimer <= 0) {
            edgeExploring = false;
          }
        }

        function updateSelfExploration() {
          let target = segments[selfExploreTarget];
          targetX = target.x + p.sin(p.frameCount * 0.1) * 20;
          targetY = target.y + p.cos(p.frameCount * 0.1) * 20;
          
          // Calculate distance to target segment
          let distToTarget = p.dist(segments[0].x, segments[0].y, target.x, target.y);
          
          // Make squeak sound based on proximity
          if (distToTarget < 50 && soundEnabled && audioStarted) {
            let intensity = p.map(distToTarget, 50, 10, 0, 1, true);
            makeSqueakSound(intensity);
          }
          
          selfExploreTimer--;
          if (selfExploreTimer <= 0) {
            selfExploring = false;
          }
        }

        function updateAutonomousMovement() {
          let safeComplexity = p.constrain(complexityLevel, 0, maxComplexity);
          
          let xAdd = p.sin(p.frameCount * (0.02 + safeComplexity * 0.01)) * (10 + safeComplexity * 5);
          let yAdd = p.cos(p.frameCount * (0.015 + safeComplexity * 0.01)) * (10 + safeComplexity * 5);
          
          targetX += p.constrain(xAdd, -50, 50);
          targetY += p.constrain(yAdd, -50, 50);
          
          targetX = p.constrain(targetX, 50, p.width - 50);
          targetY = p.constrain(targetY, 50, p.height - 50);
        }

        function updateSegments() {
          // Ensure target is within bounds first
          targetX = p.constrain(targetX, 50, p.width - 50);
          targetY = p.constrain(targetY, 50, p.height - 50);
          
          // Add strong boundary repulsion for head
          let head = segments[0];
          let boundaryForce = p.createVector(0, 0);
          let buffer = 60; // Distance from edge to start repelling
          let strength = 2.0; // Repulsion strength
          
          // Left boundary
          if (head.x < buffer) {
            boundaryForce.x += strength * (buffer - head.x) / buffer;
          }
          // Right boundary  
          if (head.x > p.width - buffer) {
            boundaryForce.x -= strength * (head.x - (p.width - buffer)) / buffer;
          }
          // Top boundary
          if (head.y < buffer) {
            boundaryForce.y += strength * (buffer - head.y) / buffer;
          }
          // Bottom boundary
          if (head.y > p.height - buffer) {
            boundaryForce.y -= strength * (head.y - (p.height - buffer)) / buffer;
          }
          
          // Apply boundary force to target
          targetX += boundaryForce.x * 30;
          targetY += boundaryForce.y * 30;
          
          // Add organic movement with minimum intensity
          let noiseIntensity = p.map(speedMultiplier, 0.1, 3, 0.5, 2);
          noiseIntensity = p.max(noiseIntensity, 0.2);
          let organicX = targetX + p.map(p.noise(noiseOffsetX), 0, 1, -noiseAmount * noiseIntensity, noiseAmount * noiseIntensity);
          let organicY = targetY + p.map(p.noise(noiseOffsetY), 0, 1, -noiseAmount * noiseIntensity, noiseAmount * noiseIntensity);
          
          // Constrain organic movement
          organicX = p.constrain(organicX, 40, p.width - 40);
          organicY = p.constrain(organicY, 40, p.height - 40);
          
          // Move head towards target
          let easing = p.max(0.08 * speedMultiplier, 0.01);
          segments[0].x += (organicX - segments[0].x) * easing;
          segments[0].y += (organicY - segments[0].y) * easing;
          
          // Hard constraint on head position - absolutely must stay in bounds
          segments[0].x = p.constrain(segments[0].x, 30, p.width - 30);
          segments[0].y = p.constrain(segments[0].y, 30, p.height - 30);
          
          // Calculate movement speed for head glow
          let currentSpeed = p.dist(segments[0].x, segments[0].y, lastPosition.x, lastPosition.y);
          let movementGlow = p.map(currentSpeed, 0, 15, 0, maxGlow * 0.8); // Much more subtle glow scaling
          
          // Apply movement-based glow to head - more subtle
          headGlow = p.max(headGlow, movementGlow);
          
          // Add extra glow for fast movement - more subtle
          if (currentSpeed > 5) {
            headGlow = p.min(headGlow + currentSpeed * 0.05, maxGlow * 1.2);
          }
          
          // Create glowing trail particles when moving fast - more subtle
          if (currentSpeed > 4) {
            createGlowTrail(segments[0].x, segments[0].y, currentSpeed, headGlow);
          }
          
          noiseOffsetX += p.max(noiseSpeed, 0.01);
          noiseOffsetY += p.max(noiseSpeed, 0.01);
          
          // Update all other segments
          for (let i = 0; i < points - 1; i++) {
            let segment = segments[i];
            let nextSegment = segments[i + 1];
            let vector = p5.Vector.sub(segment, nextSegment);
            vector.setMag(segmentLength);
            nextSegment.x = segment.x - vector.x;
            nextSegment.y = segment.y - vector.y;
            
            // Also constrain each segment to stay in bounds
            nextSegment.x = p.constrain(nextSegment.x, 20, p.width - 20);
            nextSegment.y = p.constrain(nextSegment.y, 20, p.height - 20);
          }
        }

        function calculateMovementMetrics() {
          // Calculate current velocity
          let currentVelocity = p.createVector(
            segments[0].x - lastPosition.x,
            segments[0].y - lastPosition.y
          );
          
          // Track direction changes (turning)
          if (lastDirection) {
            let angleChange = p.abs(lastDirection.angleBetween(currentVelocity));
            turnAmount = p.lerp(turnAmount, angleChange, 0.2);
          }
          lastDirection = currentVelocity.copy();
          
          // Update velocity history
          velocityHistory.push(currentVelocity.mag());
          if (velocityHistory.length > historyLength) {
            velocityHistory.shift();
          }
          
          // Calculate average velocity
          let avgVelocity = velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length;
          
          // Update movement amount with more factors
          movementAmount = p.lerp(movementAmount, avgVelocity + (turnAmount * 2), 0.1);
          lastPosition.set(segments[0].x, segments[0].y);
          
          // Calculate snake metrics
          calculateSnakeMetrics();
        }

        function calculateSnakeMetrics() {
          // Calculate curvature (how much the snake is bending)
          curvature = 0;
          for (let i = 1; i < segments.length - 1; i++) {
            let prev = segments[i-1];
            let curr = segments[i];
            let next = segments[i+1];
            let angle = p.abs(p5.Vector.sub(prev, curr).angleBetween(p5.Vector.sub(next, curr)));
            curvature += angle;
          }
          curvature = curvature / (segments.length - 2);
          
          // Calculate stretch (distance between segments compared to ideal)
          stretchAmount = 0;
          for (let i = 0; i < segments.length - 1; i++) {
            let curr = segments[i];
            let next = segments[i+1];
            let dist = p5.Vector.dist(curr, next);
            stretchAmount += p.abs(dist - segmentLength);
          }
          stretchAmount = stretchAmount / (segments.length - 1);
          
          // Calculate overall bend (how far from straight line)
          let start = segments[0];
          let end = segments[segments.length - 1];
          let actualLength = 0;
          for (let i = 0; i < segments.length - 1; i++) {
            actualLength += p5.Vector.dist(segments[i], segments[i+1]);
          }
          let directLength = p5.Vector.dist(start, end);
          bendAmount = (actualLength - directLength) / actualLength;
        }

        function drawOrganism() {
          if (!segments || segments.length === 0) return;
          
          let head = segments[0];
          let colors = getOrganismColor();
          
          // Calculate edge proximity glow
          let edgeProximity = p.min(
            head.x,
            p.width - head.x,
            head.y,
            p.height - head.y
          );
          
          if (edgeProximity < edgeGlowDistance) {
            let glowIntensity = p.map(edgeProximity, 0, edgeGlowDistance, maxGlow, 0);
            headGlow = p.lerp(headGlow, glowIntensity, 0.1);
          }
          
          // Use blend mode for organic glow
          p.push();
          
          for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            let segmentGlow = bodyGlow[i] * p.map(dayNightCycle.activityLevel, 0, 1, 0.5, 1.5);
            let glowSize = segmentLength * (1 + segmentGlow * 0.3) * organismSize;
            
            // Enhanced head visualization - amplify the head when moving
            if (i === 0) {
              // Calculate movement speed for head amplification
              let speed = 0;
              if (i < segments.length - 1) {
                let nextSegment = segments[i + 1];
                speed = p.dist(segment.x, segment.y, nextSegment.x, nextSegment.y);
              }
              
              // Amplify head size just slightly - more subtle
              let headAmplification = 1.15 + p.map(speed, 0, 20, 0, 0.1); // Much smaller base amplification
              let directionIntensity = 1 + (headGlow * 0.05); // Minimal amplification based on glow
              glowSize *= headAmplification * directionIntensity;
              segmentGlow *= 1.1; // Very subtle extra glow for the head
            }
            
            // Calculate rotation angle based on direction to next segment
            let angle = 0;
            if (i < segments.length - 1) {
              let nextSegment = segments[i + 1];
              angle = p.atan2(nextSegment.y - segment.y, nextSegment.x - segment.x);
            } else if (i > 0) {
              // For the last segment, use direction from previous segment
              let prevSegment = segments[i - 1];
              angle = p.atan2(segment.y - prevSegment.y, segment.x - prevSegment.x);
            }
            
            p.push();
            p.translate(segment.x, segment.y);
            p.rotate(angle);
            p.noStroke();
            
            // Enhanced glow for head when moving
            let glowIntensity = segmentGlow;
            if (i === 0) {
              // Head gets extra glow based on headGlow variable - more subtle
              glowIntensity += headGlow * 0.5; // Reduce the additional glow
              p.drawingContext.shadowBlur = 25 * (segmentGlow + headGlow * 0.6); // More subtle glow for head
              p.drawingContext.shadowColor = `rgba(${colors.glow.r}, ${colors.glow.g}, ${colors.glow.b}, ${0.2 + headGlow * 0.2})`;
            } else {
              p.drawingContext.shadowBlur = 20 * segmentGlow;
              p.drawingContext.shadowColor = `rgba(${colors.glow.r}, ${colors.glow.g}, ${colors.glow.b}, 0.5)`;
            }
            
            // Make the dark body semi-transparent for better layering
            p.fill(0, 0, 0, 51);
            p.rectMode(p.CENTER);
            p.rect(0, 0, glowSize, glowSize);
            
            // Draw internal rings/squares with palette colors - all oriented in movement direction
            let ringCount = i === 0 ? 4 : 3; // Extra ring for head
            for (let r = ringCount; r > 0; r--) {
              let ringSize = glowSize * (1 - r * 0.2);
              let ringOpacity = p.map(r, 1, ringCount, 0.8, 0.4) * colors.body.a/255;
              
              let ringColor = PALETTE.pearl; // Default color
              if (i === 0) {
                // Special head colors - brighter and more prominent
                switch(r % 5) {
                  case 0: ringColor = PALETTE.pearl; break; // Bright center
                  case 1: ringColor = PALETTE.jade; break;
                  case 2: ringColor = PALETTE.rust; break;
                  case 3: ringColor = PALETTE.deepTeal; break;
                  case 4: ringColor = PALETTE.sand; break;
                  default: ringColor = PALETTE.pearl; break;
                }
                // Head brightness increases with movement glow - more subtle
                ringOpacity *= (1.05 + headGlow * 0.3); // Subtle brightness increase when moving
              } else {
                // Regular body colors
                switch(r % 5) {
                  case 0: ringColor = PALETTE.deepTeal; break;
                  case 1: ringColor = PALETTE.jade; break;
                  case 2: ringColor = PALETTE.sand; break;
                  case 3: ringColor = PALETTE.rust; break;
                  case 4: ringColor = PALETTE.pearl; break;
                  default: ringColor = PALETTE.deepTeal; break;
                }
              }
              
              p.fill(ringColor.r, ringColor.g, ringColor.b, ringOpacity * 255);
              
              // All squares now follow the movement direction
              if (r % 2 === 0) {
                // Squares aligned with movement direction
                p.rectMode(p.CENTER);
                if (i === 0) {
                  // Head gets elongated rectangles to show direction
                  p.rect(0, 0, ringSize * 1.2, ringSize * 0.6);
                } else {
                  p.rect(0, 0, ringSize * 0.8, ringSize * 0.8);
                }
              } else {
                // Circles for contrast
                p.circle(0, 0, ringSize);
              }
            }
            
            p.pop();
          }
          
          p.pop();
          p.drawingContext.shadowBlur = 0;
          
          // Draw body glow effects for self-exploration
          p.noFill();
          p.strokeCap(p.ROUND);
          
          for (let i = 0; i < segments.length - 1; i++) {
            if (bodyGlow[i] > 0.1) {
              let glowLayers = 3;
              for (let j = glowLayers; j > 0; j--) {
                let glowSize = 28 + j * 20 * bodyGlow[i];
                let alpha = p.map(j, 0, glowLayers, 20, 60) * bodyGlow[i];
                
                // Adjust color based on interaction type
                let r = 255;
                let g = selfExploring ? p.map(bodyGlow[i], 0, maxBodyGlow, 100, 180) : 100;
                let b = selfExploring ? p.map(bodyGlow[i], 0, maxBodyGlow, 100, 150) : 100;
                
                p.strokeWeight(glowSize);
                p.stroke(r, g, b, alpha);
                p.line(segments[i].x, segments[i].y, segments[i+1].x, segments[i+1].y);
              }
            }
            
            // Decay glow
            bodyGlow[i] *= bodyGlowDecay;
          }
          
          // Decay head glow
          headGlow *= glowDecay;
        }

        // Universal safe volume function to prevent ALL range errors
        function safeSetVolume(audioNode: any, volume: number) {
          // EMERGENCY: Disable all volume operations to protect visual system
          return; // Do nothing - no volume changes allowed
          
          try {
            // Triple-layer protection for volume values
            let safeVolume = volume;
            if (isNaN(safeVolume) || !isFinite(safeVolume)) safeVolume = -30;
            safeVolume = p.constrain(safeVolume, -40, 0);
            safeVolume = Math.max(-40, Math.min(0, safeVolume)); // Extra constraint
            
            if (audioNode && audioNode.volume && audioNode.volume.setValueAtTime) {
              audioNode.volume.setValueAtTime(safeVolume, Tone.now());
            }
          } catch (error) {
            console.warn('safeSetVolume error (ignored):', error);
          }
        }

        function updateSound() {
          // Wrap ALL audio operations in try-catch to prevent visual system crashes
          try {
            if (!soundEnabled || !audioStarted) return;
            
            // More interesting and varied sound generation
            if (p.frameCount % 6 === 0) { // Slightly more frequent for variety
              let speed = p.dist(segments[0].x, segments[0].y, lastPosition.x, lastPosition.y);
              let head = segments[0];
              let activity = dayNightCycle.activityLevel;
              
              // Multiple sound types based on different conditions
              let soundChance = p.map(speed, 0, 10, 0.01, 0.08);
              
              if (p.random() < soundChance) {
                let soundType = p.random();
                
                if (soundType < 0.25) {
                  // Melodic exploration sounds
                  makeMelodicSound(head.x, head.y, speed);
                } else if (soundType < 0.5) {
                  // Rhythmic movement sounds based on segments
                  makeRhythmicSound(speed, activity);
                } else if (soundType < 0.75) {
                  // Textural sounds based on environment
                  makeTexturalSound(head.x, head.y);
                } else {
                  // Enhanced underwater sounds
                  makeUnderwaterSound(speed / 15); // Slightly louder than before
                }
              }
              
              // Add spatial reverb effects occasionally
              if (p.random() < 0.005) {
                makeSpatialReverb(head.x, head.y);
              }
            }
          } catch (error) {
            console.warn('Audio update error (visual system protected):', error);
            // Don't disable sound entirely, just log and continue
          }
        }

        function makeUnderwaterSound(intensity = 0.5) {
          try {
            if (!soundEnabled || !audioStarted || !osc) return;
            
            headGlow = p.lerp(headGlow, maxGlow * intensity, 0.3);
          
          let currentTime = p.millis();
          if (currentTime - lastSoundTime < minSoundInterval) return;
          lastSoundTime = currentTime;
          
          let speed = p.dist(segments[0].x, segments[0].y, lastPosition.x, lastPosition.y);
          let baseFreq = p.map(speed, 0, 20, 80, 250);
          baseFreq *= p.map(curvature, 0, p.PI, 1, 1.5);
          
          let duration = p.map(p.constrain(bendAmount, 0, 1), 0, 1, 0.4, 1.2);
          let safeStretchAmount = p.constrain(stretchAmount, 0, 10); // Prevent extreme stretch values
          let maxAmp = p.map(p.constrain(speed, 0, 20), 0, 20, 0.3, 0.8) * p.map(safeStretchAmount, 0, 10, 1, 1.5);
          maxAmp = p.constrain(maxAmp, 0, 2); // Hard limit on maxAmp to prevent extreme volume calculations
          
          if (osc && osc.frequency) {
            osc.frequency.setValueAtTime(baseFreq, Tone.now());
            let rawVolume = -12 + (maxAmp * 12);
            let volume = p.constrain(rawVolume, -40, 0); // Tighter constraint to prevent extreme values
            if (isNaN(volume) || !isFinite(volume)) volume = -20; // Fallback for invalid values
            safeSetVolume(osc, volume); // Use safe volume function
          }
          } catch (error) {
            console.warn('makeUnderwaterSound error (visual protected):', error);
          }
        }

        function makeMelodicSound(x: number, y: number, speed: number) {
          try {
            if (!soundEnabled || !audioStarted || !osc) return;
            
            // Create melodic sequences based on position and movement
          let baseNote = p.map(y, 0, p.height, 200, 800); // Vertical position determines base pitch
          let harmony = p.map(x, 0, p.width, 0.8, 1.2); // Horizontal position creates harmony
          let rhythm = p.map(p.constrain(speed, 0, 10), 0, 10, 0.5, 2); // Speed affects rhythm, constrained
          rhythm = p.constrain(rhythm, 0, 3); // Hard limit on rhythm to prevent extreme calculations
          
          // Create a short melodic phrase
          let notes = [baseNote, baseNote * harmony, baseNote * 1.25, baseNote * harmony * 0.75];
          let noteIndex = Math.floor(p.frameCount / 15) % notes.length;
          
          if (osc && osc.frequency) {
            osc.frequency.setValueAtTime(notes[noteIndex], Tone.now());
            let rawVolume = -15 + (rhythm * 3);
            let volume = p.constrain(rawVolume, -40, 0); // Tighter constraint to prevent extreme values
            if (isNaN(volume) || !isFinite(volume)) volume = -20; // Fallback for invalid values
            osc.volume.setValueAtTime(volume, Tone.now());
          }
          } catch (error) {
            console.warn('makeMelodicSound error (visual protected):', error);
          }
        }

        function makeRhythmicSound(speed: number, activity: number) {
          if (!soundEnabled || !audioStarted || !clickOsc) return;
          
          // Create rhythmic patterns based on movement and activity
          let beatPattern = [1, 0, 1, 0, 1, 1, 0, 1]; // 8-beat pattern
          let beatIndex = Math.floor(p.frameCount / 8) % beatPattern.length;
          
          if (beatPattern[beatIndex] === 1) {
            let freq = p.map(p.constrain(speed, 0, 10), 0, 10, 150, 400);
            let intensity = p.map(p.constrain(activity, 0, 1), 0, 1, 0.3, 0.8);
            intensity = p.constrain(intensity, 0, 1); // Hard limit on intensity to prevent extreme calculations
            
            if (clickOsc && clickOsc.frequency) {
              clickOsc.frequency.setValueAtTime(freq, Tone.now());
              let rawVolume = -20 + (intensity * 8);
              let volume = p.constrain(rawVolume, -40, 0); // Tighter constraint to prevent extreme values
              if (isNaN(volume) || !isFinite(volume)) volume = -20; // Fallback for invalid values
              clickOsc.volume.setValueAtTime(volume, Tone.now());
            }
          }
        }

        function makeTexturalSound(x: number, y: number) {
          if (!soundEnabled || !audioStarted || !squeakOsc) return;
          
          // Create textural sounds based on environment and position
          let texture = p.constrain(p.noise(x * 0.01, y * 0.01, p.frameCount * 0.01), 0, 1); // Constrain noise output
          let freq = p.map(texture, 0, 1, 100, 600);
          let grain = p.map(texture, 0, 1, 0.1, 0.9);
          grain = p.constrain(grain, 0, 1); // Hard limit on grain to prevent extreme calculations
          
          if (squeakOsc && squeakOsc.frequency) {
            squeakOsc.frequency.setValueAtTime(freq + p.sin(p.frameCount * 0.1) * 20, Tone.now());
            let rawVolume = -18 + (grain * 6);
            let volume = p.constrain(rawVolume, -40, 0); // Tighter constraint to prevent extreme values
            if (isNaN(volume) || !isFinite(volume)) volume = -20; // Fallback for invalid values
            squeakOsc.volume.setValueAtTime(volume, Tone.now());
          }
        }

        function makeSpatialReverb(x: number, y: number) {
          if (!soundEnabled || !audioStarted) return;
          
          // Create spatial echo effects based on position
          let delay = p.map(x, 0, p.width, 0.1, 0.5);
          let feedback = p.map(y, 0, p.height, 0.2, 0.6);
          let freq = p.map(p.dist(x, y, p.width/2, p.height/2), 0, p.width/2, 400, 800);
          
          // Use available oscillator for reverb effect
          if (osc && osc.frequency) {
            // Create a brief echo-like sound
            osc.frequency.setValueAtTime(freq, Tone.now());
            let volume = p.constrain(-22, -40, 0); // Tighter constraint to prevent extreme values
            osc.volume.setValueAtTime(volume, Tone.now());
            
            // Quick fade for echo effect
            setTimeout(() => {
              if (osc && osc.volume) {
                let fadeVolume = p.constrain(-40, -40, 0); // Tighter constraint to prevent extreme values
                osc.volume.setValueAtTime(fadeVolume, Tone.now());
              }
            }, delay * 200);
          }
        }

        function makeClickSound() {
          if (!soundEnabled || !audioStarted || !clickOsc) return;
          
          let currentTime = p.millis();
          if (currentTime - lastClickTime < minClickInterval) return;
          
          let head = segments[0];
          let edgeProximity = p.min(
            head.x,
            p.width - head.x,
            head.y,
            p.height - head.y
          );
          
          let clickFreq = p.map(edgeProximity, 0, 200, 2000, 800);
          let clickRate = p.map(edgeProximity, 0, 200, 50, 200);
          minClickInterval = clickRate;
          
          if (clickOsc && clickOsc.frequency) {
            clickOsc.frequency.setValueAtTime(clickFreq, Tone.now());
            let volume = p.constrain(-18, -40, 0); // Tighter constraint to prevent extreme values
            clickOsc.volume.setValueAtTime(volume, Tone.now());
          }
          
          lastClickTime = currentTime;
        }

        function makeSqueakSound(intensity: number) {
          if (!soundEnabled || !audioStarted || !squeakOsc) return;
          
          let currentTime = p.millis();
          if (currentTime - lastSqueakTime < 150) return;
          
          let baseFreq = p.map(intensity, 0, 1, 200, 400);
          let vibrato = p.sin(p.frameCount * 0.2) * 10;
          
          if (squeakOsc && squeakOsc.frequency) {
            squeakOsc.frequency.setValueAtTime(baseFreq + vibrato, Tone.now());
            let volume = p.constrain(-18, -40, 0); // Tighter constraint to prevent extreme values
            squeakOsc.volume.setValueAtTime(volume, Tone.now());
          }
          
          lastSqueakTime = currentTime;
          
          // Propagate glow along the body
          let glowIntensity = p.map(intensity, 0, 1, 0.5, maxBodyGlow);
          bodyGlow[selfExploreTarget] = glowIntensity;
          
          // Spread glow to nearby segments
          let spread = 3;
          for (let i = 1; i <= spread; i++) {
            let fadeAmount = p.map(i, 1, spread, 0.8, 0.2);
            if (selfExploreTarget - i >= 0) {
              bodyGlow[selfExploreTarget - i] = p.max(bodyGlow[selfExploreTarget - i], glowIntensity * fadeAmount);
            }
            if (selfExploreTarget + i < bodyGlow.length) {
              bodyGlow[selfExploreTarget + i] = p.max(bodyGlow[selfExploreTarget + i], glowIntensity * fadeAmount);
            }
          }
        }

        function evolveComplexity() {
          let currentTime = p.millis();
          if (currentTime - lastEvolutionCheck > evolutionInterval) {
            lastEvolutionCheck = currentTime;
            evolutionTime++;
            
            complexityLevel = p.constrain(evolutionTime / 8, 0, maxComplexity);
            
            if (harmonics && harmonics.length < 8) {
              try {
                let baseFreq = 220 + complexityLevel * 50;
                harmonics.push({
                  freq: baseFreq * (2 + complexityLevel * 0.5),
                  amp: 0.3 / (1 + complexityLevel * 0.2)
                });
              } catch (e) {
                console.log('Harmonic creation failed:', e);
              }
            }
          }
        }

        function detectActivity() {
          if (!segments || segments.length === 0) return 'dormant';
          
          let head = segments[0];
          
          if (!activityDetector.lastPosition) {
            activityDetector.lastPosition = p.createVector(head.x, head.y);
            return 'awakening';
          }
          
          // Ensure lastPosition is not null before accessing properties
          const lastPos = activityDetector.lastPosition;
          if (!lastPos) return 'dormant';
          
          let movement = p.dist(head.x, head.y, lastPos.x, lastPos.y);
          activityDetector.movementHistory.push(movement);
          
          if (activityDetector.movementHistory.length > 30) {
            activityDetector.movementHistory.shift();
          }
          
          let avgMovement = activityDetector.movementHistory.reduce((a, b) => a + b, 0) / activityDetector.movementHistory.length;
          
          lastPos.set(head.x, head.y);
          
          let newState = 'wandering';
          
          if (isResting) {
            newState = 'resting';
          } else if (edgeExploring) {
            newState = 'exploring';
          } else if (avgMovement < activityDetector.restingThreshold) {
            newState = 'contemplating';
          } else if (avgMovement > activityDetector.exploringThreshold) {
            newState = 'hunting';
          } else if (sniffingIntensity > 0.5) {
            newState = 'sensing';
          }
          
          if (newState !== activityDetector.currentState) {
            activityDetector.currentState = newState;
            activityDetector.stateStartTime = p.millis();
          }
          
          return newState;
        }

        function drawStoryTicker() {
          if (currentStoryText && storyOpacity > 0) {
            // Draw background bar for better text visibility - more transparent
            p.noStroke();
            p.fill(0, 0, 0, 80); // Much more transparent
            p.rect(0, p.height - 80, p.width, 60);
            
            // Draw text with white color and shadow for maximum visibility
            p.textSize(24);
            p.textAlign(p.LEFT, p.CENTER);
            
            // Draw text shadow
            p.fill(0, 0, 0, storyOpacity * 0.8);
            p.text(currentStoryText, tickerX + 2, p.height - 50 + 2);
            
            // Draw main text in bright white
            p.fill(255, 255, 255, storyOpacity);
            p.text(currentStoryText, tickerX, p.height - 50);
            
            // Animate ticker - slower speed
            tickerX -= 0.8;
            if (tickerX < -p.textWidth(currentStoryText)) {
              tickerX = p.width;
            }
            
            // Keep text visible - no fade out
            // storyOpacity = p.max(0, storyOpacity - 0.2);
          }
        }

        p.mousePressed = () => {
          // Handle language dropdown
          let buttonX = p.width - 150;
          let buttonY = 20;
          let buttonWidth = 120;
          let buttonHeight = 30;
          
          if (p.mouseX >= buttonX && p.mouseX <= buttonX + buttonWidth && 
              p.mouseY >= buttonY && p.mouseY <= buttonY + buttonHeight) {
            showLanguageDropdown = !showLanguageDropdown;
            return;
          }
          
          if (showLanguageDropdown) {
            let menuY = buttonY + buttonHeight + 5;
            let itemHeight = 25;
            
            for (let i = 0; i < languages.length; i++) {
              let itemY = menuY + i * itemHeight;
              if (p.mouseX >= buttonX && p.mouseX <= buttonX + buttonWidth && 
                  p.mouseY >= itemY && p.mouseY <= itemY + itemHeight) {
                selectedLanguage = languages[i];
                showLanguageDropdown = false;
                generateStory();
                break;
              }
            }
          }
        };

        function drawLanguageDropdown() {
          let buttonX = p.width - 160;
          let buttonY = 20;
          let buttonWidth = 140;
          let buttonHeight = 35;
          
          // Draw button with high contrast
          p.noStroke();
          p.fill(40, 40, 40, 240); // Dark background
          p.rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
          
          // Button border with bright color
          p.noFill();
          p.stroke(240, 243, 245, 255); // Bright pearl color
          p.strokeWeight(2);
          p.rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
          
          // Button text with lighter appearance using stroke
          p.noFill();
          p.stroke(240, 243, 245); // Bright pearl color as stroke
          p.strokeWeight(1); // Thin stroke for lighter appearance
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(16); // Larger size for better readability
          p.textStyle(p.NORMAL);
          p.text(selectedLanguage, buttonX + buttonWidth/2, buttonY + buttonHeight/2);
          
          // Draw dropdown
          if (showLanguageDropdown) {
            let menuY = buttonY + buttonHeight + 5;
            let itemHeight = 30;
            
            for (let i = 0; i < languages.length; i++) {
              let itemY = menuY + i * itemHeight;
              
              // Background with high contrast
              p.noStroke();
              p.fill(20, 20, 20, 250); // Very dark background
              p.rect(buttonX, itemY, buttonWidth, itemHeight, 3);
              
              // Border
              p.noFill();
              p.stroke(215, 201, 170, 200); // Sand color border
              p.strokeWeight(1);
              p.rect(buttonX, itemY, buttonWidth, itemHeight, 3);
              
              // Text with maximum contrast
              p.fill(240, 243, 245); // Bright pearl color
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(16);
              p.textStyle(p.NORMAL); // Changed from BOLD to NORMAL
              p.text(languages[i], buttonX + buttonWidth/2, itemY + itemHeight/2);
            }
          }
        }

        async function generateStory() {
          if (isGeneratingStory) return;
          isGeneratingStory = true;
          
          try {
            const response = await fetch('/api/generate-story', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                activity: currentActivity,
                timePhase: getTimePhase(),
                evolutionLevel: Math.floor(complexityLevel || 0),
                energyLevel: 'energized',
                style: 'philosophical',
                language: selectedLanguage
              })
            });

            if (response.ok) {
              const data = await response.json();
              if (data.story) {
                showStory(data.story);
                console.log('Generated story:', data.story);
              }
            } else {
              console.error('Story generation failed:', response.status);
            }
          } catch (error) {
            console.error('Error generating story:', error);
          } finally {
            isGeneratingStory = false;
          }
        }

        function getTimePhase() {
          const hour = new Date().getHours();
          if (hour >= 5 && hour < 12) return 'morning';
          if (hour >= 12 && hour < 17) return 'afternoon';
          if (hour >= 17 && hour < 21) return 'evening';
          return 'nocturnal';
        }

        function showStory(story: string) {
          currentStoryText = story;
          storyOpacity = 255;
          tickerX = p.width;
        }

        function checkSelfIntersection() {
          let head = segments[0];
          
          // Check more tail segments for Ouroboros
          for (let i = segments.length - 8; i < segments.length; i++) {
            let d = p.dist(head.x, head.y, segments[i].x, segments[i].y);
            if (d < segmentLength * 0.8) {
              try {
                createOuroborosEffect(head.x, head.y);
              } catch (error) {
                console.warn('createOuroborosEffect error (visual protected):', error);
              }
              return true;
            }
          }
          
          // Check other intersections
          for (let i = 4; i < segments.length - 8; i++) {
            let d = p.dist(head.x, head.y, segments[i].x, segments[i].y);
            if (d < segmentLength * 0.5) {
              createIntersectionEffect(head.x, head.y);
              try {
                playIntersectionSound();
              } catch (error) {
                console.warn('playIntersectionSound error (visual protected):', error);
              }
              return true;
            }
          }
          
          return false;
        }

        function createIntersectionEffect(x: number, y: number) {
          intersectionEffects.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: segmentLength * 4,
            life: 1.0,
            type: 'ring'
          });
          
          for (let i = 0; i < 15; i++) {
            let angle = p.random(p.TWO_PI);
            let speed = p.random(3, 10);
            intersectionEffects.push({
              x: x,
              y: y,
              vx: p.cos(angle) * speed,
              vy: p.sin(angle) * speed,
              life: 1.0,
              type: 'particle',
              color: p.random([{r: 11, g: 122, b: 117}, {r: 215, g: 201, b: 170}, {r: 240, g: 243, b: 245}]),
              size: p.random(5, 15)
            });
          }
        }

        function playIntersectionSound() {
          if (!soundEnabled || !audioStarted || !intersectionSound) return;
          
          let now = p.millis();
          if (now - lastIntersectionSound > minIntersectionSoundInterval) {
            let baseFreq = p.random([220, 330, 440, 550]);
            if (intersectionSound) {
              // EMERGENCY: Disable volume operations to protect visual system
              // intersectionSound.volume.value = p.constrain(-20, -40, 0);
              try {
                intersectionSound.triggerAttackRelease(baseFreq, "16n");
              } catch (error) {
                console.warn('triggerAttackRelease error (ignored):', error);
              }
            }
            lastIntersectionSound = now;
          }
        }

        function createOuroborosEffect(x: number, y: number) {
          isOuroboros = true;
          ouroborosTimer = ouroborosDuration;
          
          for (let i = 0; i < 36; i++) {
            let angle = (i / 36) * p.TWO_PI;
            let radius = segmentLength * 4;
            ouroborosEffects.push({
              x: x + p.cos(angle) * radius,
              y: y + p.sin(angle) * radius,
              angle: angle,
              radius: radius,
              life: 1.0,
              color: p.random([{r: 11, g: 122, b: 117}, {r: 215, g: 201, b: 170}, {r: 240, g: 243, b: 245}, {r: 25, g: 83, b: 95}])
            });
          }
          
          if (soundEnabled && audioStarted && p.millis() - lastOuroborosSound > 1000) {
            if (ouroborosSound) {
              // EMERGENCY: Disable volume operations to protect visual system  
              // ouroborosSound.volume.value = p.constrain(-25, -40, 0);
              try {
                ouroborosSound.triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '2n');
              } catch (error) {
                console.warn('ouroborosSound triggerAttackRelease error (ignored):', error);
              }
            }
            lastOuroborosSound = p.millis();
          }
        }

        function updateIntersectionEffects() {
          for (let i = intersectionEffects.length - 1; i >= 0; i--) {
            let effect = intersectionEffects[i];
            
            if (effect.type === 'ring') {
              effect.radius += (effect.maxRadius - effect.radius) * 0.1;
              effect.life *= 0.95;
              
              p.push();
              p.noFill();
              p.strokeWeight(2);
              p.stroke(255, 255, 255, effect.life * 255);
              p.circle(effect.x, effect.y, effect.radius * 2);
              p.pop();
              
            } else if (effect.type === 'particle') {
              effect.x += effect.vx;
              effect.vy += 0.2;
              effect.y += effect.vy;
              effect.life *= 0.96;
              
              p.push();
              p.noStroke();
              p.fill(effect.color.r, effect.color.g, effect.color.b, effect.life * 255);
              p.circle(effect.x, effect.y, effect.size * effect.life);
              p.pop();
            }
            
            if (effect.life < 0.01) {
              intersectionEffects.splice(i, 1);
            }
          }
        }

        function updateOuroborosEffects() {
          if (!isOuroboros) return;
          
          if (ouroborosTimer > 0) {
            ouroborosTimer--;
          } else {
            isOuroboros = false;
            ouroborosEffects = [];
            return;
          }
          
          p.push();
          p.blendMode(p.SCREEN);
          
          for (let effect of ouroborosEffects) {
            effect.angle += 0.01;
            effect.radius *= 0.995;
            
            let x = effect.x + p.cos(effect.angle) * 2;
            let y = effect.y + p.sin(effect.angle) * 2;
            
            p.noStroke();
            p.fill(effect.color.r, effect.color.g, effect.color.b, effect.life * 255);
            p.circle(x, y, 10 * effect.life);
            
            p.stroke(effect.color.r, effect.color.g, effect.color.b, effect.life * 100);
            p.strokeWeight(1);
            p.line(x, y, segments[0].x, segments[0].y);
            
            effect.life *= 0.995;
          }
          
          p.pop();
        }

        // Add mouse interaction for food spawning
        p.mousePressed = () => {
          // Handle language dropdown first
          let buttonX = p.width - 160;
          let buttonY = 20;
          let buttonWidth = 140;
          let buttonHeight = 35;
          
          if (p.mouseX >= buttonX && p.mouseX <= buttonX + buttonWidth && 
              p.mouseY >= buttonY && p.mouseY <= buttonY + buttonHeight) {
            showLanguageDropdown = !showLanguageDropdown;
            return;
          }
          
          if (showLanguageDropdown) {
            let menuY = buttonY + buttonHeight + 5;
            let itemHeight = 30;
            
            for (let i = 0; i < languages.length; i++) {
              let itemY = menuY + i * itemHeight;
              if (p.mouseX >= buttonX && p.mouseX <= buttonX + buttonWidth && 
                  p.mouseY >= itemY && p.mouseY <= itemY + itemHeight) {
                selectedLanguage = languages[i];
                showLanguageDropdown = false;
                generateStory();
                break;
              }
            }
            return;
          }
          
          // Create food particles at mouse position
          for (let i = 0; i < 5; i++) {
            let angle = p.random(p.TWO_PI);
            let distance = p.random(20, 50);
            
            foodParticles.push({
              x: p.mouseX + p.cos(angle) * distance,
              y: p.mouseY + p.sin(angle) * distance,
              size: p.random(8, 15),
              color: p.color(
                p.random(180, 220),
                p.random(200, 240),
                p.random(220, 255),
                200
              ),
              age: 0,
              maxAge: p.random(300, 600),
              wiggleOffset: p.random(1000),
              spawnTime: p.millis(),
              initialSize: 0
            });
          }
          
          // Limit total particles
          if (foodParticles.length > maxFoodParticles) {
            foodParticles.splice(0, foodParticles.length - maxFoodParticles);
          }
        };

        function updateSpawnEffects() {
          // Update and draw spawn particles
          for (let i = spawnParticles.length - 1; i >= 0; i--) {
            let particle = spawnParticles[i];
            
            if (p.frameCount % 2 === 0 && p.millis() > (particle.delay || 0)) {
              // Expand rings
              particle.radius += (particle.maxRadius - particle.radius) * 0.1;
              particle.alpha *= 0.95;
              
              // Draw expanding ring
              p.noFill();
              p.stroke(255, 255, 255, particle.alpha);
              p.strokeWeight(2);
              p.circle(particle.x, particle.y, particle.radius * 2);
              
              // Remove faded particles
              if (particle.alpha < 5) {
                spawnParticles.splice(i, 1);
              }
            }
          }
        }

        function updateDigestionEffects() {
          if (typeof window !== 'undefined' && (window as any).digestionRings) {
            for (let i = (window as any).digestionRings.length - 1; i >= 0; i--) {
              let ring = (window as any).digestionRings[i];
              
              // Draw expanding ring
              p.noFill();
              p.stroke(220, 240, 255, ring.alpha);
              p.strokeWeight(2);
              p.circle(ring.x, ring.y, ring.radius * 2);
              
              // Update ring
              ring.radius += (ring.maxRadius - ring.radius) * 0.1;
              ring.alpha *= 0.9;
              
              // Remove faded rings
              if (ring.alpha < 5) {
                (window as any).digestionRings.splice(i, 1);
              }
            }
          }
        }

        function createGlowTrail(x: number, y: number, speed: number, glow: number) {
          // Create trail particles based on movement speed and glow - more subtle
          let trailIntensity = p.map(speed, 4, 15, 0.2, 0.6); // Reduced intensity
          let numParticles = Math.floor(speed * 0.3) + 1; // Fewer particles
          
          for (let i = 0; i < numParticles; i++) {
            // Add some randomness to particle position
            let offsetX = p.random(-5, 5);
            let offsetY = p.random(-5, 5);
            
            glowTrailParticles.push({
              x: x + offsetX,
              y: y + offsetY,
              life: 1.0,
              maxLife: p.map(glow, 0, 3, 20, 50), // Shorter, more subtle life
              size: p.map(speed, 4, 15, 2, 5), // Smaller particles
              glow: glow * trailIntensity * 0.7, // Reduced glow intensity
              fadeRate: p.map(speed, 4, 15, 0.03, 0.02) // Faster fade for more subtle effect
            });
          }
          
          // Limit number of trail particles
          while (glowTrailParticles.length > maxTrailParticles) {
            glowTrailParticles.shift();
          }
        }

        function updateAndDrawGlowTrail() {
          for (let i = glowTrailParticles.length - 1; i >= 0; i--) {
            let particle = glowTrailParticles[i];
            
            // Update particle
            particle.life -= particle.fadeRate;
            
            // Remove dead particles
            if (particle.life <= 0) {
              glowTrailParticles.splice(i, 1);
              continue;
            }
            
            // Draw glowing particle
            let alpha = particle.life * 255;
            let glowSize = particle.size * (1 + particle.glow * 0.5);
            
            p.push();
            p.translate(particle.x, particle.y);
            
            // Multiple glow layers for better effect
            for (let layer = 3; layer > 0; layer--) {
              let layerSize = glowSize * layer * 0.8;
              let layerAlpha = (alpha / layer) * particle.glow;
              
              // Use pearl color for the trail - more subtle
              p.fill(240, 243, 245, layerAlpha * 0.2); // Reduced alpha
              p.noStroke();
              p.circle(0, 0, layerSize);
            }
            
            // Bright core - more subtle
            p.fill(255, 255, 255, alpha * particle.glow * 0.4); // Reduced alpha
            p.circle(0, 0, particle.size);
            
            p.pop();
          }
        }

        function updateBackground() {
          updateTimeOfDay();
          
          let currentTime = new Date();
          let hours = currentTime.getHours();
          let minutes = currentTime.getMinutes();
          let timeOfDay = hours + minutes/60;
          
          let targetColors = { r: 0, g: 0, b: 0 };
          
          if (timeOfDay >= 0 && timeOfDay < 4) {
            let t = p.map(timeOfDay, 0, 4, 0, 1);
            targetColors = lerpColors(dayNightCycle.colors.deepNight, dayNightCycle.colors.night, t);
          } else if (timeOfDay >= 4 && timeOfDay < 7) {
            let t = p.map(timeOfDay, 4, 7, 0, 1);
            targetColors = lerpColors(dayNightCycle.colors.night, dayNightCycle.colors.dawn, t);
          } else if (timeOfDay >= 7 && timeOfDay < 12) {
            let t = p.map(timeOfDay, 7, 12, 0, 1);
            targetColors = lerpColors(dayNightCycle.colors.dawn, dayNightCycle.colors.day, t);
          } else if (timeOfDay >= 12 && timeOfDay < 17) {
            let t = p.map(timeOfDay, 12, 17, 0, 1);
            targetColors = lerpColors(dayNightCycle.colors.day, dayNightCycle.colors.dusk, t);
          } else if (timeOfDay >= 17 && timeOfDay < 20) {
            let t = p.map(timeOfDay, 17, 20, 0, 1);
            targetColors = lerpColors(dayNightCycle.colors.dusk, dayNightCycle.colors.deepNight, t);
          } else {
            let t = p.map(timeOfDay, 20, 24, 0, 1);
            targetColors = lerpColors(dayNightCycle.colors.deepNight, dayNightCycle.colors.night, t);
          }
          
          bgColor.targetR = targetColors.r + (p.noise(bgColor.noiseOffsetR) - 0.5) * 3;
          bgColor.targetG = targetColors.g + (p.noise(bgColor.noiseOffsetG) - 0.5) * 3;
          bgColor.targetB = targetColors.b + (p.noise(bgColor.noiseOffsetB) - 0.5) * 3;
          
          bgColor.r = p.lerp(bgColor.r, bgColor.targetR, bgColor.lerpSpeed);
          bgColor.g = p.lerp(bgColor.g, bgColor.targetG, bgColor.lerpSpeed);
          bgColor.b = p.lerp(bgColor.b, bgColor.targetB, bgColor.lerpSpeed);
          
          bgColor.noiseOffsetR += bgColor.noiseSpeed;
          bgColor.noiseOffsetG += bgColor.noiseSpeed;
          bgColor.noiseOffsetB += bgColor.noiseSpeed;
          
          p.background(
            p.constrain(bgColor.r, 0, 255),
            p.constrain(bgColor.g, 0, 255),
            p.constrain(bgColor.b, 0, 255)
          );
        }

        function updateTimeOfDay() {
          let currentTime = new Date();
          dayNightCycle.hour = currentTime.getHours();
          let minutes = currentTime.getMinutes();
          
          let timeProgress = (dayNightCycle.hour * 60 + minutes) / 1440;
          let hourAngle = ((timeProgress * 24 - 2) / 24) * p.TWO_PI;
          
          dayNightCycle.brightness = p.map(
            p.sin(hourAngle), 
            -1, 1, 
            dayNightCycle.minBrightness, 
            dayNightCycle.maxBrightness
          );
          
          let nightBonus = (dayNightCycle.hour >= 22 || dayNightCycle.hour <= 4) ? 0.3 : 0;
          dayNightCycle.activityLevel = p.map(
            -p.sin(hourAngle), 
            -1, 1, 
            dayNightCycle.minActivity, 
            dayNightCycle.maxActivity
          ) + nightBonus;
        }

        function lerpColors(color1: any, color2: any, t: number) {
          return {
            r: p.lerp(color1.r, color2.r, t),
            g: p.lerp(color1.g, color2.g, t),
            b: p.lerp(color1.b, color2.b, t)
          };
        }

        function updateMetabolicCycle() {
          metabolicTimer += metabolicRate;
          
          if (p.random(1) < metabolicRate && nutrients.length < maxNutrients) {
            let segmentIndex = p.floor(p.random(segments.length));
            let segment = segments[segmentIndex];
            
            nutrients.push({
              x: segment.x + p.random(-10, 10),
              y: segment.y + p.random(-10, 10),
              age: 0,
              size: p.random(8, 15),
              opacity: p.random(0.8, 1.0),
              color: p.color(220 + p.random(-20, 20), 
                           240 + p.random(-20, 20), 
                           255, 
                           255),
              glowSize: p.random(2, 3)
            });
          }
        }

        function drawNutrients() {
          for (let i = nutrients.length - 1; i >= 0; i--) {
            let nutrient = nutrients[i];
            
            nutrient.age += 0.0005;
            nutrient.opacity *= 0.9995;
            
            p.noStroke();
            
            // Extract RGB values from the color object
            let r = p.red(nutrient.color);
            let g = p.green(nutrient.color);
            let b = p.blue(nutrient.color);
            
            for (let j = 4; j > 0; j--) {
              let glowSize = nutrient.size * j * 1.5;
              let glowAlpha = (nutrient.opacity * 255) / (j * 1.5);
              p.fill(r, g, b, glowAlpha);
              p.circle(nutrient.x, nutrient.y, glowSize);
            }
            
            p.fill(r, g, b, nutrient.opacity * 255);
            p.circle(nutrient.x, nutrient.y, nutrient.size);
            
            nutrient.x += p.sin(p.frameCount * 0.03 + i) * 0.5;
            nutrient.y += p.cos(p.frameCount * 0.03 + i) * 0.5;
            
            let head = segments[0];
            let d = p.dist(head.x, head.y, nutrient.x, nutrient.y);
            
            if (d < reabsorptionRadius) {
              let reabsorptionRate = p.map(d, 0, reabsorptionRadius, 0.3, 0.01);
              nutrient.opacity -= reabsorptionRate;
              
              headGlow = p.min(headGlow + reabsorptionRate * 1.5, maxGlow);
              
              let angle = p.atan2(head.y - nutrient.y, head.x - nutrient.x);
              nutrient.x += p.cos(angle) * reabsorptionRate * 6;
              nutrient.y += p.sin(angle) * reabsorptionRate * 6;
            }
            
            if (nutrient.opacity < 0.01 || nutrient.age > 8) {
              nutrients.splice(i, 1);
            }
          }
        }

        function updateTrail() {
          if (segments.length > 0) {
            trail.push(p.createVector(segments[0].x, segments[0].y));
            trailOpacity.push(1.0);
          }
          
          while (trail.length > trailLength) {
            trail.shift();
            trailOpacity.shift();
          }
          
          for (let i = 0; i < trailOpacity.length; i++) {
            trailOpacity[i] *= trailDecay;
          }
        }

        function drawTrail() {
          if (trail.length < 2) return;
          
          p.noFill();
          for (let i = 0; i < trail.length - 1; i++) {
            let alpha = trailOpacity[i] * 255;
            if (alpha > 1) {
              let ripple = p.sin(p.frameCount * 0.05 + i * 0.1) * 1.5;
              let ageSpread = p.map(i, 0, trail.length, 0, trailSpread);
              let currentWidth = (trailWidth / 10) + ageSpread + ripple;
              
              p.strokeWeight(currentWidth);
              
              let blueShade = p.map(i, 0, trail.length, 200, 180);
              p.stroke(180, blueShade, 255, alpha * 0.25);
              
              p.line(trail[i].x, trail[i].y, trail[i+1].x, trail[i+1].y);
            }
            
            trailOpacity[i] *= trailDecay;
            
            let ageFactor = p.map(i, 0, trail.length, 0.1, 0.01);
            trail[i].x += p.sin(p.frameCount * 0.01 + i * 0.1) * ageFactor;
            trail[i].y += p.cos(p.frameCount * 0.01 + i * 0.1) * ageFactor;
          }
        }

        function updateFoodParticles() {
          for (let i = foodParticles.length - 1; i >= 0; i--) {
            let food = foodParticles[i];
            
            if (p.millis() - food.spawnTime < 500) {
              food.size = p.map(p.millis() - food.spawnTime, 0, 500, 0, p.random(8, 15));
            }
            
            food.x += p.sin(p.frameCount * 0.05 + food.wiggleOffset) * 0.5;
            food.y += p.cos(p.frameCount * 0.05 + food.wiggleOffset) * 0.5;
            
            p.noStroke();
            for (let j = 3; j > 0; j--) {
              let glowSize = food.size * (1 + j * 0.5);
              let alpha = p.map(j, 3, 0, 30, 200);
              food.color.setAlpha(alpha);
              p.fill(food.color);
              p.circle(food.x, food.y, glowSize);
            }
            
            let d = p.dist(food.x, food.y, segments[0].x, segments[0].y);
            let eatRadius = segmentLength * organismSize;
            
            if (d < eatRadius) {
              organismSize = p.min(organismSize + particleNutrition, maxOrganismSize);
              digestionEnergy += particleNutrition * 2;
              
              foodParticles.splice(i, 1);
              
              headGlow = maxGlow * 2;
            }
          }
        }

        function attractToFood() {
          let head = segments[0];
          let closestFood = null;
          let closestDist = foodAttractionRadius;
          
          for (let food of foodParticles) {
            let d = p.dist(head.x, head.y, food.x, food.y);
            if (d < closestDist) {
              closestDist = d;
              closestFood = food;
            }
          }
          
          if (closestFood) {
            let attraction = p.createVector(
              closestFood.x - head.x,
              closestFood.y - head.y
            );
            
            let strength = p.map(closestDist, 0, foodAttractionRadius, attractionForce, 0);
            attraction.setMag(strength);
            
            targetX += attraction.x * 10;
            targetY += attraction.y * 10;
            
            p.stroke(200, 220, 255, 50);
            p.strokeWeight(1);
            p.line(head.x, head.y, closestFood.x, closestFood.y);
            
            speedMultiplier = p.map(closestDist, 0, foodAttractionRadius, 1.5, 1);
          }
        }

        // Add all the missing organic functions from original code
        function getOrganismColor() {
          updateTimeOfDay();
          let hour = new Date().getHours();
          
          let bodyColor, glowColor;
          
          if (hour >= 0 && hour < 6) {
            // Deep night (midnight to 6am)
            bodyColor = { r: 25, g: 83, b: 95, a: 255 };  // Deep teal
            glowColor = { r: 11, g: 122, b: 117, a: 255 };  // Jade
          } else if (hour >= 6 && hour < 9) {
            // Dawn (6am to 9am)
            bodyColor = { r: 215, g: 201, b: 170, a: 255 };  // Sand
            glowColor = { r: 123, g: 45, b: 38, a: 255 };  // Rust
          } else if (hour >= 9 && hour < 17) {
            // Day (9am to 5pm)
            bodyColor = { r: 240, g: 243, b: 245, a: 255 };  // Pearl
            glowColor = { r: 11, g: 122, b: 117, a: 255 };  // Jade
          } else if (hour >= 17 && hour < 20) {
            // Dusk (5pm to 8pm)
            bodyColor = { r: 123, g: 45, b: 38, a: 255 };  // Rust
            glowColor = { r: 215, g: 201, b: 170, a: 255 };  // Sand
          } else {
            // Night (8pm to midnight)
            bodyColor = { r: 25, g: 83, b: 95, a: 255 };  // Deep teal
            glowColor = { r: 240, g: 243, b: 245, a: 255 };  // Pearl
          }
          
          return {
            body: bodyColor,
            glow: {
              ...glowColor,
              a: (hour >= 0 && hour < 6) || (hour >= 20) ? 140 : 190
            }
          };
        }

        function updateTimeBasedBehavior() {
          let hour = new Date().getHours();
          let isNight = (hour >= 0 && hour < 6) || (hour >= 20);
          let isDawn = hour >= 6 && hour < 9;
          let isDay = hour >= 9 && hour < 17;
          let isDusk = hour >= 17 && hour < 20;
          
          if (isNight) {
            noiseSpeed = baseNoiseSpeed * 0.7;
            noiseAmount = baseNoiseAmount * 1.3;
            segmentLength = baseSegmentLength * 1.1;
          } else if (isDawn) {
            noiseSpeed = baseNoiseSpeed * 0.9;
            noiseAmount = baseNoiseAmount * 1.1;
            segmentLength = baseSegmentLength;
          } else if (isDay) {
            noiseSpeed = baseNoiseSpeed * 1.2;
            noiseAmount = baseNoiseAmount * 0.8;
            segmentLength = baseSegmentLength * 0.9;
          } else if (isDusk) {
            noiseSpeed = baseNoiseSpeed;
            noiseAmount = baseNoiseAmount;
            segmentLength = baseSegmentLength * 1.05;
          }
        }

        function updateEvolution() {
          let currentTime = p.millis();
          let progress = (currentTime - evolutionState.startTime) / evolutionState.evolutionDuration;
          evolutionState.awakening = p.constrain(progress, 0, 1);
          
          let timeBonus = dayNightCycle.activityLevel * 0.3;
          
          evolutionState.movement = (smoothstep(0, 0.3, evolutionState.awakening) + timeBonus) * 
                                   p.map(dayNightCycle.activityLevel, 0, 1, 0.7, 1.3);
          noiseSpeed = baseNoiseSpeed * evolutionState.movement;
          noiseAmount = baseNoiseAmount * evolutionState.movement;
          speedMultiplier = p.map(evolutionState.movement, 0, 1, 0.1, 1);
          
          evolutionState.sound = (smoothstep(0.1, 0.4, evolutionState.awakening) + timeBonus) * 
                                p.map(dayNightCycle.activityLevel, 0, 1, 0.7, 1.3);
        }

        function smoothstep(edge0: number, edge1: number, x: number) {
          x = p.constrain((x - edge0) / (edge1 - edge0), 0, 1);
          return x * x * (3 - 2 * x);
        }

        function updateDrone() {
          if (!soundEnabled || !audioStarted) return;
          
          let speed = p.dist(segments[0].x, segments[0].y, lastPosition.x, lastPosition.y);
          
          // Only very occasional and subtle drone sounds
          let droneChance = p.map(speed, 0, 10, 0.001, 0.005); // Very low probability
          
          if (p.random(1) < droneChance) {
            // Extremely subtle base frequencies - much higher and gentler
            let baseFreq = p.map(segments[0].y, p.height, 0, 200, 400);
            let detune = p.map(segments[0].x, 0, p.width, -1, 1); // Minimal detune
            
            // Barely perceptible evolution modulation
            let evolutionMod = p.sin(p.frameCount * 0.002) * 0.2; // Tiny modulation
            
            // Extremely quiet and brief sounds - more like whispers
            let baseAmp = p.map(speed, 0, 10, 0.001, 0.0005); // Even quieter
            let whisperAmp = p.abs(p.sin(p.frameCount * 0.01)) * 0.0005; // Softer whisper effect (absolute value)
            
            // Very brief sound bursts instead of continuous drones
            if (droneOsc1 && typeof droneOsc1.freq !== 'undefined') {
              if (typeof droneOsc1.freq === 'function') {
                droneOsc1.freq(baseFreq + evolutionMod);
                droneOsc1.amp(p.constrain(baseAmp + whisperAmp, 0, 1)); // Constrain amplitude to safe range
              } else {
                droneOsc1.freq = baseFreq + evolutionMod;
                droneOsc1.amp = p.constrain(baseAmp + whisperAmp, 0, 1); // Constrain amplitude to safe range
              }
              
              // Turn off quickly to make it more like whispers than drones
              setTimeout(() => {
                if (typeof droneOsc1.amp === 'function') {
                  droneOsc1.amp(0);
                } else {
                  droneOsc1.amp = 0;
                }
              }, p.random(50, 200)); // Very brief duration
            }
            
            // Second oscillator even more rarely
            if (p.random(1) < 0.3 && droneOsc2 && typeof droneOsc2.freq !== 'undefined') {
              if (typeof droneOsc2.freq === 'function') {
                droneOsc2.freq(baseFreq * 1.1 + detune);
                droneOsc2.amp(p.constrain((baseAmp * 0.1) + (whisperAmp * 0.1), 0, 1)); // Constrain amplitude to safe range
              } else {
                droneOsc2.freq = baseFreq * 1.1 + detune;
                droneOsc2.amp = p.constrain((baseAmp * 0.1) + (whisperAmp * 0.1), 0, 1); // Constrain amplitude to safe range
              }
              
              setTimeout(() => {
                if (typeof droneOsc2.amp === 'function') {
                  droneOsc2.amp(0);
                } else {
                  droneOsc2.amp = 0;
                }
              }, p.random(30, 100)); // Even briefer
            }
          }
        }

        function updateAmbientSound() {
          if (!soundEnabled || evolutionState.sound < 0.2) return;
          
          let currentTime = p.millis();
          let ambientIntensity = evolutionState.sound;
          
          // Extremely rare and gentle ambient sounds - more like environmental whispers
          let ambientChance = p.map(ambientIntensity, 0, 1, 0.0005, 0.002); // Much rarer
          
          if (p.random(1) < ambientChance) {
            // Much more subtle ambient sounds - like gentle wind or water
            let baseAmp = p.map(ambientIntensity, 0, 1, 0.001, 0.008); // Much quieter
            
            // Very gentle fluctuations
            volumeNoiseOffset += volumeNoiseSpeed * 0.2; // Much slower
            volumeFluctuation = p.noise(volumeNoiseOffset) * 0.05; // Minimal fluctuation
            let fluctuatingAmp = baseAmp * (1 + volumeFluctuation);
            
            // Extremely subtle pulsing - barely noticeable
            let pulsing = p.sin(currentTime * 0.0002) * 0.05 + 0.95; // Nearly constant
            
            // Higher, more ethereal frequency range - less drone-like
            let ambientFreq = p.map(p.sin(currentTime * 0.0003), -1, 1, 300, 600); // Higher frequencies
            
            // Apply extremely quiet ambient whisper
            if (typeof osc !== 'undefined' && osc.amp) {
              if (typeof osc.freq === 'function') {
                osc.freq(ambientFreq);
                osc.amp(p.constrain(fluctuatingAmp * pulsing * 0.1, 0, 1)); // Even quieter, constrained to safe range
              }
              
              // Turn off quickly to make it more like environmental sounds
              setTimeout(() => {
                if (typeof osc.amp === 'function') {
                  osc.amp(0);
                } else if (osc.amp) {
                  osc.amp = 0;
                }
              }, p.random(100, 500)); // Brief whispers instead of continuous drones
            }
          }
        }

        function updateGrowth() {
          // Simplified growth system
          if (digestionEnergy > 0) {
            digestionEnergy = p.max(0, digestionEnergy - energyDecayRate);
          }
        }

        function updateEnvironmentDisplay() {
          // This would update UI elements if they exist
          let hour = new Date().getHours();
          
          let phase = '';
          if ((hour >= 0 && hour < 6) || (hour >= 20)) phase = '🌙 Night';
          else if (hour >= 6 && hour < 9) phase = '🌅 Dawn';
          else if (hour >= 9 && hour < 17) phase = '☀️ Day';
          else if (hour >= 17 && hour < 20) phase = '🌆 Dusk';
          
          let activity = '';
          if (dayNightCycle.activityLevel < 0.5) activity = 'Low';
          else if (dayNightCycle.activityLevel < 1.0) activity = 'Medium';
          else activity = 'High';
        }

        function getTrailColor() {
          let colors = getOrganismColor();
          let timeOfDay = new Date().getHours();
          
          let trailColor;
          if (timeOfDay >= 0 && timeOfDay < 6) {
            trailColor = PALETTE.sand;
          } else if (timeOfDay >= 6 && timeOfDay < 12) {
            trailColor = PALETTE.rust;
          } else if (timeOfDay >= 12 && timeOfDay < 18) {
            trailColor = PALETTE.jade;
          } else {
            trailColor = PALETTE.pearl;
          }
          
          // If trail color is too similar to body, use different color
          if (Math.abs(colors.body.r - trailColor.r) < 30 &&
              Math.abs(colors.body.g - trailColor.g) < 30 &&
              Math.abs(colors.body.b - trailColor.b) < 30) {
            trailColor = PALETTE.deepTeal;
          }
          
          return trailColor;
        }


        function cleanupResources() {
          try {
            if (!Array.isArray(trail)) trail = [];
            if (!Array.isArray(trailOpacity)) trailOpacity = [];
            if (!Array.isArray(nutrients)) nutrients = [];
            
            while (trail.length > MAX_TRAIL_LENGTH) {
              trail.shift();
              trailOpacity.shift();
            }
            
            nutrients = nutrients.filter(n => 
              n && typeof n.age === 'number' && n.age < MAX_NUTRIENT_AGE);
            
            if (foldingNutrients && foldProgress > 1.5) {
              foldingNutrients = false;
              nutrientCluster = [];
              foldTarget = null;
            }
            
            isProcessingCluster = false;
            
          } catch (e) {
            console.error('Cleanup error:', e);
            trail = [];
            trailOpacity = [];
            nutrients = [];
            foldingNutrients = false;
            isProcessingCluster = false;
          }
        }
      };

      if (sketchRef.current) {
        p5InstanceRef.current = new p5(sketch, sketchRef.current);
      }
    };

    loadLibraries();

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className={`fixed inset-0 bg-black flex items-center justify-center ${className}`}>
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return <div ref={sketchRef} className={`fixed inset-0 ${className}`} />;
}