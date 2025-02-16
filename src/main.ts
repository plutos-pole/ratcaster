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
			const distances = calculateDistance(player, angle)
			drawScene(ctx, distances)	
			drawMiniMap(ctx, map, player, angle)
		}
	}


	display()


	// Events
	window.addEventListener("keydown", (e) => {
		const step = new Vector(Math.cos(angle) * 3, Math.sin(angle) * 3)
		switch(e.key) {
			case "d":
				angle += 0.1
				break;
			case "a":
				angle -= 0.1
				break;
			case "w":
				player.add(step)
				break;
			case "s":
				player.sub(step)
				break;
		}
		display()
	})
})

const drawScene = (ctx:CanvasRenderingContext2D, distances: number[]) => {
	if (typeof distances !== "undefined") {
		for (let i = 0; i < distances.length; i++) {
			const MAX_DISTANCE = 550
			const SCALING = 50
			const shadingFactor = 1 - (distances[i] / MAX_DISTANCE)
			const wallHeight = (HEIGHT / distances[i]) * SCALING
			const yStart = (HEIGHT / 2) - wallHeight / 2
			const yEnd = (HEIGHT / 2) + wallHeight / 2
			ctx.save()
			ctx.beginPath()
			ctx.strokeStyle = `rgb(${255 * shadingFactor}, ${255 * shadingFactor}, ${255 * shadingFactor}`
			ctx.moveTo(i, yStart)
			ctx.lineTo(i, yEnd)
			ctx.stroke()
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			ctx.strokeStyle = "black"
			ctx.moveTo(i, yEnd)
			ctx.lineTo(i, HEIGHT)
			ctx.stroke()
			ctx.restore()
		}
	}
}

const calculateDistance = (player: Vector, angle: number) => {

	const startAngle 		= angle - (FOV / 2)
	const endAngle	 		= angle + (FOV / 2)
	const angleIncrement	= FOV / WIDTH

	const distances: number[] = []
	for (let a = startAngle; a < endAngle; a += angleIncrement) {
		const startPosition = new Vector(player.x, player.y)
		const rayDirection	= new Vector(Math.cos(a), Math.sin(a))
		distances.push(DDA(rayDirection, startPosition, a))
	}

	return distances

	function DDA(rayDirection: Vector, startPosition: Vector, currAngle: number) {
		let iterations	 	= 0 
		let hit 			= 0
		let maxDistance		= 0

		// We can adjust iterations or even remove it
		// if our map always has walls on it's boundaries so the ray will always hit something
		while (!hit && iterations < 100) {

 
			let offX = (startPosition.x % CELL_DIMENSION) || CELL_DIMENSION
			let offY = (startPosition.y % CELL_DIMENSION) || CELL_DIMENSION
			
			if (rayDirection.x > 0 && offX !== CELL_DIMENSION) {
				offX = CELL_DIMENSION - offX
			}
	
			if (rayDirection.y > 0 && offY !== CELL_DIMENSION) {
				offY = CELL_DIMENSION - offY
			}

			// We know the distance from the cell boundary. So we need to calculate
			// the hypotenuse if we cover that distance on x-axis or on y-axis
			
			// find the lenght of the Y side when we step offX length
			const dY = Math.tan(currAngle) * offX
			// so we can calculate hypotenus
			const hX = Math.hypot(offX, dY)

			// same for X side when we step offY length
			const dX = offY / Math.tan(currAngle)
			const hY = Math.hypot(offY, dX)

			const step = new Vector(rayDirection.x, rayDirection.y)
			if (hX < hY) {
				step.mul(new Vector(hX, hX))
				maxDistance += hX
			} else {
				step.mul(new Vector(hY, hY))
				maxDistance += hY
			}
			startPosition.add(step)

			// Find the corresponding row/col to our map array
			const newPosition = new Vector(startPosition.x + rayDirection.x, startPosition.y + rayDirection.y)

			if (isAWall(newPosition)) {
				hit = 1
				return maxDistance
			}
			
			iterations++
		}
		return maxDistance
	}
}

const isAWall = (position: Vector) => {
	const col = Math.floor(position.x / CELL_DIMENSION)
	const row = Math.floor(position.y / CELL_DIMENSION)
	return map[row][col] === 1
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