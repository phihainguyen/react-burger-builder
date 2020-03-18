import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
const INGREDIENT_PRICES = {
	salad: 0.5,
	bacon: 0.8,
	meat: 1.5,
	cheese: 0.4
};
class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	};

	componentDidMount() {
		axios
			.get('https://burgerordering.firebaseio.com/ingredients.json')
			.then((resp) => {
				this.setState({ ingredients: resp.data });
			})
			.catch((error) => {
				this.setState({ error: true });
			});
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map((igKey) => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		this.setState({ purchasable: sum > 0 });
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
		this.updatePurchaseState(updatedIngredients);
	};
	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) {
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
		this.updatePurchaseState(updatedIngredients);
	};
	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};
	purchaseCancelHandler = () => {
		this.setState({
			purchasing: false
		});
	};
	purchaseContinueHandler = () => {
		// alert(`Your total is: $${this.state.totalPrice.toFixed(2)}`);
		//here we set loading icon to true at inital part before the post request
		this.setState({
			loading: true
		});
		const order = {
			ingredients: this.state.ingredients,
			price: this.state.totalPrice,
			customer: {
				name: 'Phil Tom',
				address: {
					street: 'testSt 21',
					zipcode: 8989,
					country: 'USA'
				},
				email: 'pjsd@fi.com'
			}
		};
		//we will then set the loading now to false once the post request has completed and sent back the response same with the catch error because we dont want to load during that time
		//below we are also setting purchasing in our state to false since we also want to close our modal after we click the order button
		axios
			.post('/orders.json', order)
			.then((resp) => {
				console.log(resp);
				this.setState({ loading: false, purchasing: false });
			})
			.catch((error) => {
				console.error(error);
				this.setState({ loading: false, purchasing: false });
			});
	};
	render() {
		const disabledInfo = {
			...this.state.ingredients
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] === 0;
		}
		//creating the spinner for when submmitting order
		let orderSummary = null;

		//here we will create spinner while waiting for ingredients data to load from backend 'firebase' server
		let burger = this.state.error ? <h1>404 Ingredients Cant' Be Loaded!</h1> : <Spinner />;

		if (this.state.ingredients) {
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						disabled={disabledInfo}
						price={this.state.totalPrice}
						purchasable={this.state.purchasable}
						ordered={this.purchaseHandler}
					/>
				</Aux>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.state.ingredients}
					purchaseCanceled={this.purchaseCancelHandler}
					purchaseContinue={this.purchaseContinueHandler}
					price={this.state.totalPrice}
				/>
			);
		}
		if (this.state.loading) {
			orderSummary = <Spinner />;
		}
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}
export default withErrorHandler(BurgerBuilder, axios);
