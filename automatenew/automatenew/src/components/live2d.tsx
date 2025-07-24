import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

// Declare PIXI on window for the plugin
declare global {
  interface Window {
    PIXI: typeof PIXI;
  }
}

const Live2DViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const modelRef = useRef<Live2DModel | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize PIXI application
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundAlpha: 0, // Transparent background
      autoStart: true
    });
    appRef.current = app;
    window.PIXI = PIXI; // Required for pixi-live2d-display

    // Load and setup Live2D model
    const loadModel = async () => {
      try {
        const model = await Live2DModel.from('/Users/choijiwon/advx/frontend/automatenew/automatenew/public/models/hallo/hallo.json');
        modelRef.current = model;

        // Add model to stage
        app.stage.addChild(model);

        // Set initial transformations
        model.x = app.screen.width / 2;
        model.y = app.screen.height * 0.9;
        model.scale.set(0.15); // Adjusted for typical screen sizes

        // Set up interactions
        model.interactive = true;
        model.on('hit', (hitAreas: string[]) => {
          if (hitAreas.includes('body')) {
            model.motion('tap_body');
          }
        });

        // Handle window resize
        const onResize = () => {
          model.x = app.screen.width / 2;
          model.y = app.screen.height * 0.9;
        };
        window.addEventListener('resize', onResize);

        return () => {
          window.removeEventListener('resize', onResize);
        };
      } catch (error) {
        console.error('Failed to load Live2D model:', error);
      }
    };

    const cleanupResize = loadModel();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
};

export default Live2DViewer;