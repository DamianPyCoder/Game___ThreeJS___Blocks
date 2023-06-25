import Observer, { EVENTS } from "../Observer";

class UserInterface {
	constructor() {
		this.points = document.getElementById('points');
		this.button_start = document.getElementById('button-start');
		this.gameover = document.getElementById('gameover');

		this.events();
	}
	events() {
		Observer.on(EVENTS.NEW_GAME, () => {
			this.button_start.style.top = '30%';
			this.button_start.classList.add('animate__fadeInDown');
		});

		Observer.on(EVENTS.START, () => {
			this.button_start.classList.add('animate__fadeOutUp');

			this.points.style.top = '30%';
			this.points.classList.add('animate__fadeInDown');

			this.gameover.classList.add('animate__fadeOutDown');

		});

		Observer.on(EVENTS.UPDATE_POINTS, (points) => {
			this.points.innerHTML = points;
		});

		Observer.on(EVENTS.GAME_OVER, () => {
			this.points.style.top = '25%';

			this.gameover.style.top = '35%';
			this.gameover.classList.remove('animate__fadeOutDown');
			this.gameover.classList.add('animate__fadeInUp');

		});
	}
}

export default UserInterface;
