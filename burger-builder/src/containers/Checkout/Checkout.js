import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';
import * as actions from '../../store/action/index';

class Checkout extends Component {
	checkoutCancelHandler = () => {
		this.props.history.goBack();
	};
	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data');
	};
	render() {
		let summary = <Redirect to="/" />;
		if (this.props.ings) {
			const purcahseRedirect = this.props.purchasing ? <Redirect to="/" /> : null;

			summary = (
				<div>
					{purcahseRedirect}
					<CheckoutSummary
						ingredients={this.props.ings}
						checkoutCanceled={this.checkoutCancelHandler}
						checkoutContinued={this.checkoutContinuedHandler}
					/>
					<Route path={this.props.match.path + '/contact-data'} component={ContactData} />
				</div>
			);
		}
		return summary;
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		purchasing: state.order.purchasing
	};
};

export default connect(mapStateToProps)(Checkout);
