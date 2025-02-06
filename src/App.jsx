import { useState, useEffect, useRef } from 'react';
import './scss/App.scss';
import Clouds from './Clouds';

function App() {
  const [pixelSize, setPixelSize] = useState(8);
  const [noiseScale, setNoiseScale] = useState(0.05);
  const [xSpeed, setXSpeed] = useState(0.00);
  const [ySpeed, setYSpeed] = useState(0.00);
  const [variationSpeed, setVariationSpeed] = useState(0.00);
  const [thickness, setThickness] = useState(50);
  const [cloudCoverage, setCloudCoverage] = useState(50);
  return (
    <div className="app">
      <Clouds
        pixelSize={pixelSize}
        xSpeed={xSpeed}
        ySpeed={ySpeed}
        noiseScale={noiseScale}
        variationSpeed={variationSpeed}
        thickness={thickness}
        cloudCoverage={cloudCoverage}
      />
      <div className="overlay">
        <div className="overlay-controls">
          <div className="input-item">
            <label htmlFor="range1">
              Pixel Size: {pixelSize}{' '}
            </label>
            <input
              type="number"
              min={4}
              max={50}
              step={1}
              id="range1"
              value={pixelSize}
              onChange={(e) => {
                setPixelSize(parseInt(e.target.value));
              }}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range2">
              Noise Scale: {noiseScale.toFixed(3)}{' '}
            </label>
            <input
              type="range"
              min={0.005}
              max={0.1}
              step={0.001}
              id="range2"
              value={noiseScale}
              onChange={(e) => setNoiseScale(parseFloat(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range3">
              X Speed: {xSpeed.toFixed(3)}{' '}
            </label>
            <input
              type="range"
              min={0.0001}
              max={0.1}
              step={0.0001}
              id="range3"
              value={xSpeed}
              onChange={(e) => setXSpeed(parseFloat(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range4">
              Y Speed: {ySpeed.toFixed(3)}{' '}
            </label>
            <input
              type="range"
              min={0.0001}
              max={0.1}
              step={0.0001}
              id="range4"
              value={ySpeed}
              onChange={(e) => setYSpeed(parseFloat(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range5">
              variationSpeed: {variationSpeed.toFixed(3)}{' '}
            </label>
            <input
              type="range"
              min={0.0001}
              max={0.1}
              step={0.0001}
              id="range4"
              value={variationSpeed}
              onChange={(e) => setVariationSpeed(parseFloat(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range6">
              cloudThickness: {thickness}{' '}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              id="range6"
              value={thickness}
              onChange={(e) => setThickness(parseInt(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range7">
              cloud coverage: {cloudCoverage}{' '}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              id="range7"
              value={cloudCoverage}
              onChange={(e) => setCloudCoverage(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
