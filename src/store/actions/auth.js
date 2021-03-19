import axios from 'axios'
import { AUTH_SUCCESS, AUTH_LOGOUT } from './actionTypes'

export function auth(email, password, isLogin) {
	return async (dispatch) => {
		const authData = {
			email,
			password,
			returnSecureToken: true,
		}

		let url = process.env.REACT_APP_SIGNUP_KEY

		if (isLogin) {
			url = process.env.REACT_APP_SIGNIN_KEY
		}

		const response = await axios.post(url, authData)
		const data = response.data

		const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000) //expiresIn - время действия токена

		localStorage.setItem('token', data.idToken) //access token дающий доступ на определенное время(3600 секунд в firebase)
		localStorage.setItem('userId', data.localId)
		localStorage.setItem('expirationDate', expirationDate) //дата 'протухания' токена; вбиваем в
		//локальное хранилище, чтобы браузер знал, когда эта дата наступает

		dispatch(authSuccess(data.idToken))
		dispatch(autoLogout(data.expiresIn)) //автоматический логаут из аккаунта, когда срок действия токена истечет
	}
}

export function authSuccess(token) {
	return {
		type: AUTH_SUCCESS,
		token,
	}
}

export function autoLogout(time) {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logout())
		}, time * 1000)
	}
}

export function logout() {
	localStorage.removeItem('token')
	localStorage.removeItem('userId')
	localStorage.removeItem('expirationDate')
	return {
		type: AUTH_LOGOUT,
	}
}

export function autoLogin() {
	return (dispatch) => {
		const token = localStorage.getItem('token')
		if (!token) {
			dispatch(logout())
		} else {
			const expirationDate = new Date(localStorage.getItem('expirationDate'))
			if (expirationDate <= new Date()) {
				dispatch(logout())
			} else {
				dispatch(authSuccess(token))
				dispatch(
					autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
				)
			}
		}
	}
}
