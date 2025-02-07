function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function multiPointMap(value, inputPoints, outputPoints) {
    if (inputPoints.length !== outputPoints.length) {
        throw new Error("Input and output points arrays must have the same length.");
    }

    // Ensure value is within the range
    if (value <= inputPoints[0]) return outputPoints[0];
    if (value >= inputPoints[inputPoints.length - 1]) return outputPoints[outputPoints.length - 1];

    // Find the segment where value falls
    for (let i = 0; i < inputPoints.length - 1; i++) {
        if (value >= inputPoints[i] && value <= inputPoints[i + 1]) {
            return map(value, inputPoints[i], inputPoints[i + 1], outputPoints[i], outputPoints[i + 1]);
        }
    }

    return outputPoints[outputPoints.length - 1]; // Fallback (should not occur)
}

export { map, multiPointMap };
