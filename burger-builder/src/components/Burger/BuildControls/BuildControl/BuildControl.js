import React from 'react';
import classes from './BuildControl.module.css';

const buildControl = (props) => (
	<div className={classes.BuildControl}>
		<div className={classes.label}>{props.label}</div>
		<button onClick={props.removed} className={classes.Less} disabled={props.disabled}>
			less
		</button>
		<button onClick={props.added} className={classes.More}>
			MORE!!!!
		</button>
	</div>
);
export default buildControl;
