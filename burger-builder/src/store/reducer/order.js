import * as actionTypes from '../action/actionTypes';

const initialState = {
	orders: [],
	loading: false,
	purchasing: false
};
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.PURCHASE_INIT:
			return {
				...state,
				purchasing: false
			};

		case actionTypes.PURCHASE_BURGER_START:
			return {
				...state,
				loading: true
			};
		case actionTypes.PURCHASE_BURGER_SUCCESS:
			const newOrder = {
				...action.orderData,
				id: action.orderID
			};
			return {
				...state,
				loading: false,
				orders: state.orders.concat(newOrder),
				purchasing: true
			};
		case actionTypes.PURCHASE_BURGER_FAIL:
			return {
				...state,
				loading: false
			};
		default:
			return state;
	}
};
export default reducer;
