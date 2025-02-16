import Vector from "./Vector.js";
import { WIDTH, HEIGHT, CELL_DIMENSION, FOV, map, N_ROWS, N_COLS } from "./utils.js";


document.addEventListener("DOMContentLoaded", () => {
	const canvas  	= document.getElementById("canvas") as HTMLCanvasElement
	const ctx 		= canvas.getContext('2d')
	canvas.width  	= WIDTH
	canvas.height 	= HEIGHT


	const player = new Vector(WIDTH * 0.43, HEIGHT * 0.55)


	const display = () => {
		if (ctx !== null) {
			drawMiniMap(ctx, map)	
		}
	}


	display()
})

const drawMiniMap = (ctx: CanvasRenderingContext2D, map: number[][]) => {
	ctx.scale(0.3, 0.3)
	renderGrid();
	renderMap()
	ctx.setTransform(1, 0, 0, 1, 0, 0);


	function renderMap() {
		for (let i = 0; i < N_ROWS; i++) {
			for (let j = 0; j < N_COLS; j++) {
				const x = (j * CELL_DIMENSION) + 2
				const y = (i * CELL_DIMENSION) + 2
				if (map[i][j] === 1) {
					ctx.fillRect(x, y, CELL_DIMENSION - 4, CELL_DIMENSION - 4)
				}
			}
		}
	}

	function renderGrid() {
		ctx.save()
		ctx.lineWidth = 1
		ctx.beginPath()
		for (let i = 0; i < N_ROWS; i++) {
			const x = i * CELL_DIMENSION
			const y = i * CELL_DIMENSION
			ctx.moveTo(0, y)
			ctx.lineTo(WIDTH, y)
			ctx.moveTo(x, 0)
			ctx.lineTo(x, HEIGHT)
		}
		ctx.closePath()
		ctx.stroke();
		ctx.restore()
	}
}