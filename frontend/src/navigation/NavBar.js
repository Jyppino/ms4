import React from 'react'
import {Sidebar, Segment, Menu, Icon} from 'semantic-ui-react'
import {Route, Link, Switch} from 'react-router-dom'

import axios from 'axios'
import {Home} from './../homepage/Home.js'
import {Shelf} from './../shelfpage/Shelf.js'
import {PictureProcessor} from './../uploadpage/PictureProcessor.js'
import RecommendationPage from './../recommendations/RecommendationPage.js'

// Style
import './NavBar.css';

/**
 * NavBar component, this component displays the sidebar and the topbar.
 * The container attached to the navbar will return current selected page.
 * @type {Object}
 */
export class NavBar extends React.Component {
	state = {
		menuVisible: false
	}

	toggleVisibility = () => this.setState({
		menuVisible: !this.state.menuVisible
	})

	render() {
		const {menuVisible} = this.state

		return (
		<div>
			<Menu secondary attached="top" activeIndex="MyShelf">
				<Menu.Item onClick={() => this.setState({
						menuVisible: !this.state.menuVisible
					})}>
					<Icon name="sidebar"/>Menu
				</Menu.Item>
				<Menu.Item></Menu.Item>
				<Menu.Item header>
					<h3>MyShelf</h3>
				</Menu.Item>

				<Menu.Menu position='right'>
					<Menu.Item name='logout' onClick={function onClick() {
						axios.get(`http://api.myshelf.nl/auth/logout`, {withCredentials: true})
						localStorage.setItem('authenticated', 'false');
						alert("Logout!")
						window.location.replace('/');
						}}/>
				</Menu.Menu>
			</Menu>

			<div className='pageContainer'>
				<Sidebar.Pushable as={Segment} attached='top' padded='very'>
					<Sidebar as={Menu} animation='overlay' fixed="left" visible={menuVisible} icon='labeled' vertical inverted>
						<Menu.Item as={Link} onClick={this.toggleVisibility} name='home' to='/home'>
							<Icon name='home'/>
							Home
						</Menu.Item>
						<Menu.Item as={Link} onClick={this.toggleVisibility} name='shelf' to='/shelf'>
							<Icon name='book'/>
							Your Shelf
						</Menu.Item>
						<Menu.Item as={Link} onClick={this.toggleVisibility} name='add' to='/upload'>
							<Icon name='plus'/>
							Add books
						</Menu.Item>
						<Menu.Item as={Link} onClick={this.toggleVisibility} name='recommend' to='/recommendations'>
							<Icon name='list' />
							Recommendations
						</Menu.Item>
					</Sidebar>
					<Sidebar.Pusher>
						<Switch>
							<div className='content'>
								<Route exact path='/' component={Home}/>
								<Route path="/home" component={Home}/>
								<Route path="/shelf" component={Shelf}/>
								<Route path="/upload" component={PictureProcessor}/>
								<Route path='/recommendations' component={RecommendationPage} />
							</div>
						</Switch>
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</div>
		</div>
		)
	}
}

// DIMMER CODE

//  <Dimmer.Dimmable as={Segment} blurring="blurring" dimmed={menuVisible}>
// 	<Dimmer active={menuVisible} onClickOutside={this.toggleVisibility}/>
//	</Dimmer.Dimmable>
