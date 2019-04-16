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
  return new Path2D(`
    M${p1[0] * s1} ${p1[1] * s1}
    L${p2[0] * s1} ${p2[1] * s1}
    ${ps
      .map(
        ([p1, p2]) =>
          `M${p1[0] * s1} ${p1[1] * s1} L${p2[0] * s2} ${p2[1] * s2}`
      )
      .join(" ")}
    M${p3[0] * s2} ${p3[1] * s2}
    L${p4[0] * s2} ${p4[1] * s2}
  `);
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
  AC.resume().then(() => {
    t0 = (AC.currentTime * 1000) | 0;
    B.removeChild(P);
    CC.translate(W / 2, H / 2); // put 0,0 in the center
    CC.scale(1, -1); // turn y-axis right way up
    loop(); // start things
  });
});
