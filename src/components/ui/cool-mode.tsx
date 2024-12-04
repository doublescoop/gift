import React, { ReactNode, RefObject, useEffect, useRef } from "react";

export interface BaseParticle {
  element: HTMLElement | SVGSVGElement;
  left: number;
  size: number;
  top: number;
}

export interface BaseParticleOptions {
  particles?: Array<{
    url: string;
    size?: number;
    speedHorz?: number;
    speedUp?: number;
  }>;
  particleCount?: number;
}

export interface CoolParticle extends BaseParticle {
  direction: number;
  speedHorz: number;
  speedUp: number;
  spinSpeed: number;
  spinVal: number;
  particleConfig: {
    url: string;
    size: number;
    speedHorz: number;
    speedUp: number;
  };
}

export interface CoolParticleOptions extends BaseParticleOptions {
  speedHorz?: number;
  speedUp?: number;
}

const getContainer = () => {
  const id = "_coolMode_effect";
  let existingContainer = document.getElementById(id);

  if (existingContainer) {
    return existingContainer;
  }

  const container = document.createElement("div");
  container.setAttribute("id", id);
  container.setAttribute(
    "style",
    "overflow:hidden; position:fixed; height:100%; top:0; left:0; right:0; bottom:0; pointer-events:none; z-index:2147483647",
  );

  document.body.appendChild(container);

  return container;
};

let instanceCounter = 0;

const applyParticleEffect = (
  element: HTMLElement,
  options?: CoolParticleOptions,
): (() => void) => {
  instanceCounter++;

  const sizes = [15, 20, 25, 35, 45];
  const limit = 45;

  let particles: CoolParticle[] = [];
  let autoAddParticle = false;
  let isHolding = false;
  let mouseX = 0;
  let mouseY = 0;
  let continueTimeout: NodeJS.Timeout | null = null;

  const container = getContainer();

  function generateParticle() {
    const particleConfigs = options?.particles || [{
      url: "circle",
      size: sizes[Math.floor(Math.random() * sizes.length)],
      speedHorz: Math.random() * 10,
      speedUp: Math.random() * 25
    }];

    const particleConfig = particleConfigs[Math.floor(Math.random() * particleConfigs.length)];
    const {
      url = '',
      size = 10,
      speedHorz = 1,
      speedUp = 1,
    } = particleConfig;

    const direction = Math.random() <= 0.5 ? -1 : 1;
    const spinVal = Math.random() * 360;
    const spinSpeed = Math.random() * 35 * (Math.random() <= 0.5 ? -1 : 1);
    const top = mouseY - size / 2;
    const left = mouseX - size / 2;

    const particle = document.createElement("div");

    if (particleConfig.url === "circle") {
      const svgNS = "http://www.w3.org/2000/svg";
      const circleSVG = document.createElementNS(svgNS, "svg");
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttributeNS(null, "cx", (size / 2).toString());
      circle.setAttributeNS(null, "cy", (size / 2).toString());
      circle.setAttributeNS(null, "r", (size / 2).toString());
      circle.setAttributeNS(
        null,
        "fill",
        `hsl(${Math.random() * 360}, 70%, 50%)`,
      );

      circleSVG.appendChild(circle);
      circleSVG.setAttribute("width", size.toString());
      circleSVG.setAttribute("height", size.toString());

      particle.appendChild(circleSVG);
    } else {
      particle.innerHTML = `<img src="${particleConfig.url}" width="${size}" height="${size}" style="border-radius: 50%">`;
    }

    particle.style.position = "absolute";
    particle.style.transform = `translate3d(${left}px, ${top}px, 0px) rotate(${spinVal}deg)`;

    container.appendChild(particle);

    particles.push({
      direction,
      element: particle,
      left,
      size,
      speedHorz,
      speedUp,
      spinSpeed,
      spinVal,
      top,
      particleConfig: {
        url,
        size,
        speedHorz,
        speedUp,
      }
    });
  }

  function refreshParticles() {
    particles.forEach((p) => {
      p.left = p.left - p.speedHorz * p.direction * 0.5;
      p.top = p.top - p.speedUp * 0.5;
      p.speedUp = Math.min(p.size, p.speedUp - 0.1);
      p.spinVal = p.spinVal + p.spinSpeed * 0.5;

      if (
        p.top >= Math.max(window.innerHeight, document.body.clientHeight) + p.size ||
        !autoAddParticle
      ) {
        particles = particles.filter((o) => o !== p);
        p.element.remove();
      }

      p.element.setAttribute(
        "style",
        [
          "position:absolute",
          "will-change:transform",
          `top:${p.top}px`,
          `left:${p.left}px`,
          `transform:rotate(${p.spinVal}deg)`,
        ].join(";"),
      );
    });
  }

  let animationFrame: number | undefined;

  let lastParticleTimestamp = 0;
  const particleGenerationDelay = 50;

  function loop() {
    const currentTime = performance.now();
    if (
      autoAddParticle &&
      particles.length < limit &&
      currentTime - lastParticleTimestamp > particleGenerationDelay
    ) {
      generateParticle();
      lastParticleTimestamp = currentTime;
    }

    refreshParticles();
    animationFrame = requestAnimationFrame(loop);
  }

  loop();

  const isTouchInteraction = "ontouchstart" in window;

  const tap = isTouchInteraction ? "touchstart" : "mousedown";
  const tapEnd = isTouchInteraction ? "touchend" : "mouseup";
  const move = isTouchInteraction ? "touchmove" : "mousemove";

  const updateMousePosition = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      mouseX = e.touches?.[0].clientX;
      mouseY = e.touches?.[0].clientY;
    } else {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  };

  const tapHandler = (e: MouseEvent | TouchEvent) => {
    updateMousePosition(e);
    isHolding = true;
    autoAddParticle = true;
    // Clear any existing timeout when clicking again
    if (continueTimeout) {
      clearTimeout(continueTimeout);
      continueTimeout = null;
    }
  };

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (autoAddParticle) {
      updateMousePosition(e);
    }
  };

  const disableAutoAddParticle = () => {
    isHolding = false;
    // Only start the timeout if we're not holding the button
    if (!isHolding) {
      if (continueTimeout) {
        clearTimeout(continueTimeout);
      }
      
      continueTimeout = setTimeout(() => {
        if (!isHolding) {  // Double check we're still not holding
          autoAddParticle = false;
          // Clear particles after they stop generating
          setTimeout(() => {
            if (!isHolding) {  // Triple check we're still not holding
              particles.forEach(p => {
                p.element.remove();
              });
              particles = [];
            }
          }, 1000); // Give particles 1 more second to fade out after generation stops
        }
      }, 3000); // Continue generating for 3 seconds
    }
  };

  element.addEventListener(move, moveHandler, { passive: true });
  element.addEventListener(tap, tapHandler, { passive: true });
  document.addEventListener(tapEnd, disableAutoAddParticle, { passive: true });

  return () => {
    instanceCounter--;
    isHolding = false;
    autoAddParticle = false;
    if (continueTimeout) {
      clearTimeout(continueTimeout);
    }
    element.removeEventListener(move, moveHandler);
    element.removeEventListener(tap, tapHandler);
    document.removeEventListener(tapEnd, disableAutoAddParticle);
    
    // Clean up any remaining particles
    particles.forEach(p => {
      p.element.remove();
    });
    particles = [];

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    if (instanceCounter === 0) {
      container.remove();
    }
  };
};

interface CoolModeProps {
  children: ReactNode;
  options?: CoolParticleOptions;
}

export const CoolMode: React.FC<CoolModeProps> = ({ children, options }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      return applyParticleEffect(ref.current, options);
    }
  }, [options]);

  return React.cloneElement(children as React.ReactElement, { ref });
};
