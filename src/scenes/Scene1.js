import { Scene, Color, DirectionalLight, HemisphereLight, Group, AxesHelper } from 'three';
import { Cube } from '../objects/Cube';
import BoxCreator from '../objects/BoxCreator';
import Box from '../objects/Box';
import Observer, { EVENTS } from '../Observer';
import SlicesBox from '../objects/SlicesBox';

import * as TWEEN from '@tweenjs/tween.js/dist/tween.umd';
import UserInterface from '../objects/UserInterface';

class Scene1 extends Scene {
	constructor() {
		super();
		const userInterface = new UserInterface();
		this.background = new Color('skyblue').convertSRGBToLinear();

		this.stack_points = 0;
		this.game_over = true;

		this.create();
		this.events();
	}

	create() {

		this.base_cube = new BoxCreator({
			width: 200,
			height: 200,
			alt: 200,
			color: 0x2c3e50
		});
		this.add(this.base_cube);

		// grupo de cajas
		this.boxes_group = new Group();
		this.add(this.boxes_group);

		// Luces
		const ambientLight = new HemisphereLight(0xffffbb, 0x080820, .5);
		const light = new DirectionalLight(0xffffff, 1.0);
		this.add(light, ambientLight);
	}

	events() {
		Observer.emit(EVENTS.NEW_GAME);
		Observer.on(EVENTS.CLICK, () => {
			if(this.game_over) {
				Observer.emit(EVENTS.START);
			} else {
				this.getLastBox().place();
			}
		});

		Observer.on(EVENTS.START, () => {
			this.resetGroup();
			Observer.emit(EVENTS.UPDATE_POINTS, this.stack_points);
			this.newBox({
				width: 200,
				height: 200,
				last: this.base_cube
			});
			this.game_over = false;
		});

		Observer.on(EVENTS.STACK, (new_box) => {
			this.stack_points++;
			Observer.emit(EVENTS.UPDATE_POINTS, this.stack_points);

			// Removemos el bloque principal
			this.boxes_group.remove(this.getLastBox());

			// Espacio para cortar el bloque
			const actual_base_cut = new SlicesBox(new_box);
			this.boxes_group.add(actual_base_cut.getBase());
			this.add(actual_base_cut.getCut());

			// Efecto del bloque cortado
			const tween_cut = new TWEEN.Tween(actual_base_cut.getCut().position)
				.to({
					[new_box.axis]: actual_base_cut.getCut().position[new_box.axis] + (200 * new_box.direction)
				}, 500)
				.easing(TWEEN.Easing.Quadratic.Out);

			tween_cut.start();

			actual_base_cut.getCut().material.transparent = true;
			const tween_cut_alpha = new TWEEN.Tween(actual_base_cut.getCut().material)
				.to({
					opacity: 0
				}, 600)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onComplete(() => {
					this.remove(actual_base_cut.getCut());
				});
			tween_cut_alpha.start();

			// Bloque nuevo
			this.newBox({
				width: new_box.base.width,
				height: new_box.base.height,
				last: this.getLastBox()
			});
		});

		Observer.on(EVENTS.GAME_OVER, () => {
			if(!this.game_over) {
				this.stack_points = 0;
				const tween_gameover = new TWEEN.Tween(this.getLastBox().position)
				.to({ y: this.getLastBox().position.y + 300 }, 1000)
				.easing(TWEEN.Easing.Bounce.Out);
				tween_gameover.start();
			}
			this.game_over = true;
		})

	}

	newBox({ width, height, last }) {
		const actual_box = new Box({
			width,
			height,
			last
		});
		this.boxes_group.add(actual_box);
	}

	resetGroup() {
		this.boxes_group.children.map((box, i) => {
			const tween_destroy = new TWEEN.Tween(box.scale)
				.to({
					x: .5,
					y: .5,
					z: .5
				}, 80 * i)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onComplete(() => {
					this.boxes_group.remove(box);
				});
			tween_destroy.start();
		})
	}

	getLastBox() {
		return this.boxes_group.children[this.boxes_group.children.length - 1];
	}

	update() {
		TWEEN.update();
		if(!this.game_over) {
			this.getLastBox().update();
		}
	}
}

export default Scene1;
