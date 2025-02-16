
export default class Vector {
	x: number
	y: number
	maxLimit: number

	constructor(x: number = 0, y: number = 0) {
		this.x = x 
		this.y = y
		this.maxLimit = Number.MAX_SAFE_INTEGER
	}

	static mag(v: Vector): number {
		return Math.sqrt(v.x * v.x + v.y * v.y)
	}

	static add(a: Vector, b: Vector): Vector {
		return new Vector(a.x + b.x, a.y + b.y)
	}

	static sub(a: Vector, b: Vector): Vector {
		return new Vector(a.x - b.x, a.y - b.y)
	}

	static normalize(v: Vector): Vector {
		const magn = Vector.mag(v)
		const vec = new Vector(v.x / magn, v.y / magn)
		return vec
	}

	limit(value: number): this {
		this.maxLimit = value
		return this
	}

	setMag(times: number): this {
		if (times <= this.maxLimit) {
			const v = new Vector(times, times)
			this
				.normalize()
				.mul(v)
		}
		return this
	}

	normalize(): this {
		const magn = Vector.mag(this)
		this.x /= magn
		this.y /= magn
		return this
	}

	add(v: Vector): this {
		this.x += v.x
		this.y += v.y
		return this
	}

	sub(v: Vector): this {
		this.x -= v.x
		this.y -= v.y
		return this
	}

	mul(v: Vector): this {
		this.x *= v.x
		this.y *= v.y
		return this
	}

	div(v: Vector): this {
		const x = v.x || 1
		const y = v.y || 1
		this.x /= x
		this.y /= y
		return this
	}
}