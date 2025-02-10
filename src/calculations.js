const calculateCloudDensity = (relativeHumidity, airTemp, airPressure) => {
    if (airPressure <= 0) return 0;
    const saturationVaporPressure = 6.112 * Math.pow(10, (7.5 * airTemp) / (237.3 + airTemp));
    const actualVaporPressure = (relativeHumidity / 100) * saturationVaporPressure;
    return Math.max(0, (actualVaporPressure / airPressure) * 100);
};

const calculateDewPointFromHumidity = (airTemp, relativeHumidity) => {
    if (relativeHumidity <= 0) return -Infinity; // Dew point is undefined at 0% RH
    const a = 17.62;
    const b = 243.12;
    const alpha = ((a * airTemp) / (b + airTemp)) + Math.log(relativeHumidity / 100);
    return Math.round((b * alpha) / (a - alpha) * 100) / 100;
};
;
const calculateRelativeHumidity = (airTemp, dewPoint) => {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * dewPoint) / (b + dewPoint)) - ((a * airTemp) / (b + airTemp));
    const RH = 100 * Math.exp(alpha);
    return Math.round(Math.min(100, Math.max(0, RH)) * 100) / 100;
};

const calculateAirTemp = (dewPoint, relativeHumidity) => {
    if (relativeHumidity <= 0) return -Infinity;
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * dewPoint) / (b + dewPoint));
    const lnRH = Math.log(Math.max(relativeHumidity, 0.1) / 100);
    const T = (b * (alpha + lnRH)) / (a - (alpha + lnRH));
    return Math.round(T * 100) / 100;
};

const calculateAltitude = (pressure, seaLevelPressure = 1013.25) => {
    if (isNaN(pressure) || pressure <= 0) {
        return 0;
    }
    return 44330 * (1 - Math.pow(pressure / seaLevelPressure, 0.1903));
};

const calculateAirTempFromAltitude = (altitude, baseAirTemp, baseAltitude) => {
    const lapseRate = 0.0065; 
    const newAirTemp = baseAirTemp - ((altitude - baseAltitude) * lapseRate);
    return Math.round(newAirTemp * 100) / 100;
};

const calculateDewPointFromAltitude = (altitude, baseDewPoint, baseAltitude) => {
    const dewPointLapseRate = 0.002; 
    const newDewPoint = baseDewPoint - ((altitude - baseAltitude) * dewPointLapseRate);
    return Math.round(newDewPoint * 100) / 100;
};

const cloudTypeConditions = {
    Cirrus: {
        min: {
            relativeHumidity: 40,
            airTemp: -50,
            airPressure: 100,
            altitude: 7000
        },
        max: {
            relativeHumidity: 70,
            airTemp: -20,
            airPressure: 300,
            altitude: 12000
        },
        description: "Thin, wispy clouds high in the atmosphere.",
    },
    Cirrostratus: {
        min: {
            relativeHumidity: 50,
            airTemp: -40,
            airPressure: 100,
            altitude: 6000
        },
        max: {
            relativeHumidity: 80,
            airTemp: -10,
            airPressure: 400,
            altitude: 10000
        },
        description: "Thin, icy cloud layer covering the sky.",
    },
    Cirrocumulus: {
        min: {
            relativeHumidity: 40,
            airTemp: -45,
            airPressure: 100,
            altitude: 6000
        },
        max: {
            relativeHumidity: 75,
            airTemp: -15,
            airPressure: 400,
            altitude: 11000
        },
        description: "Small, puffy clouds in high altitudes, often in a pattern.",
    },
    Altostratus: {
        min: {
            relativeHumidity: 60,
            airTemp: -10,
            airPressure: 600,
            altitude: 3000
        },
        max: {
            relativeHumidity: 100,
            airTemp: 15,
            airPressure: 800,
            altitude: 6000
        },
        description: "Grayish, uniform cloud layer covering the sky.",
    },
    Altocumulus: {
        min: {
            relativeHumidity: 50,
            airTemp: -5,
            airPressure: 650,
            altitude: 2500
        },
        max: {
            relativeHumidity: 100,
            airTemp: 20,
            airPressure: 850,
            altitude: 6000
        },
        description: "White or gray puffy clouds in mid-level atmosphere.",
    },
    Stratus: {
        min: {
            relativeHumidity: 80,
            airTemp: -5,
            airPressure: 900,
            altitude: 0
        },
        max: {
            relativeHumidity: 100,
            airTemp: 15,
            airPressure: 1020,
            altitude: 2000
        },
        description: "Low, gray, uniform cloud layer that covers the sky.",
    },
    Stratocumulus: {
        min: {
            relativeHumidity: 70,
            airTemp: -5,
            airPressure: 900,
            altitude: 500
        },
        max: {
            relativeHumidity: 100,
            airTemp: 20,
            airPressure: 1020,
            altitude: 2500
        },
        description: "Low, lumpy clouds with gaps of blue sky.",
    },
    Nimbostratus: {
        min: {
            relativeHumidity: 85,
            airTemp: -5,
            airPressure: 850,
            altitude: 500
        },
        max: {
            relativeHumidity: 120,
            airTemp: 18,
            airPressure: 1000,
            altitude: 4000
        },
        description: "Thick, dark clouds producing steady rain or snow.",
    },
    Cumulus: {
        min: {
            relativeHumidity: 50,
            airTemp: 10,
            airPressure: 850,
            altitude: 500
        },
        max: {
            relativeHumidity: 85,
            airTemp: 35,
            airPressure: 1000,
            altitude: 3000
        },
        description: "Puffy, white clouds with flat bases.",
    },
    Cumulonimbus: {
        min: {
            relativeHumidity: 70,
            airTemp: -20,
            airPressure: 700,
            altitude: 1000
        },
        max: {
            relativeHumidity: 120,
            airTemp: 30,
            airPressure: 950,
            altitude: 15000
        },
        description: "Large, towering clouds producing thunderstorms.",
    }
};

const determineCloudType = (conditions) => {
    const { relativeHumidity, airTemp, airPressure, altitude } = conditions;
    for (const [cloud, criteria] of Object.entries(cloudTypeConditions)) {
        if (
            relativeHumidity >= criteria.min.relativeHumidity &&
            relativeHumidity <= criteria.max.relativeHumidity &&
            airTemp >= criteria.min.airTemp &&
            airTemp <= criteria.max.airTemp &&
            airPressure >= criteria.min.airPressure &&
            airPressure <= criteria.max.airPressure &&
            altitude >= criteria.min.altitude &&
            altitude <= criteria.max.altitude
        ) {
            return cloud; 
        }
    }
    return "none"; 
}



export { calculateCloudDensity, calculateRelativeHumidity, calculateDewPointFromHumidity, calculateAirTemp, calculateAltitude, determineCloudType, calculateAirTempFromAltitude, calculateDewPointFromAltitude, cloudTypeConditions };