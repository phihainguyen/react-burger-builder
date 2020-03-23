import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-order';

import { connect } from 'react-redux';
import * as burgerBuilderActions from '../../store/action/index';

class BurgerBuilder extends Component {
	state = {
		purchasing: false
	};

	componentDidMount() {
		console.log(this.props);
		this.props.initIngredients();
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map((igKey) => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};
	purchaseCancelHandler = () => {
		this.setState({
			purchasing: false
		});
	};
	purchaseContinueHandler = () => {
		this.props.history.push('/checkout');
	};
	render() {
		const disabledInfo = {
			...this.props.ings
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] === 0;
		}
		//creating the spinner for when submmitting order
		let orderSummary = null;

		//here we will create spinner while waiting for ingredients data to load from backend 'firebase' server
		let burger = this.props.error ? <h1>404 Ingredients Cant' Be Loaded!</h1> : <Spinner />;

		if (this.props.ings) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						ingredientAdded={this.props.addIngredient}
						ingredientRemoved={this.props.removeIngredient}
						disabled={disabledInfo}
						price={this.props.price}
						purchasable={this.updatePurchaseState(this.props.ings)}
						ordered={this.purchaseHandler}
					/>
				</Aux>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ings}
					purchaseCanceled={this.purchaseCancelHandler}
					purchaseContinue={this.purchaseContinueHandler}
					price={this.props.price}
				/>
			);
		}
		// if (this.state.loading) {
		// 	orderSummary = <Spinner />;
		// }
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

const mapStateToProps = (state) => {
	return {
		ings: state.ingredients,
		price: state.totalPrice,
		error: state.error
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		addIngredient: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
		removeIngredient: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
		initIngredients: () => dispatch(burgerBuilderActions.initIngredients())
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
