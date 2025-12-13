/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, Hexagon, Database, Play, 
  FileText, Star, Heart, Feather, Moon, Sun,
  Cpu, Code, Terminal, Layers, Shield
} from 'lucide-react';
import profilePic from './assets/profile.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return new URL(`./assets/${path}`, import.meta.url).href;
};

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });
const useTheme = () => useContext(ThemeContext);

/* -------------------------------------------------------------------------- */
/* 📂 DATA CORE: PROFESSIONAL PORTFOLIO                                       */
/* -------------------------------------------------------------------------- */

const USER_PROFILE = {
  id: "APPLICANT",
  name: "Zhenming Duan",
  avatar: profilePic,
  bio: "An explorer of interactive frontiers, a technical generalist, and a bridge between disciplines.",
  attributes: [
    { label: "LOGIC", text: "Gameplay Systems & Mechanics", color: "#60A5FA" },
    { label: "CREATIVITY", text: "Technical Art & Visual Design", color: "#F472B6" },
    { label: "TECH", text: "Unity / Unreal / C++ / C#", color: "#A78BFA" },
    { label: "ENGINEERING", text: "Graphics, Physics & AI", color: "#34D399" }
  ]
};

const SKILL_NODES = [
  { id: 'root', x: 50, y: 50, label: 'GAME DEV', icon: Hexagon, category: 'core', desc: 'Core Development Hub', labelPos: 'top' },
  // Code Branch
  { id: 'c1', x: 50, y: 30, label: 'Gameplay Engineering & Prototyping', parent: 'root', category: 'code', desc: 'System Architecture', labelPos: 'bottom' },
  { id: 'c2', x: 40, y: 10, label: 'Languages', parent: 'c1', category: 'code', level: 'ENGINEERING', desc: 'Proficient in C# for Unity development. Experienced in C++ system programming, including building a simple compiler and a raw Win32 API application. Familiar with TypeScript and HTML.', labelPos: 'bottom' },
  { id: 'c3', x: 60, y: 10, label: 'Engines', parent: 'c1', category: 'code', level: 'ENGINEERING', desc: 'Extensive development experience in Unity (Scripting API, Physics, UI) and foundational knowledge of Unreal Engine 5 (Blueprints & C++ adaptation).', labelPos: 'bottom' },
  { id: 'c4', x: 70, y: 20, label: 'Gameplay Programming', parent: 'c1', category: 'code', level: 'ENGINEERING', desc: 'Engineering complex gameplay architectures: developed a Multi-tactics System for RTS units and a Modular Attribute System for scalable numerical calculations. Experienced in coding robust 3D Character Controllers and implementing multi-phase Boss AI using advanced State Machines.', labelPos: 'bottom' },
  { id: 'c5', x: 30, y: 20, label: 'Computer Graphics & Math', parent: 'c1', category: 'code', level: 'ENGINEERING', desc: 'Solid academic foundation in Computer Graphics. Implemented a Path Tracer from scratch, applying advanced Linear Algebra and 3D transformation logic.', labelPos: 'bottom' },
  // Art Branch
  { id: 'a1', x: 70, y: 50, label: 'Technical Art & Graphics Pipeline', parent: 'root', category: 'art', desc: 'Visual Implementation', labelPos: 'bottom' },
  { id: 'a2', x: 85, y: 35, label: 'Shaders & VFX', parent: 'a1', category: 'art', level: 'TECH ART', desc: 'Capable of creating visual effects using Shader Graph and HLSL. Familiar with the render pipeline and exploring stylized rendering techniques.', labelPos: 'top' },
  { id: 'a3', x: 85, y: 65, label: 'Tools Development', parent: 'a1', category: 'art', level: 'TECH ART', desc: 'Building workflow accelerators: Shader Migration Scripts, Runtime Animation Previews, and a Developer Console for rapid level testing and debugging.', labelPos: 'top' },
  { id: 'a4', x: 90, y: 50, label: 'Asset Creation', parent: 'a1', category: 'art', level: 'TECH ART', desc: 'Modeling and rigging Stylized Characters in Blender, ensuring proper topology for animation and seamless engine integration.', labelPos: 'top' },
  // Design Branch
  { id: 'd1', x: 50, y: 70, label: 'Design & Architecture', parent: 'root', category: 'design', desc: 'Mechanic and architecture Design', labelPos: 'top' },
  { id: 'd2', x: 35, y: 85, label: 'System Design', parent: 'd1', category: 'design', level: 'DESIGN', desc: 'Architecting robust Gameplay Loops and economy systems. Utilizing Excel/VBA simulations to balance numerical progression and combat mechanics.', labelPos: 'top' },
  { id: 'd3', x: 65, y: 85, label: 'Code Architecture', parent: 'd1', category: 'design', level: 'DESIGN', desc: 'Utilizing Design Patterns (Singleton, Observer, State) to create decoupled, maintainable, and scalable codebases for long-term projects.', labelPos: 'top' },
  { id: 'd4', x: 50, y: 90, label: 'Procedural Content Generation (PCG)', parent: 'd1', category: 'design', level: 'DESIGN', desc: 'Developing automated level generation tools, specifically utilizing the Wave Function Collapse (WFC) algorithm for coherent maze structures.', labelPos: 'bottom' },
  // Tools Branch
  { id: 't1', x: 30, y: 50, label: 'Emerging Tech & Workflow', parent: 'root', category: 'tool', desc: 'Workflow Optimization', labelPos: 'bottom' },
  { id: 't2', x: 10, y: 50, label: 'AIGC Workflow', parent: 't1', category: 'tool', level: 'WORKFLOW', desc: 'Integrating Generative AI into production pipelines: LoRA training for style consistency, ComfyUI workflows for texture generation, and RVC for voice synthesis.', labelPos: 'top' },
  { id: 't3', x: 15, y: 65, label: 'Collaboration', parent: 't1', category: 'tool', level: 'WORKFLOW', desc: 'Managing source code with Git/GitHub for team collaboration and creating clear technical documentation (GDDs/Wikis) to bridge art and engineering.', labelPos: 'bottom' },
];

const INVENTORY_ITEMS = [
  {
    id: 'proj_01',
    name: 'ASTALIA STELLARIS',
    type: 'Vtuber project',
    rarity: 'MYTHIC',
    role: 'Producer, TechArtist, Narrative Designer, Virtual Performer',
    tag: ['Virtual Idol', 'Live2D', 'modeling', 'rendering'],
    platform: 'NONE',
    desc: 'A virtual redemption experiment born from a community crisis. A cross-media narrative integrating real-time voice conversion, Live2D performance, and 3D interaction.',
    detailedDesc: `
Astalia Stellaris is a cross-media project integrating VTuber performance, AI technology, and 3D game assets. Born from a 2024 community crisis surrounding the game Blue Archive, this project evolved from my role as a protest organizer into an ethnographic experiment. Observing the emotional fragility of East Asian players under high social pressure, I created Astalia Stellaris—a virtual character brought to life via RVC (Real-time Voice Conversion) on Bilibili and Unity/Blender development. It explores the boundaries of “Virtual Love” and community healing through digital identity

My goal is to explore the potential of games as an "experience engine" for emotional solace. I argue that the intense player backlash I witnessed stems not just from game mechanics, but from the repressed social atmosphere in East Asia, where many project unmet emotional needs onto virtual worlds.

I believe: "**Not everyone has the ability to obtain love, but everyone is worthy of it.**"

Astalia is my response to this demand. By combining the immediate companionship of live streaming with the deep interactivity of game mechanics, I aim to build a narrative space that offers emotional repair and questions the ethics of virtual-physical connections.

    `,
    contentCards: [
      { type: 'link', content: 'https://phantomcatty.github.io/Astalia_Stellaris/', description: 'View Project Website' },
      { type: 'image', content: 'img1_1.png' },
      { type: 'image', content: 'img1_2.png' },
    ],
    previewColor: '#60A5FA' 
  },
  {
    id: 'proj_02',
    name: 'CONTRACT OF FATE',
    type: 'Live Commercial F2P Title',
    rarity: 'LEGENDARY',
    role: 'Game Economy Designer & System Designer',
    tag: ['Hero Collector RPG', 'Character Progression', '3D Anime Aesthetics'],
    platform: 'Mobile (iOS/Android)',
    desc: 'Served as the primary Numerical Designer and supporting System Designer for a live 3D anime-style hero collector RPG. Responsible for the production, economy balancing, and system logic.',
    detailedDesc: `
Contract of Fate is a 3D Idle Card RPG featuring anime-style aesthetics and strategy elements. As a System and Numerical Designer, I focused on optimizing the game's economy, analyzing player data, and leading the design of high-revenue seasonal events.

**Key Contributions**
*	Numerical System Refactoring: I rebuilt the mathematical foundations for several core systems, including the complex cross-server monetization modules. By validating these designs with custom Unity testing tools and Excel simulations, I ensured the game's economy remained balanced and engaging.
*	Major Event Design: I led the comprehensive numerical design for the Spring Festival update. My work involved creating detailed user profiles based on quantitative analytics and designing a closed-loop economy (balancing Premium Currency vs. In-game Resources). This event was a commercial success, contributing over 2.5 million RMB to the project's revenue.
*	Production Management: Beyond design, I acted as a central hub for project coordination. Using Feishu/Lark, I streamlined communication between departments, resulting in a perfect on-time delivery record for the modules under my supervision.

    `,
    contentCards: [
      { type: 'link', content: 'https://play.google.com/store/apps/details?id=com.mover.twmysq&pli=1', description: 'View on Google Play' },
      { type: 'image', content: 'img2_1.png' },
    ],
    previewColor: '#A78BFA' 
  },
  {
    id: 'proj_03',
    name: 'NEKOS WAR',
    type: '2D Real-Time Tactical Tower Defense',
    rarity: 'EPIC',
    role: 'Solo Developer (System Design, Programming, Gameplay)',
    tag: ['Modular Damage Calculator', 'Dual-directional Build'],
    platform: 'PC(Win)',
    desc: 'Nekos War is a Real-Time Tactical Tower Defense game that replaces static towers with mobile, commandable Cat Operators. Manage your Coffee reserves, deploy your squad, and micro-manage their tactical stances to survive the rodent invasion.',
    detailedDesc: `
Nekos' War is a 2D strategy game that hybridizes the structural progression of Tower Defense with the micro-management of Real-Time Strategy (RTS). Instead of static towers, players command mobile Agents with distinct classes and active skills. The game features a complex, modular damage calculation system and a dual-progression economy, allowing players to synergize in-game leveling with Roguelike artifact builds.

This is a solo project. I was responsible for all code architecture, system design, and gameplay balancing.
* Modular Damage Calculator: I engineered a custom calculator module to handle complex damage pipelines. This system categorizes modifiers (Vulnerability, Additive, Multiplicative, Armor Pen, Final Dmg) and processes them in a customizable order. This architecture allows for the easy implementation of intricate buffs/debuffs without hard-coding specific interactions, significantly increasing development scalability.
* Dual-Layer Progression: I designed a resource loop where players must balance spending tokens on immediate Hero Leveling vs. purchasing Roguelike Artifacts (Items) that offer global passive benefits, creating a tension between short-term power and long-term scaling.
* Note on Visuals: Some visual assets were generated using AI tools to allow me to focus entirely on system architecture and gameplay logic verification.

    `,
    contentCards: [
      { type: 'link', content: 'https://nekokop.itch.io/nekos-war', description: 'View on Itch.io' },
      { type: 'link', content: '/Design_Statement_Nekos_War.pdf', description: 'View Design Statement' },
      { type: 'image', content: 'img3_1.png' },
      { type: 'image', content: 'img3_2.png' },
    ],
    previewColor: '#F472B6' 
  },
  {
    id: 'proj_04',
    name: 'SWEET ADVENTURE',
    type: '2D Puzzle-Platformer',
    rarity: 'RARE',
    role: 'Solo Developer (System Design, Programming, Gameplay)',
    tag: ['Experimental Mechanics', 'Constraint-based Design', 'Finite State Machine'],
    platform: 'PC(Win)',
    desc: 'Sweet Adventure is a comprehensive solo remake of a previous Game Jam prototype, representing a personal exploration into constraint-based mechanics and the intersection of platforming precision with rhythmic flow.',
    detailedDesc: `
Moving away from traditional input mapping, I designed a unique "**Cyclic Action System**" where Jump, Dash, and Float abilities are bound to a single execution key. Players must strategically toggle between these states to navigate levels. This project served as a technical and design playground to experiment with restrictive control schemes and modular system architecture.
Design: The "Cyclic" Mechanic 
*	Input Constraints & Strategy: Designed a non-traditional control scheme where players lack simultaneous access to movement abilities. Instead, Jump, Dash, and Float are mutually exclusive states that must be cycled through.
*	Mechanic-Driven Level Design: Constructed puzzle-platforming levels specifically tailored to this switching mechanic, requiring players to plan their input sequence (Rhythm & Flow) rather than relying solely on reflex.
Technical: Architecture & AI 
*	Modular Level Management: Implemented a Prefab-based level streaming system to ensure efficient scene management and seamless transitions.
*	Memory Optimization: Optimized memory usage and Garbage Collection (GC) performance through efficient resource management (e.g., Object Pooling).
*	FSM AI Behavior: Developed complex Boss AI using Finite State Machines (FSM), allowing for dynamic phase transitions and predictable yet challenging attack patterns.

    `,
    contentCards: [
      { type: 'image', content: 'img3_1.png' },
      { type: 'image', content: 'img3_2.png' },
    ],
    previewColor: '#34D399' 
  },
];

/* -------------------------------------------------------------------------- */
/* ✨ VISUAL FX COMPONENTS                                                    */
/* -------------------------------------------------------------------------- */

const StardustOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full mix-blend-screen">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,30,0.4)_100%)]" />
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    <div className="absolute inset-0 backdrop-blur-[0.5px] opacity-20" />
  </div>
);

// Modified Cursor: Yellow 4-Pointed Star with Stardust Trail
const StarCursor = () => {
  const cursorRef = useRef(null);
  const [trails, setTrails] = useState([]);
  
  // Trail logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Move main cursor
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Add trail particle occasionally
      if (Math.random() > 0.5) {
        const newTrail = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2
        };
        setTrails(prev => [...prev.slice(-15), newTrail]); // Keep last 15
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cleanup old trails
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => prev.filter(t => Date.now() - t.id < 500)); // Remove after 500ms
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Trail Particles */}
      {trails.map(t => (
        <div 
          key={t.id}
          className="fixed pointer-events-none rounded-full bg-white animate-fadeOut z-[99]"
          style={{
            left: t.x,
            top: t.y,
            width: t.size,
            height: t.size,
            opacity: 0.8,
            transform: 'translate(-50%, -50%)',
            animation: 'fadeOut 0.5s forwards'
          }}
        />
      ))}

      {/* Main Cursor: Yellow 4-Pointed Star */}
      <div ref={cursorRef} className="fixed top-0 left-0 pointer-events-none z-[100] transition-transform duration-75 ease-out">
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Glow */}
          <div className="absolute inset-0 bg-yellow-400/30 blur-md rounded-full transform scale-150" />
          {/* 4-Pointed Star SVG */}
          <svg width="32" height="32" viewBox="0 0 24 24" className="drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
             <path 
               d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
               fill="#FACC15" // Yellow-400
             />
          </svg>
        </div>
      </div>
      <style>{`
        @keyframes fadeOut {
          to { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
        }
      `}</style>
    </>
  );
};

// Modified Background: Sky Blue & Pale Pink Stars
const StarSeaBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Star particles
    const stars = Array.from({ length: 120 }, () => {
      // Determine base color: Sky Blue or Pale Pink
      const isBlue = Math.random() > 0.5;
      const baseHue = isBlue ? 200 : 340; // 200: Sky Blue, 340: Pink
      const saturation = isBlue ? '90%' : '80%';
      // Adjust lightness based on theme
      const baseLightness = theme === 'dark' ? 75 : 40;
      const lightness = baseLightness + Math.random() * 20; 
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.15 + 0.05,
        color: `hsl(${baseHue}, ${saturation}, ${lightness}%)`
      };
    });

    const draw = () => {
      // Deep Space Background (Darker to make stars pop)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (theme === 'dark') {
        gradient.addColorStop(0, '#0F172A'); // Slate 900
        gradient.addColorStop(1, '#1e1b4b'); // Indigo 950
      } else {
        gradient.addColorStop(0, '#f0f9ff'); // Sky 50
        gradient.addColorStop(1, '#e0f2fe'); // Sky 100
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      
      ctx.beginPath();
      for(let x=0; x<canvas.width; x+=gridSize) { ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); }
      for(let y=0; y<canvas.height; y+=gridSize) { ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); }
      ctx.stroke();

      // Draw Stars
      stars.forEach(star => {
        star.y -= star.speed; 
        star.alpha += (Math.random() - 0.5) * 0.02; // Slower twinkle
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 0.8) star.alpha = 0.8;
        
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Occasional sparkles
        if (Math.random() > 0.999 && star.size > 1.5) {
           ctx.fillStyle = theme === 'dark' ? '#FFF' : '#000';
           ctx.globalAlpha = 1;
           ctx.fillRect(star.x - 2, star.y - 0.5, 4, 1);
           ctx.fillRect(star.x - 0.5, star.y - 2, 1, 4);
        }
      });
      ctx.globalAlpha = 1;
      
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={`fixed inset-0 z-0 ${theme === 'dark' ? 'bg-[#0B0B19]' : 'bg-slate-50'}`} />;
};

/* -------------------------------------------------------------------------- */
/* 📱 VIEWS                                                                   */
/* -------------------------------------------------------------------------- */

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [bootLog, setBootLog] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const logs = [
      "INITIALIZING PORTFOLIO MODULE...",
      "LOADING ASSETS...",
      "SYNCING PROJECT DATA...",
      "CALIBRATING VISUAL INTERFACE...",
      "SYSTEM READY."
    ];
    let i = 0;
    const logInterval = setInterval(() => {
      if (i < logs.length) {
        setBootLog(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = null;
      }
      onComplete();
    }
  }, [progress, onComplete]);

  const handleMouseDown = () => {
    if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
    
    const animate = () => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1.5; // Smooth increment ~90% per second at 60fps
      });
      intervalRef.current = requestAnimationFrame(animate);
    };
    intervalRef.current = requestAnimationFrame(animate);
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }
    if (progress < 100) setProgress(0);
  };

  return (
    <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center font-sans text-white/90 selection:bg-pink-500/30">
      <div className="absolute animate-[spin_30s_linear_infinite] w-[600px] h-[600px] rounded-full border border-white/5 opacity-10 pointer-events-none" />
      
      <div className="w-96 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8 shadow-[0_0_40px_rgba(244,114,182,0.15)] flex flex-col items-center">
        <Sparkles className="text-yellow-300 mb-4 animate-bounce" size={40} />
        
        <h1 className="text-2xl font-bold tracking-[0.2em] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-pink-300">SYSTEM BOOT</h1>
        <div className="text-[10px] text-white/50 tracking-widest mb-8">ZHENMING_DUAN_PORTFOLIO</div>
        
        <div className="w-full h-24 overflow-hidden text-xs text-blue-100/70 mb-6 font-mono leading-relaxed text-center">
          {bootLog.map((log, idx) => (
            <div key={idx} className="mb-1 opacity-80">{log}</div>
          ))}
        </div>

        <div className="relative group w-full">
          <button 
            className="w-full py-4 rounded-lg bg-white/5 border border-white/10 text-white font-medium tracking-widest relative overflow-hidden transition-all group-hover:bg-white/10 group-hover:border-blue-400/50 shadow-lg"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            <span className="relative z-10 drop-shadow-md">ENTER SYSTEM</span>
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500/50 to-pink-500/50 z-0"
              style={{ width: `${progress}%` }}
            />
          </button>
          <div className="text-[10px] text-center mt-3 text-white/30 font-mono">HOLD TO INITIALIZE</div>
        </div>
      </div>
    </div>
  );
};

const SkillConstellation = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const { theme } = useTheme();

  const isPathActive = (startId, endId) => {
    if (!hoveredNode) return false;
    if (hoveredNode === startId || hoveredNode === endId) return true;
    let current = SKILL_NODES.find(n => n.id === hoveredNode);
    while (current && current.id !== 'root') {
      if ((current.id === startId && current.parent === endId) ||
          (current.id === endId && current.parent === startId)) {
        return true;
      }
      current = SKILL_NODES.find(n => n.id === current.parent);
    }
    return false;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="relative w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl aspect-square max-h-[85vh]">
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 pointer-events-none">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-pink-300">TECH STACK</h2>
          <p className={`text-xs font-mono mt-1 tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>SKILL DEPENDENCY GRAPH</p>
        </div>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(96,165,250,0.2)]">
          <circle cx="50" cy="50" r="30" fill="none" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)"} />
          <circle cx="50" cy="50" r="45" fill="none" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)"} strokeDasharray="4 4" />

          {SKILL_NODES.map(node => {
            if (!node.parent) return null;
            const parent = SKILL_NODES.find(n => n.id === node.parent);
            const active = isPathActive(node.id, parent.id);
            return (
              <motion.line
                key={`${node.id}-${parent.id}`}
                x1={node.x} y1={node.y}
                x2={parent.x} y2={parent.y}
                stroke={active ? '#60A5FA' : (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')}
                strokeWidth={active ? 0.6 : 0.2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            );
          })}
          
          {SKILL_NODES.map(node => {
            const isHovered = hoveredNode === node.id;
            return (
              <g 
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                {isHovered && <circle cx={node.x} cy={node.y} r={5} fill="#60A5FA" filter="blur(2px)" />}
                <circle 
                  cx={node.x} cy={node.y} 
                  r={isHovered ? 3 : 2} 
                  fill={isHovered ? (theme === 'dark' ? "#fff" : "#000") : "#94A3B8"}
                  className="transition-all duration-300"
                />
                <text
                  x={node.x}
                  y={node.labelPos === 'bottom' ? node.y + 6 : node.y - 4}
                  textAnchor="middle"
                  fill={isHovered ? (theme === 'dark' ? "#fff" : "#000") : (theme === 'dark' ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)")}
                  fontSize="1.8"
                  className="pointer-events-none select-none font-mono tracking-wider transition-all duration-300"
                  style={{ 
                    textShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.8)' : 'none',
                    opacity: isHovered ? 1 : 0.7
                  }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {hoveredNode && (() => {
            const node = SKILL_NODES.find(n => n.id === hoveredNode);
            if (!node) return null;
            const isRight = node.x > 50;
            return (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ 
                  left: isRight ? 'auto' : `${node.x}%`,
                  right: isRight ? `${100 - node.x}%` : 'auto',
                  top: `${node.y}%`,
                }}
                className={`absolute z-50 pointer-events-none -mt-6 ${isRight ? 'mr-6' : 'ml-6'}`}
              >
                <div className={`border px-6 py-5 rounded-xl backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] min-w-[140px] w-max max-w-[380px] ${theme === 'dark' ? 'bg-slate-900/95 border-blue-500/30' : 'bg-white/95 border-blue-500/20'}`}>
                  <div className={`text-xl font-bold tracking-wide ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>{node.label}</div>
                  {node.level && (
                    <div className="text-sm text-blue-300/80 font-mono mt-2 bg-blue-500/10 inline-block px-2 py-1 rounded">
                      {node.level}
                    </div>
                  )}
                  <div className={`text-xs font-mono mt-3 uppercase tracking-widest leading-relaxed ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                    {node.desc || `${node.category} NODE`}
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-10 right-10 flex flex-col gap-2 items-end">
         {['CORE', 'CODE', 'ART', 'DESIGN', 'TOOLS'].map((cat, i) => (
           <div key={cat} className={`flex items-center gap-2 text-xs font-sans tracking-wide ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>
             <span>{cat}</span>
             <Star size={8} className="text-blue-400" fill="currentColor" />
           </div>
         ))}
      </div>
    </div>
  );
};

// 4. View: Inventory (Removed AI)
const Inventory = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const { theme } = useTheme();

  return (
    <div className="w-full h-full max-w-[1600px] mx-auto flex p-8 lg:p-12 gap-8 lg:gap-12 box-border relative">
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxImage}
              alt="Full Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left: List (Wide Cards) */}
      <div className="flex-1 flex flex-col min-w-0">
         <header className={`mb-6 border-b pb-2 flex justify-between items-end ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
            <div>
              <h2 className={`text-3xl font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>PROJECTS</h2>
              <p className={`text-xs font-mono ${theme === 'dark' ? 'text-blue-200/60' : 'text-blue-600/60'}`}>SELECTED WORKS 2023-2025</p>
            </div>
         </header>

         <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {INVENTORY_ITEMS.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              let borderShadowClass = "";
              let bgClass = "";
              
              // 1. Determine Border & Shadow (Always Active based on Rarity)
              switch (item.rarity) {
                case 'MYTHIC': // Rainbow/Prismatic
                  borderShadowClass = theme === 'dark' 
                    ? 'border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                    : 'border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]';
                  break;
                case 'LEGENDARY': // Gold
                  borderShadowClass = theme === 'dark'
                    ? 'border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                    : 'border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]';
                  break;
                case 'EPIC': // Purple
                  borderShadowClass = theme === 'dark'
                    ? 'border-purple-400/50 shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                    : 'border-purple-500/50 shadow-[0_0_15px_rgba(192,132,252,0.3)]';
                  break;
                case 'RARE': // White
                  borderShadowClass = theme === 'dark'
                    ? 'border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                    : 'border-slate-400/50 shadow-[0_0_10px_rgba(148,163,184,0.3)]';
                  break;
                default:
                  borderShadowClass = theme === 'dark' ? 'border-blue-400' : 'border-blue-500';
              }

              // 2. Determine Background (Only when Selected)
              if (isSelected) {
                switch (item.rarity) {
                  case 'MYTHIC':
                    bgClass = theme === 'dark' 
                      ? 'bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40'
                      : 'bg-gradient-to-r from-indigo-100/60 via-purple-100/60 to-pink-100/60';
                    break;
                  case 'LEGENDARY':
                    bgClass = theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-100/60';
                    break;
                  case 'EPIC':
                    bgClass = theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100/60';
                    break;
                  case 'RARE':
                    bgClass = theme === 'dark' ? 'bg-white/10' : 'bg-slate-200/60';
                    break;
                  default:
                    bgClass = theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100/50';
                }
              } else {
                 // Unselected Background
                 bgClass = theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white/40 hover:bg-white/60';
              }

              return (
              <motion.div
                key={item.id}
                layoutId={item.id}
                onClick={() => setSelectedItem(item)}
                className={`w-full rounded-xl relative cursor-pointer group transition-all duration-300 border overflow-hidden flex flex-row h-44 shrink-0 ${borderShadowClass} ${bgClass}`}
                whileHover={{ x: 5 }}
              >
                {/* Thumbnail */}
                <div className={`w-40 h-full flex items-center justify-center border-r relative overflow-hidden shrink-0 ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-black/5 border-black/5'}`}>
                   <div className="absolute inset-0 opacity-20" style={{backgroundColor: item.previewColor}} />
                   <Database size={28} className={theme === 'dark' ? 'text-white/20' : 'text-black/20'} />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-center relative min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className={`text-xl font-bold tracking-wide truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.name}</div>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ml-2 ${theme === 'dark' ? 'bg-white/10 text-white/80' : 'bg-black/10 text-slate-700'}`}>{item.platform}</div>
                  </div>
                  <div className={`text-xs font-mono mb-2 ${theme === 'dark' ? 'text-blue-200/60' : 'text-blue-600/60'}`}>{item.role} // {item.type}</div>
                  <p className={`text-xs line-clamp-4 w-11/12 ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>{item.desc}</p>
                </div>
              </motion.div>
            );
            })}
         </div>
      </div>

      {/* Right: Inspection Panel (Fixed) */}
      <AnimatePresence mode='wait'>
        {selectedItem ? (
          <motion.div 
            key="inspector"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className={`w-[28rem] lg:w-[36rem] xl:w-[40rem] backdrop-blur-md border rounded-2xl p-6 lg:p-10 flex flex-col relative shadow-xl h-full overflow-y-auto custom-scrollbar ${theme === 'dark' ? 'bg-slate-900/60 border-white/10' : 'bg-white/60 border-black/10'}`}
          >
             <div className="mt-2 mb-6">
                <div className={`w-16 h-16 rounded-lg mb-4 flex items-center justify-center border shadow-lg ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`} style={{backgroundColor: `${selectedItem.previewColor}20`, borderColor: selectedItem.previewColor}}>
                   <Layers size={32} style={{color: selectedItem.previewColor}} />
                </div>
                <h3 className={`text-4xl font-bold mb-3 leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{selectedItem.name}</h3>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                   {selectedItem.tag && selectedItem.tag.map((tag, i) => (
                      <span key={i} className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>{tag}</span>
                   ))}
                </div>
             </div>

             <div className={`p-5 rounded-xl border mb-6 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white/40 border-black/5'}`}>
                 <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                   <ReactMarkdown
                     components={{
                       ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
                       ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
                       p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                       a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                       strong: ({node, ...props}) => <strong className="font-bold text-blue-300" {...props} />,
                     }}
                   >
                     {selectedItem.detailedDesc || selectedItem.desc}
                   </ReactMarkdown>
                 </div>
             </div>

             {/* Content Cards */}
             <div className="flex flex-col gap-4 mb-6">
               {selectedItem.contentCards && selectedItem.contentCards.map((card, idx) => (
                 <div key={idx} className={`relative rounded-xl overflow-hidden border group ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white/40'}`}>
                   {/* Badge */}
                   <div className={`absolute top-0 right-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-bl-lg z-10 ${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-black/10 text-slate-600'}`}>
                      {card.type}
                   </div>

                   {card.type === 'image' ? (
                     <div 
                       className="cursor-zoom-in"
                       onClick={() => setLightboxImage(getAssetUrl(card.content))}
                     >
                       <img src={getAssetUrl(card.content)} alt="Project Media" className="w-full h-auto object-cover" />
                     </div>
                   ) : card.type === 'link' ? (
                      <a 
                        href={card.content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`block p-5 flex items-center gap-4 transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                      >
                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                           <Zap size={20} />
                        </div>
                        <div>
                           <div className={`text-sm font-bold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>{card.description}</div>
                           <div className={`text-xs font-mono truncate max-w-[240px] opacity-50 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{card.content}</div>
                        </div>
                      </a>
                   ) : (
                     <div className={`p-5 pt-8 text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                       {card.content}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`w-[28rem] lg:w-[36rem] xl:w-[40rem] border rounded-2xl flex flex-col items-center justify-center gap-4 ${theme === 'dark' ? 'border-white/5 text-white/20' : 'border-black/5 text-slate-300'}`}
          >
            <Layers size={48} />
            <span className="text-sm tracking-widest">SELECT PROJECT FILE</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 7. View: Dashboard (Professional Profile)
const Dashboard = () => {
  const { theme } = useTheme();

  return (
    <div className="flex h-full items-center justify-center gap-16 lg:gap-40 px-12 lg:px-32 max-w-[1800px] mx-auto">
      {/* Profile Visual */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative group"
      >
         {/* Magic Circle */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_40s_linear_infinite]">
               <circle cx="50" cy="50" r="48" fill="none" stroke="#60A5FA" strokeWidth="0.1" strokeDasharray="2 4" />
               <circle cx="50" cy="50" r="35" fill="none" stroke="#F472B6" strokeWidth="0.1" />
            </svg>
         </div>

         {/* ID Card Style */}
         <div className={`w-80 h-[30rem] rounded-xl overflow-hidden border relative shadow-2xl flex flex-col items-center pt-4 transition-colors duration-300 ${theme === 'dark' ? 'border-white/10 bg-gradient-to-b from-slate-900 to-slate-950' : 'border-black/10 bg-gradient-to-b from-white to-slate-100'}`}>
            <div className={`w-72 h-80 rounded-lg border-2 mb-4 flex items-center justify-center relative overflow-hidden group-hover:border-blue-400/30 transition-colors ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
               {/* Personal Image Placeholder */}
               <img 
                 src={USER_PROFILE.avatar} 
                 alt="Profile" 
                 className="w-full h-full object-cover object-top translate-y-0 opacity-80 group-hover:opacity-100 transition-all"
               />
               {/* Scanline effect */}
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent animate-scan" style={{height: '50%'}} />
            </div>
            
            <div className="text-center px-4">
               <div className={`text-2xl font-bold tracking-widest mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{USER_PROFILE.name}</div>
               <div className={`flex justify-center gap-6 ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                  <Code size={20} />
                  <Terminal size={20} />
                  <Feather size={20} />
               </div>
            </div>

            <div className={`mt-auto w-full py-4 flex justify-center text-xs font-mono border-t ${theme === 'dark' ? 'bg-white/5 text-white/50 border-white/5' : 'bg-black/5 text-slate-500 border-black/5'}`}>
               <span>ID: {USER_PROFILE.id}</span>
            </div>
         </div>
      </motion.div>

      {/* Text Info */}
      <div className="max-w-xl lg:max-w-3xl xl:max-w-4xl">
         <div className="flex items-center gap-4 mb-10 opacity-50">
            <Shield size={20} className="text-blue-300" />
            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'}`} />
            <span className={`text-sm font-bold tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>PROFILE SUMMARY</span>
         </div>

         <h1 className={`text-6xl lg:text-7xl font-bold mb-8 leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Creative <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">Technologist.</span>
         </h1>
         
         <p className={`leading-relaxed font-sans text-lg mb-12 border-l-4 border-blue-500/30 pl-8 ${theme === 'dark' ? 'text-blue-100/70' : 'text-slate-600'}`}>
            {USER_PROFILE.bio}
         </p>

         {/* Attributes */}
         <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {USER_PROFILE.attributes.map((attr, i) => (
              <div key={attr.label} className="group">
                 <div className="flex justify-between items-end mb-3">
                    <span className={`text-xs font-bold tracking-wider ${theme === 'dark' ? 'text-blue-200/60' : 'text-blue-600/60'}`}>{attr.label}</span>
                 </div>
                 {/* Decorative Line */}
                 <div className={`h-px w-full relative overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}>
                    <motion.div 
                       initial={{ x: '-100%' }}
                       animate={{ x: '0%' }}
                       transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "circOut" }}
                       className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"
                       style={{ color: attr.color }}
                    />
                 </div>
                 <div className={`mt-3 text-sm font-mono tracking-wide ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                    {attr.text}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('BOOT'); 
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const NAV_ITEMS = [
    { id: 'DASHBOARD', label: 'PROFILE', icon: Heart },
    { id: 'SKILLS', label: 'SKILLS', icon: Sparkles },
    { id: 'INVENTORY', label: 'PROJECTS', icon: Feather },
  ];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div className={`relative w-screen h-screen overflow-hidden font-sans select-none cursor-none transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0B0B19] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <StarCursor />
      <StardustOverlay />
      <StarSeaBackground />

      <div className="relative z-10 w-full h-full flex flex-col">
        
        <AnimatePresence mode='wait'>
        {view === 'BOOT' ? (
          <motion.div 
            key="boot"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
             <BootScreen onComplete={() => setView('DASHBOARD')} />
          </motion.div>
        ) : (
          <>
            <header className="h-24 flex items-center justify-between px-12 lg:px-24 relative z-50 max-w-[1920px] mx-auto w-full">
               <div className="flex items-center gap-3 opacity-90">
                  <button 
                    onClick={toggleTheme}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-none ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'}`}
                  >
                     {theme === 'dark' ? (
                       <Moon size={18} className="text-yellow-100" />
                     ) : (
                       <Sun size={18} className="text-orange-500" />
                     )}
                  </button>
                  <div>
                     <div className={`text-sm font-bold tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Zhenming Duan</div>
                     <div className={`text-[10px] font-mono ${theme === 'dark' ? 'text-blue-300/60' : 'text-blue-600/60'}`}>PORTFOLIO.SYS</div>
                  </div>
               </div>

               <nav className={`flex gap-4 backdrop-blur-md px-2 py-2 rounded-full border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                 {NAV_ITEMS.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => setView(item.id)}
                     className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 relative overflow-hidden cursor-none ${
                       view === item.id 
                         ? (theme === 'dark' ? 'text-white' : 'text-slate-900') 
                         : (theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5')
                     }`}
                   >
                     {view === item.id && (
                        <motion.div 
                           layoutId="nav-bg"
                           className={`absolute inset-0 border rounded-full z-0 ${theme === 'dark' ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'}`}
                           transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                     )}
                     <div className="relative z-10 flex items-center gap-2">
                        <item.icon size={14} />
                        {item.label}
                     </div>
                   </button>
                 ))}
               </nav>

               <div className="text-right opacity-50 w-32">
                  <div className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>ONLINE</div>
               </div>
            </header>

            <main className="flex-1 relative overflow-hidden">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  {view === 'DASHBOARD' && <Dashboard />}
                  {view === 'SKILLS' && <SkillConstellation />}
                  {view === 'INVENTORY' && <Inventory />}
                </motion.div>
              </AnimatePresence>
            </main>
          </>
        )}
        </AnimatePresence>
      </div>
    </div>
    <style>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 20px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.8);
      }
    `}</style>
    </ThemeContext.Provider>
  );
}