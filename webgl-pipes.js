/**
 * @author Chris Wolfe (https://crlfe.ca)
 * @license MIT
 */

import { webglHelper } from "./webgl-helper.js";

const VERTEX_SHADER = `
    precision mediump float;

    attribute vec2 aPosition;
    attribute vec3 aOuterArc;
    attribute vec3 aInnerArc;
    attribute vec2 aFlowVelocity;

    varying vec2 vPosition;
    varying vec3 vOuterArc;
    varying vec3 vInnerArc;

    void main(void) {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      vPosition = aPosition;
      vOuterArc = aOuterArc;
      vInnerArc = aInnerArc;
    }
  `;

const FRAGMENT_SHADER = `
    precision mediump float;

    uniform float uSeconds;

    varying vec2 vPosition;
    varying vec3 vOuterArc;
    varying vec3 vInnerArc;

    void main(void) {
      float d = min(
        vOuterArc.z - distance(vPosition, vOuterArc.xy),
        distance(vPosition, vInnerArc.xy) - vInnerArc.z
      );
      // TODO: Smoothing should adjust with resolution.
      float v = smoothstep(0.009, 0.011, d);
      float a = smoothstep(-0.002, 0.0, d);

      float hue = 8.0 * vPosition.x * vPosition.y + uSeconds / 3.0;
      vec3 rainbow = abs(mod(vec3(0.0, 4.0, 2.0) + hue * 6.0, 6.0) - 3.0) - 1.0;
      gl_FragColor = vec4(rainbow * v, a);
    }
  `;

function pt(x, y) {
  return [(15 * x - 15) / 90.0 - 0.5, (26 * y - 7) / 90.0 - 0.5];
}

const VERTICES = new Float32Array(
  [
    /////////////////////////////////////////////////////////
    // South-west hexagon

    [pt(1, 1), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(3, 1), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(2, 2), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],

    [pt(1, 1), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(2, 2), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(0, 2), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],

    /////////////////////////////////////////////////////////
    // North-west hexagon

    // T-junctions are split into two triangles.
    [pt(1, 3), pt(4, 2), 50.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(2, 2), pt(4, 2), 50.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(2.5, 2.5), pt(4, 2), 50.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(1, 3), pt(4, 2), 50.0 / 90.0, pt(3, 3), 10.0 / 90.0],
    [pt(2.5, 2.5), pt(4, 2), 50.0 / 90.0, pt(3, 3), 10.0 / 90.0],
    [pt(3, 3), pt(4, 2), 50.0 / 90.0, pt(3, 3), 10.0 / 90.0],

    [pt(1, 3), pt(4, 2), 50.0 / 90.0, pt(3, 3), 10.0 / 90.0],
    [pt(3, 3), pt(4, 2), 50.0 / 90.0, pt(3, 3), 10.0 / 90.0],
    [pt(2, 4), pt(4, 2), 50.0 / 90.0, pt(3, 3), 10.0 / 90.0],

    [pt(1, 3), pt(4, 2), 50.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(0, 2), pt(4, 2), 50.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(2, 2), pt(4, 2), 50.0 / 90.0, pt(2, 2), 10.0 / 90.0],

    /////////////////////////////////////////////////////////
    // South hexagon

    [pt(4, 0), pt(5, 1), 20.0 / 90.0, pt(5, 1), 10.0 / 90.0],
    [pt(6, 0), pt(5, 1), 20.0 / 90.0, pt(5, 1), 10.0 / 90.0],
    [pt(5, 1), pt(5, 1), 20.0 / 90.0, pt(5, 1), 10.0 / 90.0],

    [pt(4, 0), pt(5, 1), 20.0 / 90.0, pt(5, 1), 10.0 / 90.0],
    [pt(5, 1), pt(5, 1), 20.0 / 90.0, pt(5, 1), 10.0 / 90.0],
    [pt(3, 1), pt(5, 1), 20.0 / 90.0, pt(5, 1), 10.0 / 90.0],

    /////////////////////////////////////////////////////////
    // Center hexagon

    // A straight pipes is two triangles across the whole hexagon,
    // but the control points interpolate to get straight edges.
    [pt(2, 2), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(3, 1), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(5, 3), pt(5, 3), 20.0 / 90.0, pt(5, 3), 10.0 / 90.0],
    [pt(3, 1), pt(2, 2), 20.0 / 90.0, pt(2, 2), 10.0 / 90.0],
    [pt(6, 2), pt(5, 3), 20.0 / 90.0, pt(5, 3), 10.0 / 90.0],
    [pt(5, 3), pt(5, 3), 20.0 / 90.0, pt(5, 3), 10.0 / 90.0],

    [pt(4, 2), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],
    [pt(3, 3), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],
    [pt(2, 2), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],

    [pt(4, 2), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],
    [pt(2, 2), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],
    [pt(3, 1), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],

    [pt(4, 2), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],
    [pt(3, 1), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],
    [pt(5, 1), pt(1, 1), 50.0 / 90.0, pt(1, 1), 40.0 / 90.0],

    /////////////////////////////////////////////////////////
    // North hexagon

    [pt(4, 4), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(5, 3), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(6, 4), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],

    [pt(4, 4), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(2, 4), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(3, 3), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],

    [pt(4, 4), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(3, 3), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(5, 3), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],

    /////////////////////////////////////////////////////////
    // South-east hexagon

    [pt(7, 1), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(8, 2), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(6, 2), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],

    [pt(7, 1), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(6, 2), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(5, 1), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],

    [pt(7, 1), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(5, 1), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],
    [pt(6, 0), pt(4, 2), 50.0 / 90.0, pt(4, 2), 40.0 / 90.0],

    /////////////////////////////////////////////////////////
    // North-east hexagon

    [pt(7, 3), pt(4, 2), 50.0 / 90.0, pt(5, 3), 10.0 / 90.0],
    [pt(6, 4), pt(4, 2), 50.0 / 90.0, pt(5, 3), 10.0 / 90.0],
    [pt(5, 3), pt(4, 2), 50.0 / 90.0, pt(5, 3), 10.0 / 90.0],

    // T-junctions are split into two triangles.
    [pt(7, 3), pt(4, 2), 50.0 / 90.0, pt(5, 3), 10.0 / 90.0],
    [pt(5, 3), pt(4, 2), 50.0 / 90.0, pt(5, 3), 10.0 / 90.0],
    [pt(5.5, 2.5), pt(4, 2), 50.0 / 90.0, pt(5, 3), 10.0 / 90.0],
    [pt(7, 3), pt(4, 2), 50.0 / 90.0, pt(6, 2), 10.0 / 90.0],
    [pt(5.5, 2.5), pt(4, 2), 50.0 / 90.0, pt(6, 2), 10.0 / 90.0],
    [pt(6, 2), pt(4, 2), 50.0 / 90.0, pt(6, 2), 10.0 / 90.0],

    [pt(7, 3), pt(4, 2), 50.0 / 90.0, pt(6, 2), 10.0 / 90.0],
    [pt(6, 2), pt(4, 2), 50.0 / 90.0, pt(6, 2), 10.0 / 90.0],
    [pt(8, 2), pt(4, 2), 50.0 / 90.0, pt(6, 2), 10.0 / 90.0]
  ].flat(10)
);

document.querySelectorAll("[data-webgl-pipes]").forEach(target => {
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);

  webglHelper(canvas, {
    aspect: 1.0 / 1.0,
    setup({ gl, buildProgram }, state) {
      state.program = buildProgram(VERTEX_SHADER, FRAGMENT_SHADER);
      const pi = (state.programInfo = {
        uSeconds: gl.getUniformLocation(state.program, "uSeconds"),
        aPosition: gl.getAttribLocation(state.program, "aPosition"),
        aOuterArc: gl.getAttribLocation(state.program, "aOuterArc"),
        aInnerArc: gl.getAttribLocation(state.program, "aInnerArc")
      });

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      state.vertices = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, state.vertices);
      gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.DYNAMIC_DRAW);

      gl.useProgram(state.program);

      gl.bindBuffer(gl.ARRAY_BUFFER, state.vertices);
      gl.vertexAttribPointer(pi.aPosition, 2, gl.FLOAT, false, 32, 0);
      gl.vertexAttribPointer(pi.aOuterArc, 3, gl.FLOAT, false, 32, 8);
      gl.vertexAttribPointer(pi.aInnerArc, 3, gl.FLOAT, false, 32, 20);
      gl.enableVertexAttribArray(pi.aPosition);
      gl.enableVertexAttribArray(pi.aOuterArc);
      gl.enableVertexAttribArray(pi.aInnerArc);
    },
    paint({ gl }, state, elapsedSeconds) {
      gl.uniform1f(state.programInfo.uSeconds, elapsedSeconds);
      gl.drawArrays(gl.TRIANGLES, 0, VERTICES.length / 8);
    }
  });
});
