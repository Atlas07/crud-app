import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchGames, deleteGame } from '../actions'

import GamesList from './GamesList'


function mapStateToProps(state) {
	return {
		games: state.games
	}
}

class GamePage extends Component {
	componentDidMount() {
		this.props.fetchGames()
	}

	render() {
		return (
			<div>
				<h1>Games List</h1>
				<GamesList games={this.props.games} deleteGame={this.props.deleteGame} />
			</div>
		);
	}
}

GamePage.propTypes = {
	games: PropTypes.array.isRequired,
	fetchGames: PropTypes.func.isRequired,
	deleteGame: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { fetchGames, deleteGame })(GamePage)
