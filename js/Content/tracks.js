window.tracks = {
  // straight track used in development
  // test: {
  //   trackSize: 6656,
  //   laps: 78,
  //   curves: [

  //     // { min: 628, max: 6656, curveInclination: 1 },
  //   ],
  //   hills: [
  //     { initialSegment: 665, size: 0, altimetry: 0 },
  //   ],
  //   tunnels: [
  //     {
  //       min: 0, max: 0, name: '', height: 12500,
  //     },
  //   ],
  // },
  f1Y91: {
    brasil: {
      trackName: 'Interlagos',
      trackSize: 8632,
      laps: 71,
      colors: {
        lightRoad: '#424142',
        darkRoad: '#393839',
        lightGrass: '#008800',
        darkGrass: '#006600',
        lightKerb: '#ffffff',
        darkKerb: '#ff0000',
        lightTunnel: '#0000ff',
        darkTunnel: '#00008b',
        frontTunnel: '#606060',
        lightStripe: '#ffffff00',
        darkStripe: '#ffffff',
      },
      curves: [
        {
          min: 200, max: 400, curveInclination: -4, kerb: 1,
        },
        {
          min: 600, max: 800, curveInclination: 4, kerb: 1,
        },
        {
          min: 900, max: 1500, curveInclination: -2, kerb: 1,
        },
        {
          min: 2500, max: 2750, curveInclination: -5, kerb: 1,
        },
        {
          min: 2950, max: 3200, curveInclination: -3, kerb: 1,
        },
        {
          min: 3600, max: 3725, curveInclination: 4, kerb: 1,
        },
        {
          min: 3850, max: 3975, curveInclination: 3, kerb: 1,
        },
        {
          min: 4225, max: 4475, curveInclination: 5, kerb: 1,
        },
        {
          min: 4600, max: 5100, curveInclination: -5, kerb: 1,
        },
        {
          min: 5300, max: 5350, curveInclination: 2, kerb: 1,
        },
        {
          min: 5475, max: 5675, curveInclination: 6, kerb: 1,
        },
        {
          min: 6050, max: 6300, curveInclination: -4, kerb: 1,
        },
        {
          min: 6800, max: 7000, curveInclination: -6, kerb: 1,
        },
        {
          min: 7100, max: 7200, curveInclination: -3, kerb: 1,
        },
        {
          min: 7575, max: 7700, curveInclination: -4, kerb: 1,
        },
        {
          min: 8075, max: 8200, curveInclination: -3, kerb: 1,
        },
      ],
      hills: [
        { initialSegment: 1, size: 800, altimetry: -40 },
        { initialSegment: 900, size: 600, altimetry: 15 },
        { initialSegment: 2500, size: 750, altimetry: -35 },
        { initialSegment: 3500, size: 500, altimetry: 20 },
        { initialSegment: 4200, size: 650, altimetry: -30 },
        { initialSegment: 5000, size: 650, altimetry: 35 },
        { initialSegment: 5700, size: 600, altimetry: -25 },
        { initialSegment: 6400, size: 400, altimetry: -15 },
        { initialSegment: 7000, size: 700, altimetry: 80 },
        { initialSegment: 7700, size: 300, altimetry: 20 },
        { initialSegment: 8100, size: 500, altimetry: -10 },
        { initialSegment: 8632, size: 0, altimetry: 0 },
      ],
      tunnels: [
        {
          min: 0, max: 0, name: '', height: 1,
        },
      ],
    },
    monaco: {
      trackName: 'Monte Carlo',
      trackSize: 6656,
      laps: 78,
      colors: {
        lightRoad: '#424142',
        darkRoad: '#393839',
        lightGrass: '#008800',
        darkGrass: '#006600',
        lightKerb: '#ffffff',
        darkKerb: '#ff0000',
        lightTunnel: '#0000ff',
        darkTunnel: '#00008b',
        frontTunnel: '#606060',
        lightStripe: '#ffffff00',
        darkStripe: '#ffffff',
      },
      curves: [
        {
          min: 0, max: 160, curveInclination: 1, kerb: 0,
        },
        {
          min: 260, max: 400, curveInclination: 7, kerb: 1,
        },
        {
          min: 510, max: 570, curveInclination: -2, kerb: 1,
        },
        {
          min: 680, max: 740, curveInclination: 2, kerb: 1,
        },
        {
          min: 790, max: 850, curveInclination: -2, kerb: 1,
        },
        {
          min: 910, max: 970, curveInclination: 2, kerb: 1,
        },
        {
          min: 1050, max: 1330, curveInclination: -2, kerb: 1,
        },
        {
          min: 1420, max: 1600, curveInclination: 3, kerb: 1,
        },
        {
          min: 1850, max: 2090, curveInclination: 5, kerb: 1,
        },
        {
          min: 2130, max: 2190, curveInclination: -4, kerb: 1,
        },
        {
          min: 2270, max: 2550, curveInclination: -7, kerb: 1,
        },
        {
          min: 2690, max: 2780, curveInclination: 4, kerb: 1,
        },
        {
          min: 2990, max: 3120, curveInclination: 3, kerb: 1,
        },
        {
          min: 3310, max: 3640, curveInclination: 2, kerb: 0,
        },
        {
          min: 3770, max: 3930, curveInclination: 1, kerb: 0,
        },
        {
          min: 4020, max: 4120, curveInclination: -3, kerb: 1,
        },
        {
          min: 4170, max: 4210, curveInclination: 3, kerb: 1,
        },
        {
          min: 4230, max: 4290, curveInclination: 3, kerb: 1,
        },
        {
          min: 4310, max: 4350, curveInclination: -3, kerb: 1,
        },
        {
          min: 4710, max: 4790, curveInclination: -3, kerb: 1,
        },
        {
          min: 4920, max: 4970, curveInclination: -3, kerb: 1,
        },
        {
          min: 4980, max: 5020, curveInclination: 3, kerb: 1,
        },
        {
          min: 5080, max: 5150, curveInclination: 3, kerb: 1,
        },
        {
          min: 5200, max: 5260, curveInclination: -3, kerb: 1,
        },
        {
          min: 5320, max: 5590, curveInclination: -1, kerb: 0,
        },
        {
          min: 5670, max: 5850, curveInclination: 6, kerb: 1,
        },
        {
          min: 6060, max: 6150, curveInclination: 5, kerb: 1,
        },
        {
          min: 6150, max: 6240, curveInclination: -3, kerb: 1,
        },
        {
          min: 6280, max: 6656, curveInclination: 1, kerb: 0,
        },
      ],
      hills: [
        { initialSegment: 140, size: 175, altimetry: 20 },
        { initialSegment: 400, size: 600, altimetry: 50 },
        { initialSegment: 1020, size: 370, altimetry: -50 },
        { initialSegment: 1560, size: 1000, altimetry: -35 },
        { initialSegment: 2600, size: 500, altimetry: -45 },
        { initialSegment: 3870, size: 250, altimetry: -30 },
        { initialSegment: 4160, size: 1500, altimetry: 25 },
        { initialSegment: 5670, size: 340, altimetry: 50 },
        { initialSegment: 6050, size: 150, altimetry: -30 },
        { initialSegment: 6656, size: 0, altimetry: 0 },
      ],
      tunnels: [
        {
          min: 0, max: 0, name: '', height: 1,
          // disabling tunnel because of CPU utilization
          // min: 3250, max: 3900, name: '', height: 12500,
        },
      ],
    },
    canada: {
      trackName: 'Montreal',
      trackSize: 8736,
      laps: 69,
      colors: {
        lightRoad: '#424142',
        darkRoad: '#393839',
        lightGrass: '#008800',
        darkGrass: '#006600',
        lightKerb: '#ffffff',
        darkKerb: '#ff0000',
        lightTunnel: '#0000ff',
        darkTunnel: '#00008b',
        frontTunnel: '#606060',
        lightStripe: '#ffffff00',
        darkStripe: '#ffffff',
      },
      curves: [
        {
          min: 50, max: 174, curveInclination: 1, kerb: 0,
        },
        {
          min: 373, max: 510, curveInclination: -4, kerb: 1,
        },
        {
          min: 560, max: 995, curveInclination: 4, kerb: 1,
        },
        {
          min: 1244, max: 1368, curveInclination: 1, kerb: 0,
        },
        {
          min: 1629, max: 1716, curveInclination: 4, kerb: 1,
        },
        {
          min: 1816, max: 1927, curveInclination: -4, kerb: 1,
        },
        {
          min: 2114, max: 2164, curveInclination: -2, kerb: 1,
        },
        {
          min: 2214, max: 2438, curveInclination: 3, kerb: 0,
        },
        {
          min: 2686, max: 2886, curveInclination: -4, kerb: 1,
        },
        {
          min: 2961, max: 3110, curveInclination: 3, kerb: 1,
        },
        {
          min: 3110, max: 3310, curveInclination: 3, kerb: 0,
        },
        {
          min: 3545, max: 3968, curveInclination: 0.5, kerb: 0,
        },
        {
          min: 4180, max: 4328, curveInclination: 5, kerb: 1,
        },
        {
          min: 4428, max: 4577, curveInclination: -5, kerb: 1,
        },
        {
          min: 4975, max: 5286, curveInclination: -1, kerb: 0,
        },
        {
          min: 5597, max: 6007, curveInclination: 5, kerb: 1,
        },
        {
          min: 6119, max: 6306, curveInclination: -2, kerb: 1,
        },
        {
          min: 6654, max: 6765, curveInclination: 2, kerb: 1,
        },
        {
          min: 6827, max: 6926, curveInclination: -2, kerb: 1,
        },
        {
          min: 6950, max: 7075, curveInclination: 2, kerb: 1,
        },
        {
          min: 7761, max: 7923, curveInclination: 6, kerb: 1,
        },
        {
          min: 7947, max: 8109, curveInclination: -6, kerb: 1,
        },
      ],
      hills: [
        { initialSegment: 1, size: 500, altimetry: -10 },
        { initialSegment: 750, size: 500, altimetry: 15 },
        { initialSegment: 1575, size: 300, altimetry: -20 },
        { initialSegment: 2050, size: 375, altimetry: 15 },
        { initialSegment: 2600, size: 500, altimetry: 25 },
        { initialSegment: 3350, size: 800, altimetry: -10 },
        { initialSegment: 4600, size: 600, altimetry: -25 },
        { initialSegment: 6275, size: 250, altimetry: 30 },
        { initialSegment: 6600, size: 175, altimetry: -15 },
        { initialSegment: 6800, size: 100, altimetry: 15 },
        { initialSegment: 6925, size: 150, altimetry: -15 },
        { initialSegment: 7200, size: 425, altimetry: 10 },
        { initialSegment: 8632, size: 0, altimetry: 0 },
      ],
      tunnels: [
        {
          min: 0, max: 0, name: '', height: 1,
        },
      ],
    },
  },
};
