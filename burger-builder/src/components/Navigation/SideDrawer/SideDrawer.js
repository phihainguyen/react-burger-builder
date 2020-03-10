import React from 'react';
import classes from './SideDrawer.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux';

const sideDrawer = (props) => {
	let attachedCLasses = [ classes.SideDrawer, classes.Close ];
	if (props.open) {
		attachedCLasses = [ classes.SideDrawer, classes.Open ];
	}
	return (
		<Aux>
			<Backdrop show={props.open} click={props.closed} />
			<div className={attachedCLasses.join(' ')}>
				<div className={classes.Logo}>
					<Logo />
				</div>

				<nav>
					<NavigationItems />
				</nav>
			</div>
		</Aux>
	);
};
export default sideDrawer;
