import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';
import axios from '../../../axios-order';

import { connect } from 'react-redux';
class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: { type: 'text', placeholder: 'Your Name' },
				value: ''
				// ,
				// validation: { required: true },
				// valid: false
			},

			street: {
				elementType: 'input',
				elementConfig: { type: 'text', placeholder: 'Street' },
				value: ''
				// ,
				// validation: { required: true },
				// valid: false
			},

			zipcode: {
				elementType: 'input',
				elementConfig: { type: 'text', placeholder: 'ZIP Code' },
				value: ''
				// ,
				// validation: { required: true },
				// valid: false
			},

			country: {
				elementType: 'input',
				elementConfig: { type: 'text', placeholder: 'Country' },
				value: ''
				// ,
				// validation: { required: true },
				// valid: false
			},

			email: {
				elementType: 'input',
				elementConfig: { type: 'email', placeholder: 'Email' },
				value: ''
				// ,
				// validation: { required: true },
				// valid: false
			},
			delveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' }
					]
				},
				value: '',
				valid: true
			}
		},
		loading: false
	};
	orderHandler = (event) => {
		event.preventDefault();
		// console.log(this.props.ingredients);
		// alert(`Your total is: $${this.state.totalPrice.toFixed(2)}`);
		//here we set loading icon to true at inital part before the post request
		const formData = {};
		for (let formElementIdentifier in this.state.orderForm) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}
		this.setState({
			loading: true
		});
		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData
		};
		//we will then set the loading now to false once the post request has completed and sent back the response same with the catch error because we dont want to load during that time
		//below we are also setting purchasing in our state to false since we also want to close our modal after we click the order button
		axios
			.post('/orders.json', order)
			.then((resp) => {
				// console.log(resp);
				this.setState({ loading: false });
				this.props.history.push('/');
			})
			.catch((error) => {
				console.error(error);
				this.setState({ loading: false });
			});
	};
	// checkValidity(value, rules) {
	// 	let isValid = false;
	// 	if (rules.required) {
	// 		isValid = value.trim() !== '';
	// 	}
	// 	return isValid;
	// }
	inputChangeHandler = (event, inputIdentifier) => {
		// console.log(event.target.value);
		const updatedOrderForm = { ...this.state.orderForm };

		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};

		updatedFormElement.value = event.target.value;
		// updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedOrderForm[inputIdentifier] = updatedFormElement;
		console.log(updatedFormElement);
		this.setState({ orderForm: updatedOrderForm });
	};
	render() {
		const formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}
		let form = (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map((formElement) => (
					<Input
						key={formElement.id}
						elementType={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						changed={(event) => this.inputChangeHandler(event, formElement.id)}
					/>
				))}
				<Button btnType="Success" clicked={this.orderHandler}>
					ORDER
				</Button>
			</form>
		);
		if (this.state.loading) {
			form = <Spinner />;
		}
		return (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Info</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	};
};
export default connect(mapStateToProps)(ContactData);
