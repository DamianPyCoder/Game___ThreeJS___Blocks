import { WebGLRenderer, sRGBEncoding, OrthographicCamera } from 'three';
import Scene1 from './scenes/Scene1';
import Observer, { EVENTS } from './Observer';

import * as TWEEN from '@tweenjs/tween.js/dist/tween.umd';

export class App {
	constructor(container) {
		this.container = container;

		this.camera_pan_up = 40;
		this.camera_y = 300;


		this.scene = new Scene1();

		// ## Camera's config
		this.camera = new OrthographicCamera(
			this.container.clientWidth / -2,
			this.container.clientWidth / 2,
			this.container.clientHeight / 2,
			this.container.clientHeight / -2,
			-1000, 1000
		);
		this.camera.position.set(10, 10 + this.camera_y, 10);
		this.camera.lookAt(0, this.camera_y, 0);


		// this.control = new OrbitControls(this.camera, this.container);

		// ## Renderer's config
		this.renderer = new WebGLRenderer({
			antialias: true,
		})
		this.renderer.setPixelRatio(window.devicePixelRatio);

		// sRGBEncoding
		this.renderer.outputEncoding = sRGBEncoding;

		// ## Light's config
		this.renderer.physicallyCorrectLights = true;

		this.container.appendChild(this.renderer.domElement);
		this.onResize();
		this.render();
		this.events();
	}

	events() {
		Observer.on(EVENTS.STACK, () => {
			this.camera_y += this.camera_pan_up;

			const camera_up = new TWEEN.Tween(this.camera.position)
				.to({
					y: 10 + this.camera_y
				}, 500)
				.easing(TWEEN.Easing.Sinusoidal.In);
			camera_up.start();

		});

		Observer.on(EVENTS.START, () => {
			this.camera_y = 300;
			this.camera.position.set(10, 10 + this.camera_y, 10);
			this.camera.lookAt(0, this.camera_y, 0);

			const camera_zoom_in = new TWEEN.Tween(this.camera)
				.to({ zoom: 1 }, 800)
				.easing(TWEEN.Easing.Sinusoidal.In)
				.onUpdate(() => {
					this.camera.updateProjectionMatrix();
				});
			camera_zoom_in.start();
		});

		Observer.on(EVENTS.GAME_OVER, () => {
			const camera_zoom_out = new TWEEN.Tween(this.camera)
				.to({ zoom: .6 }, 700)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onUpdate(() => {
					this.camera.updateProjectionMatrix();
				});
			camera_zoom_out.start();
		});
	}

	onResize() {
		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

		this.camera.left = this.container.clientWidth / -2;
		this.camera.right = this.container.clientWidth / 2;
		this.camera.top = this.container.clientHeight / 2;
		this.camera.bottom = this.container.clientHeight / -2;

		this.camera.updateProjectionMatrix();
	}

	render() {
		this.renderer.render(this.scene, this.camera);

		// Updates here
		this.scene.update();

		this.renderer.setAnimationLoop(() => this.render());
	}
}
