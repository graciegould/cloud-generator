import { useEffect, useState, useRef } from "react";
import p5 from "p5";
import { map } from "./utils.js";
const Clouds = ({ conditions }) => {
  const sketchRef = useRef();
  const pixelSize = 8;
  const [cloudProps, setCloudProps] = useState({
    thickness: 0.9,
    noiseScale: 0.05,
    noiseRange: {
      min: 0.25,
      max: 0.65,
    },
    variationSpeed: 0.015,
    speed: {
      x: 0.0,
      y: 0.0,
    },
    shape: {
      width: 1,
      height: 1,
    },
  });
  const timeOffsetRef = useRef(0.0);
  const cloudPropsRef = useRef(cloudProps);
  const cloudTypeRanges = {
    Cirrus: {
      min: {
        thickness: 0.3,
        noiseScale: 0.35,
        noiseRange: {
          min: 0.54,
          max: 1.0,
        },
        shape: {
          width: 0.1,
          height: 0.5,
        },
        greyness: 0.2,
      },
      max: {
        thickness: 0.75,
        noiseScale: 0.3,
        noiseRange: {
          min: 0.35,
          max: 0.8,
        },
        shape: {
          width: 0.1,
          height: 0.6,
        },
        greyness: 0.4,
      },
    },
    Cirrostratus: {
      min: {
        thickness: 0.29,
        noiseScale: 0.43,
        noiseRange: {
          min: 0.22,
          max: 1.0,
        },
        shape: {
          width: 0.1,
          height: 0.54,
        },
        greyness: 0.3,
      },
      max: {
        thickness: 0.94,
        noiseScale: 0.14,
        noiseRange: {
          min: 0.3,
          max: 0.75,
        },
        shape: {
          width: 0.05,
          height: 0.41,
        },
        greyness: 0.5,
      },
    },
    Cirrocumulus: {
      min: {
        thickness: 0.4,
        noiseScale: 0.2,
        noiseRange: {
          min: 0.3,
          max: 0.75,
        },
        shape: {
          width: 0.35,
          height: 0.4,
        },
        greyness: 0.4,
      },
      max: {
        thickness: 0.75,
        noiseScale: 0.4,
        noiseRange: {
          min: 0.2,
          max: 0.8,
        },
        shape: {
          width: 0.3,
          height: 0.6,
        },
        greyness: 0.6,
      },
    },
    Altostratus: {
      min: {
        thickness: 0.9,
        noiseScale: 0.15,
        noiseRange: {
          min: 0.15,
          max: 0.85,
        },
        shape: {
          width: 0.07,
          height: 0.32,
        },
        greyness: 0.5,
      },
      max: {
        thickness: 1.0,
        noiseScale: 0.3,
        noiseRange: {
          min: 0.0,
          max: 0.65,
        },
        shape: {
          width: 0.06,
          height: 0.39,
        },
        greyness: 0.7,
      },
    },
    Altocumulus: {
      min: {
        thickness: 0.6,
        noiseScale: 0.36,
        noiseRange: {
          min: 0.19,
          max: 0.76,
        },
        shape: {
          width: 0.23,
          height: 0.73,
        },
        greyness: 0.4,
      },
      max: {
        thickness: 0.94,
        noiseScale: 0.36,
        noiseRange: {
          min: 0.0,
          max: 0.69,
        },
        shape: {
          width: 0.35,
          height: 0.81,
        },
        greyness: 0.6,
      },
    },
    Stratus: {
      min: {
        thickness: 0.94,
        noiseScale: 0.36,
        noiseRange: {
          min: 0.0,
          max: 0.69,
        },
        shape: {
          width: 0.35,
          height: 0.81,
        },
        greyness: 0.5,
      },
      max: {
        thickness: 1.0,
        noiseScale: 0.05,
        noiseRange: {
          min: 0.01,
          max: 0.5,
        },
        shape: {
          width: 0.14,
          height: 0.84,
        },
        greyness: 0.7,
      },
    },
    Stratocumulus: {
      min: {
        thickness: 0.69,
        noiseScale: 0.1,
        noiseRange: {
          min: 0.3,
          max: 0.73,
        },
        shape: {
          width: 0.3,
          height: 1.0,
        },
        greyness: 0.4,
      },
      max: {
        thickness: 0.87,
        noiseScale: 0.13,
        noiseRange: {
          min: 0.09,
          max: 0.56,
        },
        shape: {
          width: 0.37,
          height: 0.63,
        },
        greyness: 0.6,
      },
    },
    Nimbostratus: {
      min: {
        thickness: 0.69,
        noiseScale: 0.12,
        noiseRange: {
          min: 0.0,
          max: 0.48,
        },
        shape: {
          width: 0.24,
          height: 0.73,
        },
        greyness: 0.5,
      },
      max: {
        thickness: 0.69,
        noiseScale: 0.12,
        noiseRange: {
          min: 0.0,
          max: 0.48,
        },
        shape: {
          width: 0.24,
          height: 0.73,
        },
        greyness: 0.7,
      },
    },
    Cumulus: {
      min: {
        thickness: 0.91,
        noiseScale: 0.08,
        noiseRange: {
          min: 0.42,
          max: 0.73,
        },
        shape: {
          width: 0.65,
          height: 0.82,
        },
        greyness: 0.3,
      },
      max: {
        thickness: 1.0,
        noiseScale: 0.04,
        noiseRange: {
          min: 0.27,
          max: 0.55,
        },
        shape: {
          width: 0.92,
          height: 1.0,
        },
        greyness: 0.5,
      },
    },
    Cumulonimbus: {
      min: {
        thickness: 0.78,
        noiseScale: 0.18,
        noiseRange: {
          min: 0.31,
          max: 0.62,
        },
        shape: {
          width: 0.21,
          height: 0.23,
        },
        greyness: 0.4,
      },
      max: {
        thickness: 1.0,
        noiseScale: 0.18,
        noiseRange: {
          min: 0.1,
          max: 0.62,
        },
        shape: {
          width: 0.21,
          height: 0.23,
        },
        greyness: 0.6,
      },
    },
  };
  useEffect(() => {
    const sketch = (p) => {
      let cols = Math.ceil(window.screen.width / pixelSize);
      let rows = Math.ceil(window.screen.height / pixelSize);
      let noiseOffset = {
        x: cloudPropsRef.current.speed.x,
        y: cloudPropsRef.current.speed.y,
      };

      const grid = Array.from({ length: cols }, (_, col) =>
        Array.from({ length: rows }, (_, row) => {
          return {
            alpha: 0,
          };
        }),
      );

      p.setup = () => {
        p.createCanvas(window.screen.width, window.screen.height).parent(
          sketchRef.current,
        );
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
        noiseOffset.x += cloudPropsRef.current.speed.x;
        noiseOffset.y += cloudPropsRef.current.speed.y;
        timeOffsetRef.current += cloudPropsRef.current.variationSpeed;
      };

      const drawGrid = () => {
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            const alpha = grid[col][row].alpha;
            p.fill(255, 255, 255, alpha);
            p.rect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
          }
        }
      };

      const updateClouds = () => {
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            let noiseValue = p.noise(
              col *
                cloudPropsRef.current.shape.width *
                cloudPropsRef.current.noiseScale +
                noiseOffset.x,
              row *
                cloudPropsRef.current.shape.height *
                cloudPropsRef.current.noiseScale +
                noiseOffset.y,
              timeOffsetRef.current,
            );
            grid[col][row].greyness = p.map(noiseValue, 0, 1, 0, 255);
            grid[col][row].alpha = p.map(
              noiseValue,
              cloudPropsRef.current.noiseRange.min,
              cloudPropsRef.current.noiseRange.max,
              0,
              255 * cloudPropsRef.current.thickness,
              true,
            );
          }
        }
      };
    };

    let p5Instance = new p5(sketch);
    return () => {
      p5Instance?.remove();
    };
  }, []);

  const handleHumdity = (cloudType) => {
    cloudPropsRef.current.thickness = parseFloat(
      map(
        conditions.relativeHumidity,
        0,
        120,
        cloudTypeRanges[cloudType].min.thickness,
        cloudTypeRanges[cloudType].max.thickness,
      ).toFixed(3),
    );
    cloudPropsRef.current.noiseScale = parseFloat(
      map(
        conditions.relativeHumidity,
        0,
        120,
        cloudTypeRanges[cloudType].min.noiseScale,
        cloudTypeRanges[cloudType].max.noiseScale,
      ).toFixed(3),
    );
    cloudPropsRef.current.noiseRange.min = parseFloat(
      map(
        conditions.relativeHumidity,
        0,
        120,
        cloudTypeRanges[cloudType].min.noiseRange.min,
        cloudTypeRanges[cloudType].max.noiseRange.min,
      ).toFixed(3),
    );
    cloudPropsRef.current.noiseRange.max = parseFloat(
      map(
        conditions.relativeHumidity,
        0,
        120,
        cloudTypeRanges[cloudType].min.noiseRange.max,
        cloudTypeRanges[cloudType].max.noiseRange.max,
      ).toFixed(3),
    );
    cloudPropsRef.current.shape.width = parseFloat(
      map(
        conditions.windSpeed,
        0,
        50,
        cloudTypeRanges[cloudType].min.shape.width,
        cloudTypeRanges[cloudType].max.shape.width,
      ).toFixed(3),
    );
    cloudPropsRef.current.shape.height = parseFloat(
      map(
        conditions.windSpeed,
        0,
        50,
        cloudTypeRanges[cloudType].min.shape.height,
        cloudTypeRanges[cloudType].max.shape.height,
      ).toFixed(3),
    );
  };

  useEffect(() => {
    const { cloudType, windSpeed, windDirection, airTemp } = conditions;
    if (cloudType != "none") {
      handleHumdity(cloudType);
    } else {
      cloudPropsRef.current.thickness = 0;
    }
    cloudPropsRef.current.variationSpeed = parseFloat(
      (windSpeed * 0.001 * (1 + airTemp * 0.005)).toFixed(3),
    );
    cloudPropsRef.current.speed = {
      x: parseFloat(
        (
          Math.cos(windDirection * (Math.PI / 180)) *
          windSpeed *
          0.001 *
          (1 + airTemp * 0.005)
        ).toFixed(3),
      ),
      y: parseFloat(
        (
          Math.sin(windDirection * (Math.PI / 180)) *
          windSpeed *
          0.001 *
          (1 + airTemp * 0.005)
        ).toFixed(3),
      ),
    };
    timeOffsetRef.current += 0.05;
  }, [conditions]);

  return (
    <div className="clouds-container">
      <div className="debug-overlay">
        {Object.entries(cloudProps).map(([key, value]) => (
          <div key={key}>
            <label>
              {key}: {typeof value === "object" ? null : value}
              {typeof value === "object" ? (
                Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey}>
                    <label>
                      {subKey}: {subValue}
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.001}
                        value={subValue}
                        onChange={(e) => {
                          const newValue = parseFloat(
                            parseFloat(e.target.value).toFixed(3),
                          );
                          cloudPropsRef.current[key][subKey] = newValue;
                          setCloudProps((prev) => {
                            return {
                              ...prev,
                              [key]: {
                                ...prev[key],
                                [subKey]: newValue,
                              },
                            };
                          });
                        }}
                      />
                    </label>
                  </div>
                ))
              ) : (
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.001}
                  value={value}
                  onChange={(e) => {
                    const newValue = parseFloat(
                      parseFloat(e.target.value).toFixed(3),
                    );
                    cloudPropsRef.current[key] = newValue;
                    setCloudProps((prev) => {
                      return {
                        ...prev,
                        [key]: newValue,
                      };
                    });
                  }}
                />
              )}
            </label>
          </div>
        ))}
      </div>
      <div
        ref={sketchRef}
        width={window.screen.width}
        height={window.screen.height}
      />
    </div>
  );
};

export default Clouds;
