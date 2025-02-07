import { useState, useEffect, useRef } from 'react';
import './scss/App.scss';
import Clouds from './Clouds';

function App() {
  const [pixelSize, setPixelSize] = useState(8);
  const [noiseScale, setNoiseScale] = useState(0.05);
  const [xSpeed, setXSpeed] = useState(0.00);
  const [ySpeed, setYSpeed] = useState(0.00);
  const [variationSpeed, setVariationSpeed] = useState(30);
  const [thickness, setThickness] = useState(100);
  const [relativeHumidity, setRelativeHumidity] = useState(40);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const [windDirection, setWindDirection] = useState(0);
  const [windSpeed, setWindSpeed] = useState(10);

  return (
    <div className="app">
      <Clouds
        pixelSize={pixelSize}
        xSpeed={xSpeed}
        ySpeed={ySpeed}
        noiseScale={noiseScale}
        variationSpeed={variationSpeed}
        thickness={thickness}
        relativeHumidity={relativeHumidity}
        min={min}
        max={max}
        windDirection={windDirection}
        windSpeed={windSpeed}
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
              min={0.01}
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
              variationSpeed: {variationSpeed}{' '}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
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
            <label htmlFor="range8">
              Relative Humidity: {relativeHumidity}%{' '}
            </label>
            <input
              type="range"
              min={0}
              max={120}
              step={1}
              id="range8"
              value={relativeHumidity}
              onChange={(e) => setRelativeHumidity(parseInt(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range9">
              Min: {min.toFixed(2)}{' '}
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              id="range9"
              value={min}
              onChange={(e) => setMin(parseFloat(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range10">
              Max: {max.toFixed(2)}{' '}
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              id="range10"
              value={max}
              onChange={(e) => setMax(parseFloat(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range11">
              Wind Direction: {windDirection}°{' '}
            </label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              id="range11"
              value={windDirection}
              onChange={(e) => setWindDirection(parseInt(e.target.value))}
            />
          </div>
          <div className="input-item">
            <label htmlFor="range12">
              Wind Speed: {windSpeed.toFixed(2)}{' '}
            </label>
            <input
              type="range"
              min={0}
              max={50}
              step={0.1}
              id="range12"
              value={windSpeed}
              onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
