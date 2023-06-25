import { App } from './App';
import Observer, { EVENTS } from './Observer';

const container = document.querySelector('#game-container');
const app = new App( container );

window.addEventListener('resize', () => {
	app.onResize();
});

document.addEventListener('click', () => {
	Observer.emit(EVENTS.CLICK, 'Hola soy event emitter');
});
