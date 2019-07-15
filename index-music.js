/* global C, P */
// Globals
const AC = new AudioContext();
const CC = C.getContext("2d", { alpha: false });
const D = document;
const B = D.body;
const PAL = ["#050505", "#fbfbfb"];
const DELTA_Z = 0.5;
const VISIBLE_SLICES = 30;
const W = (C.width = 960 || window.innerWidth);
const H = (C.height = (9 / 16) * W);

// Math shorthands
const { cos, sin, PI, tan } = Math;
const FOV_SCALE = 1 / tan(0.25 * PI); // 90deg / 2

// This music has been exported by SoundBox. You can use it with
// http://sb.bitsnbites.eu/player-small.js in your own product.

// See http://sb.bitsnbites.eu/demo.html for an example of how to
// use it in a demo.

// Song data
const song = {
  songData: [
    { // Instrument 0
      i: [
      3, // OSC1_WAVEFORM
      192, // OSC1_VOL
      116, // OSC1_SEMI
      0, // OSC1_XENV
      3, // OSC2_WAVEFORM
      192, // OSC2_VOL
      128, // OSC2_SEMI
      0, // OSC2_DETUNE
      0, // OSC2_XENV
      0, // NOISE_VOL
      7, // ENV_ATTACK
      12, // ENV_SUSTAIN
      22, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      0, // LFO_AMT
      0, // LFO_FREQ
      0, // LFO_FX_FREQ
      2, // FX_FILTER
      255, // FX_FREQ
      0, // FX_RESONANCE
      0, // FX_DIST
      32, // FX_DRIVE
      61, // FX_PAN_AMT
      3, // FX_PAN_FREQ
      29, // FX_DELAY_AMT
      4 // FX_DELAY_TIME
      ],
      // Patterns
      p: [1,2,1,2,,,,,1,2,1,2],
      // Columns
      c: [
        {n: [147,150,154,147,150,154,147,150,154,147,150,154,142,145,147,154,142,145,149,142,145,149,142,145,149,142,145,149,137,140,142,149,135,,,,147,,,,135,,,,147,,,,130,,,,142,,,,130,,,,142],
         f: []},
        {n: [145,149,152,145,149,152,145,149,152,145,149,152,140,142,145,152,140,144,147,140,144,147,140,144,147,140,144,147,135,140,144,147,133,,,,145,,,,133,,,,145,,,,128,,,,140,,,,128,,,,140],
         f: []}
      ]
    },
    { // Instrument 1
      i: [
      2, // OSC1_WAVEFORM
      128, // OSC1_VOL
      116, // OSC1_SEMI
      0, // OSC1_XENV
      2, // OSC2_WAVEFORM
      127, // OSC2_VOL
      116, // OSC2_SEMI
      15, // OSC2_DETUNE
      0, // OSC2_XENV
      0, // NOISE_VOL
      83, // ENV_ATTACK
      35, // ENV_SUSTAIN
      129, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      3, // LFO_WAVEFORM
      130, // LFO_AMT
      4, // LFO_FREQ
      1, // LFO_FX_FREQ
      2, // FX_FILTER
      40, // FX_FREQ
      167, // FX_RESONANCE
      2, // FX_DIST
      32, // FX_DRIVE
      89, // FX_PAN_AMT
      5, // FX_PAN_FREQ
      91, // FX_DELAY_AMT
      7 // FX_DELAY_TIME
      ],
      // Patterns
      p: [,,1,2,1,2,1,2,,,1,2,1,2,3],
      // Columns
      c: [
        {n: [135,,,,,,,,,,,,,,,,130,,,,,,,,,,,,,,,,123,,,,,,,,,,,,,,,,,118],
         f: []},
        {n: [133,,,,,,,,,,,,,,,,128,,,,,,,,,,,,,,,,121,,,,,,,,,,,,,,,,,116],
         f: []},
        {n: [135,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,123],
         f: []}
      ]
    },
    { // Instrument 2
      i: [
      2, // OSC1_WAVEFORM
      96, // OSC1_VOL
      116, // OSC1_SEMI
      0, // OSC1_XENV
      2, // OSC2_WAVEFORM
      96, // OSC2_VOL
      116, // OSC2_SEMI
      13, // OSC2_DETUNE
      0, // OSC2_XENV
      0, // NOISE_VOL
      97, // ENV_ATTACK
      50, // ENV_SUSTAIN
      124, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      1, // LFO_WAVEFORM
      138, // LFO_AMT
      7, // LFO_FREQ
      1, // LFO_FX_FREQ
      3, // FX_FILTER
      37, // FX_FREQ
      84, // FX_RESONANCE
      2, // FX_DIST
      32, // FX_DRIVE
      135, // FX_PAN_AMT
      4, // FX_PAN_FREQ
      92, // FX_DELAY_AMT
      3 // FX_DELAY_TIME
      ],
      // Patterns
      p: [,,1,2,1,2,1,2,,,1,2,1,2,3],
      // Columns
      c: [
        {n: [154,,,,,,,,,,,,,,,,154,,,,,,,,,,,,,,,,159,,,,,,,,,,,,,,,,157,,,,,,,,,,,,,,,,162,,,,,,,,,,,,,,,,161],
         f: []},
        {n: [152,,,,,,,,,,,,,,,,152,,,,,,,,,,,,,,,,157,,,,,,,,,,,,,,,,156,,,,,,,,,,,,,,,,161,,,,,,,,,,,,,,,,159],
         f: []},
        {n: [154,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,159,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,162],
         f: []}
      ]
    },
    { // Instrument 3
      i: [
      3, // OSC1_WAVEFORM
      250, // OSC1_VOL
      140, // OSC1_SEMI
      0, // OSC1_XENV
      3, // OSC2_WAVEFORM
      55, // OSC2_VOL
      128, // OSC2_SEMI
      3, // OSC2_DETUNE
      0, // OSC2_XENV
      17, // NOISE_VOL
      3, // ENV_ATTACK
      16, // ENV_SUSTAIN
      41, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      83, // LFO_AMT
      4, // LFO_FREQ
      1, // LFO_FX_FREQ
      2, // FX_FILTER
      242, // FX_FREQ
      164, // FX_RESONANCE
      1, // FX_DIST
      69, // FX_DRIVE
      77, // FX_PAN_AMT
      6, // FX_PAN_FREQ
      25, // FX_DELAY_AMT
      6 // FX_DELAY_TIME
      ],
      // Patterns
      p: [,,,,1,2,1,2,,,1,2,1,2],
      // Columns
      c: [
        {n: [123,,,,130,,,126,,126,125,,123,,126,,118,,,,125,,,121,,121,120,,118,,121],
         f: []},
        {n: [121,,,,128,,,125,,125,123,,121,,125,,116,,,,123,,,120,,120,118,,116,,120],
         f: []}
      ]
    },
    { // Instrument 4
      i: [
      0, // OSC1_WAVEFORM
      255, // OSC1_VOL
      116, // OSC1_SEMI
      1, // OSC1_XENV
      0, // OSC2_WAVEFORM
      255, // OSC2_VOL
      116, // OSC2_SEMI
      0, // OSC2_DETUNE
      1, // OSC2_XENV
      0, // NOISE_VOL
      4, // ENV_ATTACK
      6, // ENV_SUSTAIN
      35, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      0, // LFO_AMT
      0, // LFO_FREQ
      0, // LFO_FX_FREQ
      2, // FX_FILTER
      14, // FX_FREQ
      1, // FX_RESONANCE
      1, // FX_DIST
      32, // FX_DRIVE
      0, // FX_PAN_AMT
      0, // FX_PAN_FREQ
      0, // FX_DELAY_AMT
      0 // FX_DELAY_TIME
      ],
      // Patterns
      p: [,,,,1,1,1,1,,2,1,1,1,1],
      // Columns
      c: [
        {n: [147,,,,147,,,147,,,147,,147,,,,147,,,,147,,,147,,,147,,147,,,147],
         f: []},
        {n: [,,,,,,,,,,,,,,,,,,,,,,,,147,,,,147,,147,147],
         f: []}
      ]
    },
    { // Instrument 5
      i: [
      0, // OSC1_WAVEFORM
      0, // OSC1_VOL
      128, // OSC1_SEMI
      0, // OSC1_XENV
      0, // OSC2_WAVEFORM
      0, // OSC2_VOL
      128, // OSC2_SEMI
      0, // OSC2_DETUNE
      0, // OSC2_XENV
      60, // NOISE_VOL
      4, // ENV_ATTACK
      10, // ENV_SUSTAIN
      34, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      187, // LFO_AMT
      5, // LFO_FREQ
      0, // LFO_FX_FREQ
      1, // FX_FILTER
      239, // FX_FREQ
      135, // FX_RESONANCE
      0, // FX_DIST
      32, // FX_DRIVE
      108, // FX_PAN_AMT
      5, // FX_PAN_FREQ
      16, // FX_DELAY_AMT
      4 // FX_DELAY_TIME
      ],
      // Patterns
      p: [,,,,1,1,1,1,1,1,1,1,1,1],
      // Columns
      c: [
        {n: [,147,147,,,147,147,,,147,147,,,147,147,147,,147,147,,,147,147,,,147,147,,,147,147,147],
         f: []}
      ]
    },
    { // Instrument 6
      i: [
      2, // OSC1_WAVEFORM
      128, // OSC1_VOL
      116, // OSC1_SEMI
      0, // OSC1_XENV
      2, // OSC2_WAVEFORM
      128, // OSC2_VOL
      128, // OSC2_SEMI
      15, // OSC2_DETUNE
      0, // OSC2_XENV
      0, // NOISE_VOL
      7, // ENV_ATTACK
      14, // ENV_SUSTAIN
      39, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      97, // LFO_AMT
      4, // LFO_FREQ
      1, // LFO_FX_FREQ
      3, // FX_FILTER
      49, // FX_FREQ
      154, // FX_RESONANCE
      0, // FX_DIST
      109, // FX_DRIVE
      107, // FX_PAN_AMT
      4, // FX_PAN_FREQ
      79, // FX_DELAY_AMT
      4 // FX_DELAY_TIME
      ],
      // Patterns
      p: [,,,,,,1,2,1,2,,,1,2],
      // Columns
      c: [
        {n: [147,150,154,147,150,154,147,150,154,147,150,154,142,145,147,154,142,145,149,142,145,149,142,145,149,142,145,149,137,140,142,149,135,,,,147,,,,135,,,,147,,,,130,,,,142,,,,130,,,,142],
         f: []},
        {n: [145,149,152,145,149,152,145,149,152,145,149,152,140,142,145,152,140,144,147,140,144,147,140,144,147,140,144,147,135,140,144,147,133,,,,145,,,,133,,,,145,,,,128,,,,140,,,,128,,,,140],
         f: []}
      ]
    },
  ],
  rowLen: 6014,   // In sample lengths
  patternLen: 32,  // Rows per pattern
  endPattern: 14,  // End pattern
  numChannels: 7  // Number of channels
};

const player = new CPlayer();
player.init(song);
player.generate();

function polToCar([r, th]) {
  return [r * cos(th), r * sin(th)];
}

function between(v, lower, upper = Infinity) {
  return v >= lower && v < upper;
}

// Shape-functions
function gridRowShape(w) {
  let h = -H / 2;

  let cols = Array((((2 * w) / 200) | 0) + 2)
    .fill(1)
    .map((_, i) => [[-w + i * 200, h, 0], [-w + i * 200, h + 1]]);

  return [[-w, h], [w, h], [-w, h + 1], [w, h + 1], cols];
}

function triangleShape(w) {
  let ret = [
    [-w / 2, -w / 3],
    [w / 2, -w / 3],
    [0, (2 * w) / 3],
    [-w / 2, -w / 3]
  ];
  return ret;
}

function arcShape(r) {
  let c = 10;
  let th = (1.5 * PI) / c;
  let ps = [];
  for (let i = 0; i < c; i++) {
    let a = 0.5 * (c + 1) * th + PI + i * th;
    let [x, y] = polToCar([r, a]);
    ps.push([x, y]);
  }
  ps.push(ps[0]);
  return ps;
}

function circleShape(r) {
  let c = 50;
  let th = (2 * PI) / c;
  let ps = [];
  for (let i = 0; i < c; i++) {
    let a = i * th;
    let [x, y] = polToCar([r, a]);
    ps.push([x, y]);
  }
  ps.push(ps[0]);
  return ps;
}

function mountainShape(w) {
  let maxH = H * 2;
  let step = w / 25;
  let x0 = -w / 2;
  let y0 = -H / 2;
  let points = [
    [x0, y0],
    [x0 + 4 * step, 0.5 * maxH],
    [x0 + 8 * step, maxH * 0.9],
    [x0 + 12 * step, maxH * 0.7],
    [x0 + 16 * step, maxH * 0.8],
    [x0 + 20 * step, maxH * 0.6],
    [w / 2, y0]
  ];

  return points;
}

function cityShape(w) {
  let maxH = H * 2;
  let step = w / 25;
  let x0 = -w / 2;
  let y0 = -H / 2;
  let points = [
    [x0, y0],
    [x0 + 0 * step, 0.5 * maxH],
    [x0 + 3 * step, 0.5 * maxH],
    [x0 + 3 * step, 0.0 * maxH],
    [x0 + 4 * step, 0.0 * maxH],
    [x0 + 4 * step, 0.7 * maxH],
    [x0 + 6 * step, 0.7 * maxH],
    [x0 + 6 * step, 0.0 * maxH],
    [x0 + 7 * step, 0.0 * maxH],
    [x0 + 7 * step, 0.9 * maxH],
    [x0 + 9 * step, 0.9 * maxH],
    [x0 + 9 * step, 0.0 * maxH],
    [x0 + 10 * step, 0.0 * maxH],
    [x0 + 10 * step, 0.85 * maxH],
    [x0 + 15 * step, 0.85 * maxH],
    [x0 + 15 * step, 0.0 * maxH],
    [x0 + 16 * step, 0.0 * maxH],
    [x0 + 16 * step, 0.55 * maxH],
    [x0 + 19 * step, 0.55 * maxH],
    [x0 + 19 * step, 0.0 * maxH],
    [x0 + 21 * step, 0.0 * maxH],
    [x0 + 21 * step, 0.66 * maxH],
    [x0 + 25 * step, 0.66 * maxH],
    [x0 + 25 * step, 0.0 * maxH],
    [w / 2, y0]
  ];

  return points;
}

const gridRow = gridRowShape(W * 3);
const arc = arcShape(W / 2);
const triangle = triangleShape(H);
const mountain = mountainShape(W * 6);
const circle = circleShape(W / 3);
const city = cityShape(W * 3);

// Various counters
let t0 = 0; // clock
let fC = 0; // frame counter
let rafTP = 0;
let end = false;
function loop(rafT) {
  requestAnimationFrame(loop);
  let t = (AC.currentTime * 1000) | 0;

  // 16ms = 60fps
  // 32ms = 30fps
  if (rafT && rafT - rafTP < 16) return;
  if (end) return;
  rafTP = rafT;
  CC.save();
  let ms = t - t0;
  frame(ms, fC);
  CC.restore();
  fC++;
}

function frame(ms, fC) {
  CC.fillStyle = PAL[0];
  CC.fillRect(-W / 2, -H / 2, W, H);

  // Layer stuff
  let maxN = VISIBLE_SLICES * DELTA_Z;
  let zPos = DELTA_Z * (1 / maxN) * fC;
  let zIndex = (DELTA_Z * (fC / maxN)) | 0;
  let o;

  for (let i = 1; i < maxN; i += DELTA_Z) {
    let z = i + zIndex - zPos;
    let f = between.bind(null, zIndex + i);

    let color = `hsl(${(0.1 * (fC + i)) % 360}, ${100}%, ${50}%)`;

    let text = [..."SOLSKOGEN", "'19"];
    let fStart = 31.5;
    if (f(fStart, fStart + text.length)) {
      paintLetters(text, color, fStart, zIndex + i, z);
    }

    if (f(0, 25)) {
      o = renderGridRow(gridRow, z);
      paintNeon(o, color, 10);
    }

    if (f(5, 5.5)) {
      paintText("A N C I L L A T E R A L", 100, 0, -0.5 * H, color, z, 0);
      for (let j = 0; j < 10; j++) {
        paintText(
          "A N C I L L A T E R A L",
          100,
          0,
          -0.5 * H,
          color,
          z + 0.025 * j * cos(z * 0.25),
          0
        );
      }
    }

    if (f(10, 10.5)) {
      paintText("E Q U E S T R I O N I C S", 100, 0, -0.5 * H, color, z, 0);
      for (let j = 0; j < 10; j++) {
        paintText(
          "E Q U E S T R I O N I C S",
          100,
          0,
          -0.5 * H,
          color,
          z + 0.05 * j * cos(z * 0.5),
          0
        );
      }
    }

    if (f(15, 15.5)) {
      paintText("P R E S E N T E D", 100, 0, -0.5 * H, color, z, 0);
      for (let j = 0; j < 10; j++) {
        paintText(
          "P R E S E N T E D",
          100,
          0,
          -0.5 * H,
          color,
          z + 0.05 * j * cos(z * 0.5),
          0
        );
      }
    }

    if (f(0, 11.5)) {
      o = renderFlatSlice(mountain, 14.5);
      paintNeon(o, color, 2);
      o = renderFlatSlice(arc, 14.5);
      paintNeon(o, color, 2);
    }

    if (f(25, 25.5)) {
      o = renderFlatSlice(mountain, z);
      paintNeon(o, color, 2);
      o = renderFlatSlice(arc, z);
      paintNeon(o, color, 2);
    }

    if (f(25, 25.5)) {
      paintText("at", H, 0, H / 8, color, z);
    }

    if (f(25, 50)) {
      o = renderFlatSlice(arc, z);
      if (f(30, 50)) {
        CC.translate(5 * z * cos(0.00001 * ms), 0);
      }
      paintNeon(o, color, 20 * z);
      CC.clip(o);
    }

    if (f(50, 75)) {
      o = renderFlatSlice(triangle, z);
      CC.translate(10 * z * sin(0.0005 * ms), 10 * z * cos(0.0005 * ms));

      CC.rotate(5 * sin(0.0001 * ms));

      if ((z | 0) % 2) {
        CC.scale(1, -1);
        paintNeon(o, color, 20 * z);
      } else {
        CC.scale(1, -1);
        paintNeon(o, color, 20 * z);
      }
      CC.clip(o);
    }

    if (f(75, 90)) {
      o = renderGridRow(gridRow, z);
      CC.scale(1, -1);
      paintNeon(o, color, 10);
      CC.scale(1, -1);
      paintNeon(o, color, 10);
    }

    if (f(80, 80.5)) {
      paintText("~ ~ ~ a e s t h e t i c s ~ ~ ~", 150, 0, 0, color, z);
    }

    if (f(82.5, 83)) {
      paintText("b y", 150, 0, 0, color, z);
    }

    if (f(85, 85.5)) {
      paintText("m o l l e r s e", 150, 0, 0, color, z);
    }

    if (f(85, 90)) {
      CC.translate(0, 10 * z * (-1 + sin(0.0001 * ms)));
    }

    if (f(90, 100)) {
      CC.translate(0, 10 * z * (-1 + sin(0.0001 * ms)));
      o = renderFlatSlice(circle, z);
      paintNeon(o, color, 10);
      CC.clip(o);
    }

    if (f(100, 105)) {
      o = renderGridRow(gridRow, z);
      paintNeon(o, color, 10);
    }

    if (f(105, 125)) {
      o = renderGridRow(gridRow, z);
      paintNeon(o, color, 10);
    }

    if (f(110, 114)) {
      o = renderFlatSlice(city, 14);
      paintNeon(o, color, 20/z);
    }

    if (f(125, 125.5)) {
      o = renderFlatSlice(city, z);
      paintNeon(o, color, 20);
      o = renderFlatSlice(city, z-0.1);
      paintNeon(o, color, 20);
      o = renderFlatSlice(city, z-0.2);
      paintNeon(o, color, 20);
      o = renderFlatSlice(city, z-0.3);
      paintNeon(o, color, 20);
      o = renderFlatSlice(city, z-0.4);
      paintNeon(o, color, 20);
      o = renderFlatSlice(city, z-0.5);
      paintNeon(o, color, 20);
      o = renderFlatSlice(city, z-0.6);
      paintNeon(o, color, 20);
    }


    if (f(126, 126.5)) {
      paintText("f i n .", 200, 0, -H * 2.65, color, z);
    }

    if (f(134.5)) {
      end = true;
    }
  }
}

function paintNeon(path, color, blur = 20) {
  CC.shadowBlur = blur;
  CC.strokeStyle = color;
  CC.shadowColor = color;
  CC.globalCompositeOperation = "lighter";
  [0.75, 1].forEach(function(i, _, l) {
    CC.lineWidth = i * l.length;
    CC.stroke(path);
  });
}

function paintLetters(letters, color, frameStart, f, z) {
  let fs = H;
  let dx = 0;
  let dy = H / 8;

  let i = f - frameStart;
  if (i % 1 === 0.5 || i >= letters.length) return;
  let l = letters[i];
  paintText(l, l.length > 1 ? fs / (l.length - 1) : fs, dx, dy, color, z);
}

function paintText(text, fontsize, dx, dy, color, z, blur = 5) {
  CC.textBaseline = "middle";
  CC.textAlign = "center";
  CC.fillStyle = "white";
  CC.font = `1000 ${fontsize}px monospace`;
  CC.shadowBlur = blur;
  CC.shadowColor = color;
  CC.fillStyle = color;

  CC.save();
  CC.scale(FOV_SCALE / z, -FOV_SCALE / z);
  CC.fillText(text, dx, dy);
  CC.restore();
}

function renderGridRow([p1, p2, p3, p4, ps], z) {
  let s1 = FOV_SCALE / z;
  let s2 = FOV_SCALE / (z + DELTA_Z);
  return new Path2D(`M${p1[0] * s1} ${p1[1] * s1} L${p2[0] * s1} ${p2[1] * s1} ${ps
      .map(
        ([p1, p2]) =>
          `M${p1[0] * s1} ${p1[1] * s1} L${p2[0] * s2} ${p2[1] * s2}`
      )
      .join(" ")} M${p3[0] * s2} ${p3[1] * s2} L${p4[0] * s2} ${p4[1] * s2}`);
}

function renderFlatSlice(ps, z) {
  let s = FOV_SCALE / z;
  let [[sx, sy], ...res] = ps;
  return new Path2D(`
    M${sx * s} ${sy * s}
    ${res.map(([x, y]) => `L ${x * s} ${y * s}`).join(" ")}
  `);
}

// Various styles
B.style = `padding:0;margin:0;background:${PAL[0]};overflow:hidden;`;
C.style = `width:100vw;height:${(10 / 16) * 100}vw;`;
P.style = "position:absolute;top:25vh;left:40vw;height:10vh;width:20vw;";

// Kick things into gear
P.addEventListener("click", function() {
  if (!D.fullscreenElement) {
    B.requestFullscreen();
  }
  P.innerText = 'Generating...'
  let interval = setInterval(function() {
    if(player.generate() < 1) return;
    clearInterval(interval);
    AC.resume().then(() => {
      t0 = (AC.currentTime * 1000) | 0;
      B.removeChild(P);
      CC.translate(W / 2, H / 2); // put 0,0 in the center
      CC.scale(1, -1); // turn y-axis right way up
      var wave = player.createWave();
      var audio = document.createElement("audio");
      audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
      audio.play();
      loop(); // start things
    });
  })
});

/* -*- mode: javascript; tab-width: 4; indent-tabs-mode: nil; -*-
*
* Copyright (c) 2011-2013 Marcus Geelnard
*
* This software is provided 'as-is', without any express or implied
* warranty. In no event will the authors be held liable for any damages
* arising from the use of this software.
*
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
*
* 1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
*
* 2. Altered source versions must be plainly marked as such, and must not be
*    misrepresented as being the original software.
*
* 3. This notice may not be removed or altered from any source
*    distribution.
*
*/

function CPlayer() {

    //--------------------------------------------------------------------------
    // Private methods
    //--------------------------------------------------------------------------

    // Oscillators
    var osc_sin = function (value) {
        return Math.sin(value * 6.283184);
    };

    var osc_saw = function (value) {
        return 2 * (value % 1) - 1;
    };

    var osc_square = function (value) {
        return (value % 1) < 0.5 ? 1 : -1;
    };

    var osc_tri = function (value) {
        var v2 = (value % 1) * 4;
        if(v2 < 2) return v2 - 1;
        return 3 - v2;
    };

    var getnotefreq = function (n) {
        // 174.61.. / 44100 = 0.003959503758 (F3)
        return 0.003959503758 * Math.pow(2, (n - 128) / 12);
    };

    var createNote = function (instr, n, rowLen) {
        var osc1 = mOscillators[instr.i[0]],
            o1vol = instr.i[1],
            o1xenv = instr.i[3],
            osc2 = mOscillators[instr.i[4]],
            o2vol = instr.i[5],
            o2xenv = instr.i[8],
            noiseVol = instr.i[9],
            attack = instr.i[10] * instr.i[10] * 4,
            sustain = instr.i[11] * instr.i[11] * 4,
            release = instr.i[12] * instr.i[12] * 4,
            releaseInv = 1 / release,
            arp = instr.i[13],
            arpInterval = rowLen * Math.pow(2, 2 - instr.i[14]);

        var noteBuf = new Int32Array(attack + sustain + release);

        // Re-trig oscillators
        var c1 = 0, c2 = 0;

        // Local variables.
        var j, j2, e, t, rsample, o1t, o2t;

        // Generate one note (attack + sustain + release)
        for (j = 0, j2 = 0; j < attack + sustain + release; j++, j2++) {
            if (j2 >= 0) {
                // Switch arpeggio note.
                arp = (arp >> 8) | ((arp & 255) << 4);
                j2 -= arpInterval;

                // Calculate note frequencies for the oscillators
                o1t = getnotefreq(n + (arp & 15) + instr.i[2] - 128);
                o2t = getnotefreq(n + (arp & 15) + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);
            }

            // Envelope
            e = 1;
            if (j < attack) {
                e = j / attack;
            } else if (j >= attack + sustain) {
                e -= (j - attack - sustain) * releaseInv;
            }

            // Oscillator 1
            t = o1t;
            if (o1xenv) {
                t *= e * e;
            }
            c1 += t;
            rsample = osc1(c1) * o1vol;

            // Oscillator 2
            t = o2t;
            if (o2xenv) {
                t *= e * e;
            }
            c2 += t;
            rsample += osc2(c2) * o2vol;

            // Noise oscillator
            if (noiseVol) {
                rsample += (2 * Math.random() - 1) * noiseVol;
            }

            // Add to (mono) channel buffer
            noteBuf[j] = (80 * rsample * e) | 0;
        }

        return noteBuf;
    };


    //--------------------------------------------------------------------------
    // Private members
    //--------------------------------------------------------------------------

    // Array of oscillator functions
    var mOscillators = [
        osc_sin,
        osc_square,
        osc_saw,
        osc_tri
    ];

    // Private variables set up by init()
    var mSong, mLastRow, mCurrentCol, mNumWords, mMixBuf;


    //--------------------------------------------------------------------------
    // Initialization
    //--------------------------------------------------------------------------

    this.init = function (song) {
        // Define the song
        mSong = song;

        // Init iteration state variables
        mLastRow = song.endPattern;
        mCurrentCol = 0;

        // Prepare song info
        mNumWords =  song.rowLen * song.patternLen * (mLastRow + 1) * 2;

        // Create work buffer (initially cleared)
        mMixBuf = new Int32Array(mNumWords);
    };


    //--------------------------------------------------------------------------
    // Public methods
    //--------------------------------------------------------------------------

    // Generate audio data for a single track
    this.generate = function () {
        // Local variables
        var i, j, b, p, row, col, n, cp,
            k, t, lfor, e, x, rsample, rowStartSample, f, da;

        // Put performance critical items in local variables
        var chnBuf = new Int32Array(mNumWords),
            instr = mSong.songData[mCurrentCol],
            rowLen = mSong.rowLen,
            patternLen = mSong.patternLen;

        // Clear effect state
        var low = 0, band = 0, high;
        var lsample, filterActive = false;

        // Clear note cache.
        var noteCache = [];

         // Patterns
         for (p = 0; p <= mLastRow; ++p) {
            cp = instr.p[p];

            // Pattern rows
            for (row = 0; row < patternLen; ++row) {
                // Execute effect command.
                var cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
                if (cmdNo) {
                    instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;

                    // Clear the note cache since the instrument has changed.
                    if (cmdNo < 16) {
                        noteCache = [];
                    }
                }

                // Put performance critical instrument properties in local variables
                var oscLFO = mOscillators[instr.i[15]],
                    lfoAmt = instr.i[16] / 512,
                    lfoFreq = Math.pow(2, instr.i[17] - 9) / rowLen,
                    fxLFO = instr.i[18],
                    fxFilter = instr.i[19],
                    fxFreq = instr.i[20] * 43.23529 * 3.141592 / 44100,
                    q = 1 - instr.i[21] / 255,
                    dist = instr.i[22] * 1e-5,
                    drive = instr.i[23] / 32,
                    panAmt = instr.i[24] / 512,
                    panFreq = 6.283184 * Math.pow(2, instr.i[25] - 9) / rowLen,
                    dlyAmt = instr.i[26] / 255,
                    dly = instr.i[27] * rowLen & ~1;  // Must be an even number

                // Calculate start sample number for this row in the pattern
                rowStartSample = (p * patternLen + row) * rowLen;

                // Generate notes for this pattern row
                for (col = 0; col < 4; ++col) {
                    n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
                    if (n) {
                        if (!noteCache[n]) {
                            noteCache[n] = createNote(instr, n, rowLen);
                        }

                        // Copy note from the note cache
                        var noteBuf = noteCache[n];
                        for (j = 0, i = rowStartSample * 2; j < noteBuf.length; j++, i += 2) {
                          chnBuf[i] += noteBuf[j];
                        }
                    }
                }

                // Perform effects for this pattern row
                for (j = 0; j < rowLen; j++) {
                    // Dry mono-sample
                    k = (rowStartSample + j) * 2;
                    rsample = chnBuf[k];

                    // We only do effects if we have some sound input
                    if (rsample || filterActive) {
                        // State variable filter
                        f = fxFreq;
                        if (fxLFO) {
                            f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
                        }
                        f = 1.5 * Math.sin(f);
                        low += f * band;
                        high = q * (rsample - band) - low;
                        band += f * high;
                        rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;

                        // Distortion
                        if (dist) {
                            rsample *= dist;
                            rsample = rsample < 1 ? rsample > -1 ? osc_sin(rsample*.25) : -1 : 1;
                            rsample /= dist;
                        }

                        // Drive
                        rsample *= drive;

                        // Is the filter active (i.e. still audiable)?
                        filterActive = rsample * rsample > 1e-5;

                        // Panning
                        t = Math.sin(panFreq * k) * panAmt + 0.5;
                        lsample = rsample * (1 - t);
                        rsample *= t;
                    } else {
                        lsample = 0;
                    }

                    // Delay is always done, since it does not need sound input
                    if (k >= dly) {
                        // Left channel = left + right[-p] * t
                        lsample += chnBuf[k-dly+1] * dlyAmt;

                        // Right channel = right + left[-p] * t
                        rsample += chnBuf[k-dly] * dlyAmt;
                    }

                    // Store in stereo channel buffer (needed for the delay effect)
                    chnBuf[k] = lsample | 0;
                    chnBuf[k+1] = rsample | 0;

                    // ...and add to stereo mix buffer
                    mMixBuf[k] += lsample | 0;
                    mMixBuf[k+1] += rsample | 0;
                }
            }
        }

        // Next iteration. Return progress (1.0 == done!).
        mCurrentCol++;
        return mCurrentCol / mSong.numChannels;
    };

    // Create a WAVE formatted Uint8Array from the generated audio data
    this.createWave = function() {
        // Create WAVE header
        var headerLen = 44;
        var l1 = headerLen + mNumWords * 2 - 8;
        var l2 = l1 - 36;
        var wave = new Uint8Array(headerLen + mNumWords * 2);
        wave.set(
            [82,73,70,70,
             l1 & 255,(l1 >> 8) & 255,(l1 >> 16) & 255,(l1 >> 24) & 255,
             87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,
             68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,
             l2 & 255,(l2 >> 8) & 255,(l2 >> 16) & 255,(l2 >> 24) & 255]
        );

        // Append actual wave data
        for (var i = 0, idx = headerLen; i < mNumWords; ++i) {
            // Note: We clamp here
            var y = mMixBuf[i];
            y = y < -32767 ? -32767 : (y > 32767 ? 32767 : y);
            wave[idx++] = y & 255;
            wave[idx++] = (y >> 8) & 255;
        }

        // Return the WAVE formatted typed array
        return wave;
    };

    // Get n samples of wave data at time t [s]. Wave data in range [-2,2].
    this.getData = function(t, n) {
        var i = 2 * Math.floor(t * 44100);
        var d = new Array(n);
        for (var j = 0; j < 2*n; j += 1) {
            var k = i + j;
            d[j] = t > 0 && k < mMixBuf.length ? mMixBuf[k] / 32768 : 0;
        }
        return d;
    };
};
