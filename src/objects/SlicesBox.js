import BoxCreator from "./BoxCreator";

class SlicesBox {
	constructor(new_box) {
		this.base = new BoxCreator({
			width: new_box.base.width,
			height:  new_box.base.height,
			color: new_box.color
		});

		const move_base_x = new_box.cut.width / 2 * new_box.direction;
		const move_base_z = new_box.cut.height / 2 * new_box.direction;

		this.base.position.set(
			(new_box.axis === 'x') ? new_box.last_position.x - move_base_x : new_box.last_position.x,
			new_box.last_position.y,
			(new_box.axis === 'z') ? new_box.last_position.z - move_base_z : new_box.last_position.z
		);

		// El corte
		this.cut = new BoxCreator({
			width: new_box.cut.width,
			height:  new_box.cut.height,
			color: new_box.color
		});

		const move_cut_x = new_box.base.width / 2 * new_box.direction;
		const move_cut_z = new_box.base.height / 2 * new_box.direction;

		this.cut.position.set(
			(new_box.axis === 'x') ? new_box.last_position.x + move_cut_x : new_box.last_position.x,
			new_box.last_position.y,
			(new_box.axis === 'z') ? new_box.last_position.z + move_cut_z : new_box.last_position.z
		);

	}
	getBase() {
		return this.base;
	}
	getCut() {
		return this.cut;
	}
}

export default SlicesBox;
