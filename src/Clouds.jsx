import { useEffect, useState, useRef } from 'react';
import p5 from 'p5';
import { map, multiPointMap } from './utils.js';
function Clouds({
  pixelSize,
  noiseScale,
  xSpeed,
  ySpeed,
  variationSpeed,
  thickness,
  relativeHumidity,
  windDirection,
  windSpeed
}) {
  const [p5Instance, setP5Instance] = useState(null);
  const sketchRef = useRef();
  const relativeHumidityRef = useRef(relativeHumidity);
  const thicknessRef = useRef(thickness / 100);
  const noiseScaleRef = useRef(noiseScale);
  const noiseRangeRef = useRef({
    min: 0.35,
    max: 0.65
  });
  const variationSpeedRef = useRef((variationSpeed / 1000) / 2);
  const windAngleRef = useRef(windDirection * (Math.PI / 180));
  const windSpeedRef = useRef(windSpeed);
  const xSpeedRef = useRef(xSpeed);
  const ySpeedRef = useRef(ySpeed);
  const timeOffsetRef = useRef(0);

  useEffect(() => {
    const sketch = (p) => {
      let cols = Math.ceil(window.screen.width / pixelSize);
      let rows = Math.ceil(window.screen.height / pixelSize);
      let noiseOffsetX = xSpeedRef.current;
      let noiseOffsetY = ySpeedRef.current;
      const alphaGrid = Array.from({ length: cols }, (_, col) => Array.from({ length: rows }, (_, row) => {
        return {
          alpha: 0
        }
      }),
  );
      
      p.setup = () => {
        p.createCanvas(
          window.screen.width,
          window.screen.height,
        ).parent(sketchRef.current);
        p.noStroke();
        p.frameRate(10);
        p.background(171, 205, 255);
        drawGrid();
        updateClouds();
      };

      p.draw = () => {
        p.background(171, 205, 255);
        drawGrid();
        updateClouds();
        noiseOffsetX += xSpeedRef.current;
        noiseOffsetY += ySpeedRef.current;
        timeOffsetRef.current += variationSpeedRef.current;
      };


      const drawGrid = () => {
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            const alpha = alphaGrid[col][row].alpha;
            // p.stroke(0, 0, 0, 10);
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
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            let noiseValue = p.noise(
              col * noiseScaleRef.current + noiseOffsetX,
              row * noiseScaleRef.current + noiseOffsetY,
              timeOffsetRef.current,
            );
            if (relativeHumidityRef.current < 50) {
                noiseValue = Math.pow(noiseValue, 1.2); // Sharpen for wispy cirrus
            } else if (relativeHumidityRef.current > 90) {
                noiseValue = Math.pow(noiseValue, 0.8); // Soften for thick clouds
            }
            alphaGrid[col][row].alpha = p.map(
              noiseValue,
              noiseRangeRef.current.min,
              noiseRangeRef.current.max,
              0,
              255 * thicknessRef.current,
              true
            );
          }
        }
      };
    };

    setP5Instance(new p5(sketch));
    return () => {
      p5Instance?.remove();
    };
  }, []);

  useEffect(() => {
    relativeHumidityRef.current = relativeHumidity;
    noiseRangeRef.current = {
      min: multiPointMap(
        relativeHumidityRef.current,
        [0, 30, 50, 70, 90, 100, 110, 120],  // Humidity levels
        [0.95, 0.75, 0.6, 0.45, 0.2, 0.1, 0.05, 0.0] // Lowered min to allow softer falloff
      ),
      max:  multiPointMap(
        relativeHumidityRef.current,
        [0, 30, 50, 70, 90, 100, 110, 120],  // Humidity levels
        [1.0, 0.92, 0.87, 0.65, 0.5, 0.35, 0.2, 0.1] // Slightly increased at low humidity for smoother blending
      )
    };

    thicknessRef.current = multiPointMap(
      relativeHumidityRef.current,
      [0, 30, 50, 70, 90, 100, 110, 120],  // Humidity levels
      [0.0, 0.12, 0.35, 0.65, 0.85, 0.97, 1.0, 1.0] // Slightly increased mid-high humidity blending
    );

    noiseScaleRef.current = multiPointMap(
      relativeHumidityRef.current,
      [0, 30, 50, 70, 90, 100, 110, 120],  // Humidity levels
      [0.1, 0.09, 0.07, 0.05, 0.07, 0.04, 0.03, 0.0] // Slightly increased at 30-50% for finer wispy details
    );

    timeOffsetRef.current += 0.5;

  }, [relativeHumidity])

  useEffect(() => {
    windAngleRef.current = windDirection * (Math.PI / 180);
    windSpeedRef.current = windSpeed;
    xSpeedRef.current = Math.cos(windAngleRef.current) * windSpeedRef.current * 0.01; // Scale for smooth motion
    ySpeedRef.current = Math.sin(windAngleRef.current) * windSpeedRef.current * 0.01;
    variationSpeedRef.current = (windSpeedRef.current / 1000) * (1 + windSpeedRef.current * 0.01); // Adjust variation speed based on wind speed
  }, [windDirection, windSpeed, variationSpeed])


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