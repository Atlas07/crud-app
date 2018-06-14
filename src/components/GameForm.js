import React, { Component } from 'react'
import classnames from 'classnames'

class GameForm extends Component {
	state = {
		_id: this.props.game ? this.props.game._id : null,
		title: this.props.game ? this.props.game.title : '',
		cover: this.props.game ? this.props.game.cover : '',
		errors: {},
		loading: false
	}

	componentDidUpdate = (prevProps) => {
		if(this.props.game !== prevProps.game) {
			this.setState({
				_id: this.props.game._id,
				title: this.props.game.title,
				cover: this.props.game.cover
			})
		}
	}

	handleChange = (e) => {
		if (!!this.state.errors[e.target.name]) {
			let errors = Object.assign({}, this.state.errors)

			delete errors[e.target.name]
			this.setState({ 
				[e.target.name]: e.target.value,
				errors
			})
		}
		else {
			this.setState({ [e.target.name]: e.target.value })
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()
		
		// validation
		let errors = {}
		
		if(this.state.title === '') {
			errors.title = "Can't be blank"
		}
		if(this.state.cover === '') {
			errors.cover = "Can't be blank"
		}

		this.setState({ errors })

		const isValid = Object.keys(errors).length === 0

		if(isValid) {
			const { _id, title, cover  } = this.state

			this.setState({ loading: true })
			this.props.saveGame(_id, title, cover)
				.catch(err => {
					err.response.json()
					.then(({ errors }) => {
						this.setState({
							errors,
							loading: false
						})
					})
				})
		}
	}

	render() {
		const { errors, loading } = this.state
		const form = (
			<form className={classnames('ui', 'form', { loading: loading })} onSubmit={this.handleSubmit}>
				<h1>Add new game</h1>
				{
					!!this.state.errors.global && 
					<div className="ui message negative"><p>{this.state.errors.global}</p></div>
				}

				<div className={classnames('field', { error: errors.title })}>
					<label htmlFor="title">Title</label>
					<input 
						type="text" 
						id="title" 
						name="title" 
						value={this.state.title} 
						onChange={this.handleChange}
					/>
					<span>{errors.title}</span>
				</div>

				<div className={classnames('field', { error: errors.cover })}>
					<label htmlFor="cover">Cover URL</label>
					<input 
						type="text" 
						id="cover"
						name="cover"
						value={this.state.cover}
						onChange={this.handleChange} 
					/>
					<span>{errors.cover}</span>
				</div>

				<div className="field">
					{this.state.cover !== '' && <img src={this.state.cover} alt="cover" className="ui small bordered image"/>}
				</div>

				<div className="field">
					<button className="ui primary button">Save</button>
				</div>
			</form>
		)

		return (
			<div>
				{ form }
			</div>	
		);
	}
}


export default GameForm