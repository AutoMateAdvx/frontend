// import * as PIXI from "pixi.js";
// import { Application } from "pixi.js";
// import React, { useEffect, useRef, useCallback, memo, useState } from "react";
// import { Live2DModel } from "pixi-live2d-display/cubism4";


// if (typeof window !== "undefined") (window as any).PIXI = PIXI;

// const SENSITIVITY = 0.95;
// const SMOOTHNESS = 1;
// const RECENTER_DELAY = 1000;

// const preloadModel = () =>
//   Live2DModel.from("http://localhost:8888/Haru/Haru.model3.json");

// const Model: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const modelRef = useRef<any>(null);
//   const appRef = useRef<Application | null>(null);
//   const mouseMoveRef = useRef({
//     last: 0,
//     target: { x: 0, y: 0 },
//     current: { x: 0, y: 0 },
//   });
//   const [isOpen,setIsOpen] = useState(true)
//   const mouthFn = () => {
//     if (!preloadModel) return;
//      // 生成 0~1 的随机数
//     console.log("随机数0~1控制嘴巴Y轴高度-->", n);
//     // 设置嘴巴张开参数
//     // preloadModel.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", n);
//   };
//   const updateModelSize = useCallback(() => {
//     const model = modelRef.current;
//     const app = appRef.current;
//     if (model && app) {
//       const scale = Math.min(
//         app.screen.width / model.width,
//         app.screen.height / model.height
//       );
//       model.scale.set(scale);
//       model.position.set(app.screen.width / 2, app.screen.height * 0.85);
//     }
//   }, []);
//   const animateModel = useCallback((deltaTime: number) => {
//     const model = modelRef.current;
//     if (model) {
//       const now = Date.now();
//       const factor = Math.max(
//         0,
//         Math.min((now - mouseMoveRef.current.last - RECENTER_DELAY) / 1000, 1)
//       );
//       const easeFactor = Math.sin((Math.PI * factor) / 2);
//       mouseMoveRef.current.current.x +=
//         (mouseMoveRef.current.target.x * (1 - easeFactor) -
//           mouseMoveRef.current.current.x) *
//         SMOOTHNESS *
//         deltaTime;
//       mouseMoveRef.current.current.y +=
//         (mouseMoveRef.current.target.y * (1 - easeFactor) -
//           mouseMoveRef.current.current.y) *
//         SMOOTHNESS *
//         deltaTime;
//       model.internalModel.focusController?.focus(
//         mouseMoveRef.current.current.x,
//         mouseMoveRef.current.current.y
//       );
//       // console.log("loop");
//       let n = Math.random();
//       model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", n);
//     }
//   }, []);

//   const renderLoop = useCallback(
//     (deltaTime: number) => {
//       animateModel(deltaTime);
//     },
//     [animateModel]
//   );

//   useEffect(() => {
//     (async () => {
//       const app = new Application({
//         view: canvasRef.current!,
//         backgroundAlpha: 0,
//         // resizeTo: window,
//         resolution: window.devicePixelRatio || 1,
//         autoDensity: true,
//         width: 250,
//       });
//       appRef.current = app;

//       try {
//         modelRef.current = await preloadModel();
//         console.log(
//           "Available motion groups:",
//           Object.keys(modelRef.current.internalModel.motionManager.definitions)
//         );

//         // Specifically check TapBody motions
//         console.log(
//           "TapBody motions:",
//           modelRef.current.internalModel.motionManager.definitions.TapBody
//         );

//         console.log(
//           "TapHead motions:",
//           modelRef.current.internalModel.motionManager.definitions.TapHead
//         );

//         app.stage.addChild(modelRef.current);
//         modelRef.current.anchor.set(0.5, 0.78);
//         updateModelSize();

//         const handleMouseMove = (event: MouseEvent) => {
//           const rect = appRef.current?.view.getBoundingClientRect();
//           if (rect) {
//             const { clientX, clientY } = event;
//             mouseMoveRef.current.target = {
//               x: ((clientX - rect.left) / rect.width - 0.5) * 2 * SENSITIVITY,
//               y: -(
//                 ((clientY - rect.top) / rect.height - 0.5) *
//                 2 *
//                 SENSITIVITY
//               ),
//             };
//             mouseMoveRef.current.last = Date.now();
//           }
//         };
//         window.addEventListener("mousemove", handleMouseMove, {
//           passive: true,
//         });

//         app.ticker.add(renderLoop);

//         const handleResize = () => {
//           app.renderer.resize(window.innerWidth, window.innerHeight);
//           updateModelSize();
//         };
//         window.addEventListener('resize', handleResize);


//         modelRef.current.on("hit", (hitAreas: string[]) => {
//           console.log("Hit areas:", hitAreas); // Debug which areas were hit

//           if (hitAreas.includes("Head")) {
//             console.log("hitarea head");

//             const coreModel = modelRef.current.internalModel.coreModel;
//             // coreModel.setExpression("F03");
//             // coreModel.setParameterValueById("ParamMouthOpenY", 1); // Open mouth

//             // setTimeout(() => {
//             //   coreModel.setParameterValueById("ParamMouthOpenY", 0); // Close after 1s
//             // }, 5000);
//             console.log("end of function");
//           }

//           if (hitAreas.includes("Body")) {
//             const coreModel = modelRef.current.internalModel.coreModel;

//             // coreModel.setParameterValueById("ParamMouthOpenY", 0.5);
//             // Trigger body tap motion
//             // modelRef.current.motion("TapBody");
//             console.log("hitarea body");
//           }
//         });

//         return () => {
//           window.removeEventListener("mousemove", handleMouseMove);
//           app.ticker.remove(renderLoop);
//           app.destroy(true, {
//             children: true,
//             texture: true,
//             baseTexture: true,
//           });
//         };
//       } catch (error) {
//         console.error("Error setting up Pixi.js application:", error);
//       }
//     })();
//   }, [renderLoop, updateModelSize]);

//   // renderLoop, updateModelSize
//   // useEffect(() => {
//   //   if (lastMessage?.role === 'assistant' && modelRef.current) {
//   //     const duration = lastMessage.content.length * 55;
//   //     const startTime = performance.now();
//   //     const animate = (time: number) => {
//   //       const elapsedMS = time - startTime;
//   //       modelRef.current.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',
//   //         elapsedMS < duration ? Math.sin(elapsedMS / 100) * 0.5 + 0.5 : 0);
//   //       if (elapsedMS < duration) requestAnimationFrame(animate);
//   //     };
//   //     requestAnimationFrame(animate);
//   //   }
//   // }, [lastMessage]);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{ width: "100%", height: "100%", display: "block" }}
//     />
//   );
// };

// export default Model;
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import React, { useEffect, useRef, useCallback, memo, useState } from "react";
import { Live2DModel } from "pixi-live2d-display/cubism4";

if (typeof window !== "undefined") (window as any).PIXI = PIXI;

const SENSITIVITY = 0.95;
const SMOOTHNESS = 1;
const RECENTER_DELAY = 1000;

const preloadModel = () =>
  Live2DModel.from("http://localhost:8888/Haru/Haru.model3.json");

const Model: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<any>(null);
  const appRef = useRef<Application | null>(null);
  const mouseMoveRef = useRef({
    last: 0,
    target: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  });
  
  // 使用状态控制嘴巴
  const [mouthOpenRatio, setMouthOpenRatio] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateModelSize = useCallback(() => {
    const model = modelRef.current;
    const app = appRef.current;
    if (model && app) {
      const scale = Math.min(
        app.screen.width / model.width,
        app.screen.height / model.height
      );
      model.scale.set(scale);
      model.position.set(app.screen.width / 2, app.screen.height * 0.85);
    }
  }, []);
  
  // 更新动画函数 - 移除随机数设置
  const animateModel = useCallback((deltaTime: number) => {
    const model = modelRef.current;
    if (model) {
      const now = Date.now();
      const factor = Math.max(
        0,
        Math.min((now - mouseMoveRef.current.last - RECENTER_DELAY) / 1000, 1)
      );
      const easeFactor = Math.sin((Math.PI * factor) / 2);
      mouseMoveRef.current.current.x +=
        (mouseMoveRef.current.target.x * (1 - easeFactor) -
          mouseMoveRef.current.current.x) *
        SMOOTHNESS *
        deltaTime;
      mouseMoveRef.current.current.y +=
        (mouseMoveRef.current.target.y * (1 - easeFactor) -
          mouseMoveRef.current.current.y) *
        SMOOTHNESS *
        deltaTime;
      model.internalModel.focusController?.focus(
        mouseMoveRef.current.current.x,
        mouseMoveRef.current.current.y
      );
      
      // console.log("loop");
      // model.internalModel.coreModel.setParameterValueById(
      //   "ParamMouthOpenY", 
      //   mouthOpenRatio
      // );
      // model.update()
      // 使用状态控制嘴巴
      
    }
  }, [mouthOpenRatio]); // 添加依赖项

  const renderLoop = useCallback(
    (deltaTime: number) => {
      animateModel(deltaTime);
    },
    [animateModel]
  );

  useEffect(() => {
    (async () => {
      const app = new Application({
        view: canvasRef.current!,
        backgroundAlpha: 0,
        autoStart:true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        width: 250,
      });
      appRef.current = app;

      try {
        modelRef.current = await preloadModel();
        console.log(
          "Available motion groups:",
          Object.keys(modelRef.current.internalModel.motionManager.definitions)
        );

        app.stage.addChild(modelRef.current);
        modelRef.current.anchor.set(0.5, 0.78);
        updateModelSize();

        const handleMouseMove = (event: MouseEvent) => {
          const rect = appRef.current?.view.getBoundingClientRect();
          if (rect) {
            const { clientX, clientY } = event;
            mouseMoveRef.current.target = {
              x: ((clientX - rect.left) / rect.width - 0.5) * 2 * SENSITIVITY,
              y: -(
                ((clientY - rect.top) / rect.height - 0.5) *
                2 *
                SENSITIVITY
              ),
            };
            mouseMoveRef.current.last = Date.now();
          }
        };
        window.addEventListener("mousemove", handleMouseMove, {
          passive: true,
        });

        app.ticker.add(renderLoop);

        const handleResize = () => {
          app.renderer.resize(window.innerWidth, window.innerHeight);
          updateModelSize();
        };
        window.addEventListener('resize', handleResize);

        // 点击事件处理
        const handleHit = (hitAreas: string[]) => {
          console.log("Hit areas:", hitAreas);

          if (hitAreas.includes("Head")) {
            // 清除之前的定时器
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            
            // 设置嘴巴状态
            setMouthOpenRatio(1);
            
            // 设置5秒后关闭
            // timerRef.current = setTimeout(() => {
            //   setMouthOpenRatio(0);
            // }, 5000);
          }

          if (hitAreas.includes("Body")) {
            // 清除之前的定时器
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            
            // 点击身体时随机张开嘴巴
            setMouthOpenRatio(Math.random());
            
            // 2秒后自动关闭
            timerRef.current = setTimeout(() => {
              setMouthOpenRatio(0);
            }, 2000);
          }
        };
        
        modelRef.current.on("hit", handleHit);

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener('resize', handleResize);
          app.ticker.remove(renderLoop);
          app.destroy(true, {
            children: true,
            texture: true,
            baseTexture: true,
          });
          
          // 清除所有定时器
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        };
      } catch (error) {
        console.error("Error setting up Pixi.js application:", error);
      }
    })();
  }, [renderLoop, updateModelSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default Model;