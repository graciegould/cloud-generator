import { useState } from 'react';
import './scss/App.scss';
import Clouds from './Clouds';
import {
  calculateDewPointFromHumidity, 
  calculateRelativeHumidity, 
  calculateAirTempFromAltitude, 
  determineCloudType, 
  calculateDewPointFromAltitude, 
  calculateAltitude,
  cloudTypeConditions
} from './calculations';
const App = () => {
  const [conditions, setConditions] = useState({
    windDirection: 45, 
    windSpeed: 10, 
    airTemp: cloudTypeConditions.Cumulonimbus.max.airTemp,
    dewPoint: calculateDewPointFromHumidity(cloudTypeConditions.Cumulonimbus.max.airTemp, cloudTypeConditions.Cumulonimbus.max.relativeHumidity),
    airPressure: cloudTypeConditions.Cumulonimbus.max.airPressure,
    relativeHumidity: cloudTypeConditions.Cumulonimbus.max.relativeHumidity,
    altitude: cloudTypeConditions.Cumulonimbus.max.altitude,
    cloudType: "Cumulonimbus"
  });
  const conditionInputs = {
    relativeHumidity: {
      label: 'Relative Humidity (RH)',
      min: 0,
      max: 120,
      step: 1,
      unit: '%',
      type: 'int'
    },
    windDirection: {
      label: 'Wind Direction',
      min: 0,
      max: 360,
      step: 1,
      unit: '°',
      type: 'int'
    },
    windSpeed: {
      label: 'Wind Speed',
      min: 0,
      max: 50,
      step: 0.1,
      unit: 'm/s',
      type: 'float'
    },
    airTemp: {
      label: 'Air Temperature',
      min: -50,
      max: 50,
      step: 1,
      unit: '°C',
      type: 'int'
    },
    airPressure: {
      label: 'Air Pressure',
      min: 0, 
      max: 1050,
      step: 1,
      unit: 'hPa',
      type: 'int'
    },
    dewPoint: {
      label: 'Dew Point',
      min: -20,
      max: 50,
      step: 1,
      unit: '°C',
    },
    altitude: {
      label: 'Altitude',
      min: 0,
      max: 20000,
      step: 10,
      unit: 'm'
    }
  }
  const updateCondition = (e) => {
    const key = e.target.name;
    setConditions((prev) => {
        let _conditions = {
            ...prev,
            [key]: conditionInputs[key].type === 'int' ? 
                parseInt(e.target.value) : 
                parseFloat(e.target.value)
        };
        if (key === 'relativeHumidity') {
            _conditions.dewPoint = calculateDewPointFromHumidity(_conditions.airTemp, _conditions.relativeHumidity);
        }
        
        if (key === 'airTemp') {
            _conditions.dewPoint = calculateDewPointFromHumidity(_conditions.airTemp, _conditions.relativeHumidity);
        }

        if (key === 'dewPoint') {
            _conditions.relativeHumidity = calculateRelativeHumidity(_conditions.airTemp, _conditions.dewPoint);
        }

        if (key === 'airPressure') {
            _conditions.altitude = calculateAltitude(_conditions.airPressure);
        }

        if (key === 'altitude') {
            _conditions.airTemp = calculateAirTempFromAltitude(_conditions.altitude, 15, 0); 
            _conditions.dewPoint = calculateDewPointFromAltitude(_conditions.altitude, 10, 0);
        }

        _conditions['cloudType'] = determineCloudType(_conditions);
        return _conditions;   
    });
}

const selectCloudType = (cloudType) => {
  console.log(cloudType)
  let _conditions = {
    ...conditions,
    ...cloudTypeConditions[cloudType].max
  };
  _conditions['cloudType'] = determineCloudType(_conditions);
  setConditions(_conditions);
}

  return (
    <div className="app">
      <Clouds conditions={conditions}/>
      <div className="overlay">
        <div className="overlay-controls">
          <div className='cloud-type'>
          <h3>Cloud Type: {conditions.cloudType}</h3>
          </div>
          {Object.keys(conditionInputs).map((key) => {
            const input = conditionInputs[key];
            return (
              <div className="input-item" key={key}>
                <label htmlFor={`range${key}`}>
                  {input.label}: {conditions[key]}{input.unit}{' '}
                </label>
                <input
                  type="range"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  id={`range${key}`}
                  value={conditions[key]}
                  name={key}
                  onChange={(e) => updateCondition(e)}
                />
              </div>
            );
          })}
          <div className='cloud-type-selections'>
            {Object.keys(cloudTypeConditions).map((key) => {
              return (
                <div key={"cloudType-selection-"+key} className="cloud-type-selection">
                  <button onClick={() => selectCloudType(key)}>
                    {key}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


export default App;