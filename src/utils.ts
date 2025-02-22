export const WIDTH = 800
export const HEIGHT = 800
export const N_ROWS = 10
export const N_COLS = 10
export const CELL_DIMENSION = WIDTH / N_ROWS
export const FOV = 2 * Math.atan(0.66/1.0)

export const map = [
	// 1 -> Wall
	// 0 -> Empty space
	[1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,2,0,0,10,0,0,1],
	[1,0,1,3,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,2,3,1],
	[1,0,2,4,3,0,0,1,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1],
]

export enum WallType {
	None,
	Common,
	Red,
	Blue,
	Green,
	Tower = 10
}