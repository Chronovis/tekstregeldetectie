import {createStore, applyMiddleware, combineReducers} from "redux";
import reducers from "../reducers";
import thunkMiddleware from "redux-thunk";

const logger = store => next => action => {
	if (action.hasOwnProperty("type")) {
		console.log("[REDUX]", action.type, action);
	}

	return next(action);
};

let createStoreWithMiddleware = applyMiddleware(logger, thunkMiddleware)(createStore);

let data = combineReducers(reducers);
export default createStoreWithMiddleware(data, window.SERVER_STATE);
