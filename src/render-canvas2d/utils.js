/**
 * @param {CanvasRenderingContext2D | Path2D} ctx
 * @param { ArrayLike<number> } vertices
 * @param {boolean} [close=true]
 */
export function vertices(ctx, vertices, close = true) {
  if (vertices.length < 2) return

  ctx.moveTo(vertices[0], vertices[1])

  for (let i = 2; i < vertices.length; i += 2) {
    ctx.lineTo(vertices[i], vertices[i + 1])
  }

  if (close) ctx.lineTo(vertices[0], vertices[1])
}