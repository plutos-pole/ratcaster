import Vector from "./Vector.js";
import { WIDTH, HEIGHT, CELL_DIMENSION, FOV, map, N_ROWS, N_COLS } from "./utils.js";


document.addEventListener("DOMContentLoaded", () => {
	const canvas  	= document.getElementById("canvas") as HTMLCanvasElement
	const ctx 		= canvas.getContext('2d')
	canvas.width  	= WIDTH
	canvas.height 	= HEIGHT

	// Initial position
	const player 	= new Vector(WIDTH * 0.43, HEIGHT * 0.55)
	let angle 		= 0


	const display = () => {
		if (ctx !== null) {
			ctx.clearRect(0, 0, WIDTH, HEIGHT)

			drawMiniMap(ctx, map, player, angle)
			const distances = calculateDistance()	
		}
	}


	display()


	// Events
	window.addEventListener("keydown", (e) => {
		switch(e.key) {
			case "d":
				angle += 0.1
				break;
			case "a":
				angle -= 0.1
				break;
			case "w":
				player.add(new Vector(Math.cos(angle) * 3, Math.sin(angle) * 3))
				break;
			case "s":
				player.sub(new Vector(Math.cos(angle) * 3, Math.sin(angle) * 3))
				break;
		}
		display()
	})
})

const calculateDistance = () => {

}


const drawMiniMap = (ctx: CanvasRenderingContext2D, map: number[][], player: Vector, angle: number) => {
	ctx.scale(0.3, 0.3)

	renderGrid()
	renderMap()
	renderPlayer(player, angle)

	ctx.setTransform(1, 0, 0, 1, 0, 0);


	function renderPlayer(player: Vector, angle:number) {
		const dir = new Vector(Math.cos(angle), Math.sin(angle))
		dir.setMag(100)
		ctx.save()
		ctx.fillStyle = "red"
		ctx.beginPath()
		ctx.arc(player.x, player.y, 10, 0, Math.PI * 2)
		ctx.fill();
		ctx.beginPath()
		ctx.lineWidth = 5
		ctx.moveTo(player.x, player.y)
		ctx.lineTo(player.x + dir.x, player.y + dir.y)
		ctx.stroke()
		ctx.restore()
	}

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