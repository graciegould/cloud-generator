import { useEffect, useState, useRef } from 'react';
import p5 from 'p5';
import { use } from 'react';
function Clouds({
  pixelSize,
  noiseScale,
  xSpeed,
  ySpeed,
  variationSpeed,
  thickness,
  cloudCoverage,
}) {
  const sketchRef = useRef();
  const thicknessRef = useRef(thickness / 100);
  const cloudCoverageRef = useRef((cloudCoverage / 1000));
  const noiseScaleRef = useRef(noiseScale);

  useEffect(() => {
    const sketch = (p) => {
      let cols = Math.ceil(window.screen.width / pixelSize);
      let rows = Math.ceil(window.screen.height / pixelSize);
      let alphaGrid = [];
      let noiseOffsetX = xSpeed;
      let noiseOffsetY = ySpeed;
      let timeOffset = 0;

      p.setup = () => {
        p.createCanvas(
          window.screen.width,
          window.screen.height,
        ).parent(sketchRef.current);
        p.noStroke();
        p.frameRate(10);
        initializeAlphaGrid();
        p.background(171, 205, 255);
        drawGrid();
        updateClouds();
        // p.noLoop();
      };

      p.draw = () => {
        p.background(171, 205, 255);
        drawGrid();
        updateClouds();
        noiseOffsetX += xSpeed;
        noiseOffsetY += ySpeed;
        timeOffset += 0.01;
      };

      const initializeAlphaGrid = () => {
        alphaGrid = Array.from({ length: cols }, (_, col) =>
          Array.from({ length: rows }, (_, row) => {
            const noiseValue = p.noise(
              col * noiseScaleRef.current + noiseOffsetX,
              row * noiseScaleRef.current + noiseOffsetY,
              timeOffset,
            );
            return {
              alpha: p.map(noiseValue, 0.35, 0.65, 0, 255, true),
            }
          }),
        );
      };

      const drawGrid = () => {
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            const alpha = alphaGrid[col][row].alpha;
            p.stroke(0, 0, 0, 10);
            p.fill(255, 255, 255, alpha);
            p.rect(
              col * pixelSize, 
              row * pixelSize, 
              pixelSize, 
              pixelSize
            );
          }
        }
      };

      const updateClouds = () => {
        p.noiseDetail(6, thicknessRef.current);
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            const noiseValue = p.noise(
              col * noiseScaleRef.current + noiseOffsetX,
              row * noiseScaleRef.current + noiseOffsetY,
              timeOffset,
            );
            // 
            // low min = low density & high coverage
            let min = 0.10;
            let max = 0.75;
            alphaGrid[col][row].alpha = p.map(
              noiseValue,
              min,
              max,
              0,
              255,
              true
            );
          }
        }
      };
      return {
        cols
      }
    };

    const p5Instance = new p5(sketch);
    return () => {
      p5Instance.remove();
    };
  }, []);

  useEffect(() => {
    thicknessRef.current = thickness / 100;
    cloudCoverageRef.current = (cloudCoverage / 100) * 10;
  }, [thickness, cloudCoverage]);
  return (
    <div className='clouds-container'>
      <div
        ref={sketchRef}
        width={window.screen.width}
        height={window.screen.height}
      />
    </div>
  );
}

export default Clouds;