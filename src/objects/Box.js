import BoxCreator from './BoxCreator';
import generateColor from '../helpers/generateColors';
import Observer, { EVENTS } from '../Observer';

class Box extends BoxCreator {
	constructor({ width, height, last}) {
		super({width, height, color: generateColor()});
		this.last = last;

		this.position.y = last.position.y + last.geometry.parameters.height / 2 + this.geometry.parameters.height / 2;

		this.max_position = 360;
		this.is_stopped = false;
		this.direction = 1;
		this.velocity = 4;
		this.actual_axis = (Math.random() >= 0.5) ? 'x' : 'z';
		this.contrary_axis = (this.actual_axis === 'x') ? 'z' : 'x';

		this.position[this.actual_axis] -= this.max_position * this.direction;
		this.position[this.contrary_axis] = last.position[this.contrary_axis];
	}

	place() {
		const plane = (this.actual_axis === 'x') ? 'width' : 'height';
		const distance_center = this.position[this.actual_axis] - this.last.position[this.actual_axis];
		const overlay = this.last.dimension[plane] - Math.abs(distance_center);

		if(overlay > 0) {

			const cut = this.last.dimension[plane] - overlay;
			const new_box = {
				base: {
					width: (plane === 'width') ? overlay : this.dimension.width,
					height: (plane === 'height') ? overlay : this.dimension.height,
				},
				cut: {
					width: (plane === 'width') ? cut : this.dimension.width,
					height: (plane === 'height') ? cut : this.dimension.height,
				},
				color: this.color,
				axis: this.actual_axis,
				last_position: this.position,
				direction: distance_center/Math.abs(distance_center) | 1
			}
			Observer.emit(EVENTS.STACK, new_box);


		} else {
			Observer.emit(EVENTS.GAME_OVER);
		}
	}

	update() {
		if(!this.is_stopped) {
			this.position[this.actual_axis] += this.direction * this.velocity;
			if(Math.abs(this.position[this.actual_axis]) >= this.max_position) {
				this.direction *= -1;
			}
		}
	}
}

export default Box;
