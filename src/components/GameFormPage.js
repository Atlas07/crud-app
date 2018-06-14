import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { saveGame, fetchGame, updateGame } from '../actions'

import GameForm from './GameForm'


function mapStateToProps(state, props) {
	if(props.match.params._id) {
		return {
			game: state.games.find(item => item._id === props.match.params._id)
		}
	}

	return {
		game: null
	}
}

class GameFormPage extends Component {
	
	state = {
		redirect: false
	}

	componentDidMount = () => {
		if(this.props.match.params._id) {
			this.props.fetchGame(this.props.match.params._id)
		}
	}

	saveGame = (_id, title, cover) => {
		if (_id) {
			return this.props.updateGame({ _id, title, cover })
				.then(() => this.setState({ redirect: true }))
		}
		else {
			return this.props.saveGame({ title, cover })
				.then(() => this.setState({ redirect: true }))
		}
	}

	render() {
		return (
			<div>
				{ 
					this.state.redirect ?
						<Redirect to="/games" /> :
						<GameForm 
							game={this.props.game}
							saveGame={this.saveGame}
						/>
				}
			</div>
		)
	}
}

export default connect(mapStateToProps, { saveGame, fetchGame, updateGame })(GameFormPage)

