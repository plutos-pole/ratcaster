import Vector from "./Vector.js";
import Ray from "./Ray.js"
import { WIDTH, HEIGHT, CELL_DIMENSION, FOV, map, N_ROWS, N_COLS, WallType } from "./utils.js";

const inBounds = (p: Vector) => {
	return (p.x >= 0 && p.x <= WIDTH-1 && p.y >= 0 && p.y <= HEIGHT-1)
}


const projectionPlaneDistance = ((WIDTH / 2) / Math.tan(FOV / 2))

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
			drawScene(ctx, distances, angle)	
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
				if (!isAWall(Vector.add(player, step))) {
					player.add(step)
				}
				break;
			case "s":
				if (!isAWall(Vector.sub(player, step))) {
					player.sub(step)
				}
				break;
		}
		display()
	})
})

const drawScene = (ctx:CanvasRenderingContext2D, distances: Ray[], playerAngle: number) => {
	if (typeof distances !== "undefined") {
		const MAX_DISTANCE = 550
		for (let i = 0; i < distances.length; i++) {
			const ray = distances[i]
			let scaleFactor = 1
			const distance = ray.distance * Math.cos(playerAngle - ray.angle)
			const shadingFactor = 1 - (distance / MAX_DISTANCE)
			if (ray.wallType === WallType.Tower) {
				scaleFactor = 3
			}
			const wallHeight = ((CELL_DIMENSION / distance) * projectionPlaneDistance)
			const yStart = (HEIGHT / 2) - (wallHeight * scaleFactor)  / 2
			const yEnd = (HEIGHT / 2) + wallHeight / 2
			let color
			ctx.save()
			switch(ray.wallType) {
				case WallType.Blue:
					color = `rgb(100,0,200)`
					break;
				case WallType.Red:
					color = `rgb(200,0,100)`
					break;
				case WallType.Green:
					color = `rgb(0,200,150)`
				default:
					color = `rgb(${255 * shadingFactor}, ${255 * shadingFactor}, ${255 * shadingFactor}`
			}
			ctx.strokeStyle = color
			ctx.beginPath()
			ctx.moveTo(i, yStart)
			ctx.lineTo(i, yEnd)
			ctx.stroke()
			ctx.restore()
			ctx.save()
			// FLOOR
			ctx.beginPath()
			ctx.strokeStyle = "black"
			ctx.moveTo(i, yEnd)
			ctx.lineTo(i, HEIGHT)
			ctx.stroke()
			ctx.restore()
			// CEELING
			ctx.save()
			ctx.beginPath()
			ctx.strokeStyle = "rgb(135,206,250)"
			ctx.moveTo(i, 0)
			ctx.lineTo(i, yStart)
			ctx.stroke()
			ctx.restore()
		}
	}
}

const calculateDistance = (player: Vector, angle: number) => {

	const startAngle 		= angle - (FOV / 2)
	const endAngle	 		= angle + (FOV / 2)
	const angleIncrement	= FOV / WIDTH

	const distances: Ray[] = []
	for (let a = startAngle; a < endAngle; a += angleIncrement) {
		const rayDirection	= new Vector(Math.cos(a), Math.sin(a))
		const ray = DDA(rayDirection, player, a)
		distances.push(ray)
	}


	return distances

	function DDA(rayDirection: Vector, startPosition: Vector, currAngle: number) {
		debugger
		let offX = (startPosition.x % CELL_DIMENSION) || CELL_DIMENSION
		let offY = (startPosition.y % CELL_DIMENSION) || CELL_DIMENSION
		
		if (rayDirection.x > 0 && offX !== CELL_DIMENSION) {
			offX = CELL_DIMENSION - offX
		}
		if (rayDirection.x < 0) {
			offX *= -1
		}

		if (rayDirection.y > 0 && offY !== CELL_DIMENSION) {
			offY = CELL_DIMENSION - offY
		}
		if (rayDirection.y < 0) {
			offY *= -1
		}
		
		const yIntersect = new Vector(player.x + (offY / Math.tan(currAngle)), player.y + offY)
		const yIntersectStep = new Vector(CELL_DIMENSION / Math.tan(currAngle), CELL_DIMENSION)

		const xIntersect = new Vector(player.x + offX, player.y + (Math.tan(currAngle) * offX))
		const xIntersectStep = new Vector(CELL_DIMENSION, Math.tan(currAngle) * CELL_DIMENSION)

		const horizWallPoint = getEndPosition(yIntersect, rayDirection, yIntersectStep)
		const vertWallPoint = getEndPosition(xIntersect, rayDirection, xIntersectStep)

		const hDistance = Math.hypot(horizWallPoint.x - player.x, horizWallPoint.y - player.y)
		const vDistance = Math.hypot(vertWallPoint.x - player.x, vertWallPoint.y - player.y)


		
		
		let wallType, minDistance;
		if (hDistance < vDistance) {
			wallType = isAWall(Vector.add(horizWallPoint, rayDirection))
			minDistance = hDistance
		} else {
			wallType = isAWall(Vector.add(vertWallPoint, rayDirection))
			minDistance = vDistance
		}

		return new Ray(minDistance, currAngle, wallType)
	
	}

	function getEndPosition(startPosition: Vector, rayDirection: Vector, step: Vector) {
		let hit = 0
		if ((rayDirection.x < 0 && step.x > 0) || (rayDirection.x > 0 && step.x < 0)) {
			step.x *= -1
		}
		if ((rayDirection.y < 0 && step.y > 0) || (rayDirection.y > 0 && step.y < 0)) {
			step.y *= -1
		}

		while (!hit) {
			const potentialHit = Vector.add(startPosition, rayDirection)
			if (!inBounds(potentialHit)) break;
			if (isAWall(potentialHit)) {
				hit = 1
				return startPosition;
			}

			startPosition.add(step)
		}
		return new Vector(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
	}
}

const isAWall = (position: Vector) => {
	const col = Math.floor(position.x / CELL_DIMENSION)
	const row = Math.floor(position.y / CELL_DIMENSION)
	return map[row][col]
}


const drawMiniMap = (ctx: CanvasRenderingContext2D, map: number[][], player: Vector, angle: number) => {
	ctx.scale(0.1, 0.1)

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
				if (map[i][j] !== 0) {
					ctx.fillRect(x, y, CELL_DIMENSION - 4, CELL_DIMENSION - 4)
				}
			}
		}
	}

	function renderGrid() {
		ctx.save()
		ctx.fillStyle = "rgb(255,255,255)"
		ctx.fillRect(0, 0, WIDTH, HEIGHT)
		ctx.restore()
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