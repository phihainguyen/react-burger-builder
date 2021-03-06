import * as actionTypes from './actionTypes';
import axios from '../../axios-order';

export const addIngredient = (name) => {
	return { type: actionTypes.ADD_INGREDIENT, ingredientName: name };
};
export const removeIngredient = (name) => {
	return { type: actionTypes.REMOVE_INGREDIENT, ingredientName: name };
};

export const setIngredient = (ingredients) => {
	return {
		type: actionTypes.SET_INGREDIENTS,
		ingredients: ingredients
	};
};

export const fetchIngredientsFailed = () => {
	return {
		type: actionTypes.FETCH_INGREDIENT_FAILED
	};
};
export const initIngredients = () => {
	return (dispatch) => {
		axios
			.get('https://burgerordering.firebaseio.com/ingredients.json')
			.then((resp) => {
				dispatch(setIngredient(resp.data));
			})
			.catch((error) => {
				dispatch(fetchIngredientsFailed());
			});
	};
};
