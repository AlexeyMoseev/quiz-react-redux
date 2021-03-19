import React from 'react'
import classes from './Input.module.css'

function isInvalid({ valid, touched, shouldValidate }) {
	return !valid && touched && shouldValidate
}

const Input = (props) => {
	const inputType = props.type || 'text'
	const htmlFor = `${inputType}-${Math.random()}`
	const cls = [classes.Input]

	if (isInvalid(props)) {
		cls.push(classes.invalid)
	}

	return (
		<div className={cls.join(' ')}>
			<label htmlFor={htmlFor}>{props.label}</label>
			<input
				type={inputType}
				id={htmlFor}
				value={props.value}
				onChange={props.onChange}
			></input>
			{isInvalid(props) ? (
				<span>{props.errorMessage || 'Введите верное значение'}</span>
			) : null}
		</div>
	)
}

export default Input
