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
	[1,0,0,1,0,0,0,0,0,1],
	[1,0,1,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,1,1],
	[1,0,2,3,3,0,0,1,0,1],
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