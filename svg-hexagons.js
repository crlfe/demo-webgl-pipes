/**
 * @author Chris Wolfe (https://crlfe.ca)
 * @license MIT
 */

// Making the hexagons 60 by 52 simplifies this code
// by keeping most values integral. The ratio is not
// quite perfect, but close enough for a quick sketch.

function pt(x, y, dx, dy) {
  return [
    22.5 * (x - 1) + (dx || 0),
    13 * (x - 1) - 26 * (y - 3) - (dy || 0)
  ].join(",");
}

const colors = [
  ["m 0,0 15,26 15,-26 z", "hsl(0,80%,80%)"],
  ["m 0,0 30,0 -15,-26 z", "hsl(60,80%,80%)"],
  ["m 0,0 15,-26 -30,0 z", "hsl(120,80%,80%)"],
  ["m 0,0 -15,-26 -15,26 z", "hsl(180,80%,80%)"],
  ["m 0,0 -30,0 15,26 z", "hsl(240,80%,80%)"],
  ["m 0,0 -15,26 30,0 z", "hsl(300,80%,80%)"]
]
  .map(
    ([d, fill]) =>
      `
        <path
          d=${JSON.stringify(d)}
          style="fill: ${fill}; stroke: #FFF; stroke-width: 0.5"
        />
      `
  )
  .join("\n");

const hexes = [
  pt(1, 1),
  pt(3, 1),
  pt(1, 3),
  pt(3, 3),
  pt(5, 3),
  pt(3, 5),
  pt(5, 5)
]
  .map(xy => `<use xlink:href="#hex" transform="translate(${xy})"/>`)
  .join("\n");

document.querySelectorAll("[data-svg-hexagons]").forEach(target => {
  target.innerHTML += `
    <svg viewBox="-45 -64 180 180">
      <defs>
        <g id="hex">
          ${colors}
          <path
            d="m -30,0 15,26 30,0 15,-26 -15,-26 -30,0 z"
            style="fill: none; stroke: #000;"
          />
        </g>
      </defs>
      ${hexes}
    </svg>
  `;
});
