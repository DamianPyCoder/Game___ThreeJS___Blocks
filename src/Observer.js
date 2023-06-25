import EventEmitter from "eventemitter3";

export const EVENTS = {
	NEW_GAME: 'NEW_GAME',
	UPDATE_POINTS: 'UPDATE_POINTS',
	START: 'START',
	CLICK: 'CLICK',
	GAME_OVER: 'GAME_OVER',
	STACK: 'STACK'
}

const Observer = new EventEmitter();
export default Observer;
