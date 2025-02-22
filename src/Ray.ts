export default class Ray {
	distance: number
	angle: number
	wallType: number
	constructor(distance: number, angle: number, wallType: number) {
		this.distance = distance;
		this.angle = angle;	
		this.wallType = wallType
	}
}