import xhr from "xhr";

let setManuscript = (id) => (dispatch, getState) => {
	const manuscripts = getState().manuscripts;

	dispatch({
		entries: manuscripts.all[id],
		id: id,
		type: "SET_MANUSCRIPT"
	});
};


export {setManuscript};
