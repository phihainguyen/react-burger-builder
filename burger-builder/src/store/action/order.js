import * as actionTypes from './actionTypes';
import axios from '../../axios-order';

export const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderID: id,
		orderData: orderData
	};
};
export const purchaseBurgerFail = (error) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAIL,
		error: error
	};
};
export const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	};
};
export const purchaseBurger = (orderData) => {
	return (dispatch) => {
		dispatch(purchaseBurgerStart());
		axios
			.post('/orders.json', orderData)
			.then((resp) => {
				// console.log(resp);
				dispatch(purchaseBurgerSuccess(resp.data.name, orderData));
			})
			.catch((error) => {
				console.error(error);
				dispatch(purchaseBurgerFail(error));
			});
	};
};
export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	};
};
