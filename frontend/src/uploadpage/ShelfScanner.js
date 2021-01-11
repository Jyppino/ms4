import React from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import api from '../api/api.js'

import { Segment, Divider, Loader as SemanticLoader, Header, Button } from 'semantic-ui-react'
import ShelfDropdown from '../assets/ShelfDropdown.js'
import Loader from './../assets/Loader.js'
import BookShelf from '../assets/BookShelf.js'

// style
import './ShelfScanner.css'
import './ExtraNav.css'

/**
 * The ShelfScanner component, this component will upload the picture to the server and will recieve boxes where the books should be. It then draws these boxes with a canvas.
 * @extends React
 */
class ShelfScanner extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			scoreThreshold: 0.7,
			isLoading: false,
			results: [],
			deletedResults: [],
			info: [],
			selectedShelf: 'read'
		}

		this.drawImage = this.drawImage.bind(this)
		this.drawBoxes = this.drawBoxes.bind(this)
		this.postFile = this.postFile.bind(this)

		this.handleMouseMove = this.handleMouseMove.bind(this)
		this.handleMouseClick = this.handleMouseClick.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)

		this.deleteResult = this.deleteResult.bind(this)
		this.restoreResult = this.restoreResult.bind(this)

		this.addAll = this.addAll.bind(this)
	}

	/**
	 * Requests the server for the boxes and draws them on a cavnas.
	 * @method componentDidMount
	 */
	componentDidMount() {
		const comp = this
		comp.setState({isLoading : true})

		const imageCanvas = this.refs.imageCanvas

		let img = new Image();
		img.onload = function() {
										// Draw image
										comp.drawImage(this);

										// Draw boxes based on request
										imageCanvas.toBlob(comp.postFile, 'image/jpeg')
										//comp.postFile(this)
								};
		img.src = this.props.img.preview;
	}

	/**
	 * Draws all boxes recieved from the server on the canvas
	 * @method drawBoxes
	 * @param  {[Object]}  objects [An array of coordinates of boxes]
	 */
	 drawBoxes(objects) {
	 	let drawCanvas = this.refs.drawCanvas
		let drawCtx = drawCanvas.getContext("2d");

		//Some styles for the drawcanvas
		drawCtx.lineWidth = 4;
		drawCtx.strokeStyle = "cyan";
		drawCtx.font = "20px Verdana";
		drawCtx.fillStyle = "cyan";

		drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
		objects.filter(object => object.title).forEach(object => {
			let x = object.x * drawCanvas.width;
			let y = object.y * drawCanvas.height;
			let width = (object.width * drawCanvas.width) - x;
			let height = (object.height * drawCanvas.height) - y;

			this.state.info.push({
				'left': x,
				'up': y,
				'right': width + x,
				'down': height + y,
				'title': object.title,
				'state': true
			})

			drawCtx.strokeRect(x, y, width, height);
		});
	}

	/**
	 * Draws and scales the image to the canvas
	 * @method drawImage
	 * @param  {file}  image [An image file]
	 */
	drawImage(image) {
		let imageCtx = this.refs.imageCanvas.getContext("2d");
		let drawCanvas = this.refs.drawCanvas
		let imageCanvas = this.refs.imageCanvas
		let infoCanvas = this.refs.infoCanvas

		var maxWidth = 1000;
		var maxHeight = 1000;
		var ratio = 0;
		var width = image.width;
		var height = image.height;

		// Check if the current width is larger than the max
		if (width > maxWidth) {
			ratio = maxWidth / width;
			image.style.width = maxWidth;
			image.style.height = height * ratio;
			height = height * ratio;
			width = width * ratio;
		}

		// Check if current height is larger than max
		if (height > maxHeight) {
			ratio = maxHeight / height;
			image.style.height = maxHeight;
			image.style.width = width * ratio;
			width = width * ratio;
			height = height * ratio;
		}

		//Set canvas sizes based on input image
		drawCanvas.width = width;
		drawCanvas.height = height;
		imageCanvas.width = width;
		imageCanvas.height = height;
		infoCanvas.width = width;
		infoCanvas.height = height;

		imageCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
	};

	/**
	 * Posts the file to the server to recieve the boxes
	 * @method postFile
	 * @param  {file} file [The file containing the image that should be posted]
	 */
	postFile(file) {
		let formdata = new FormData();
			formdata.append("image", file);
			formdata.append("threshold", this.state.threshold);

		api.scan(formdata).then(res => {
			console.log(res.data)
			this.drawBoxes(res.data)
			this.setState({
				isLoading : false,
				results: res.data
			})
		}).catch(function(error) {
			alert("Could not fetch from DB: " + error)
			console.log("Could not fetch from DB: " + error)
		})
	}


	/**
	 * Delete the result if not correct
	 * @method deleteResult
	 */
	deleteResult(title) {
		console.log("Deleting: " + title)
		var index = this.findByTitle(title, this.state.results);
		if (index > -1) {
			var deleted = this.state.results.splice(index, 1)[0];
			console.log("Deleted: ")
			console.log(deleted)

			this.setState({
				deletedResults: this.state.deletedResults.concat(deleted)
			}, () => console.log(this.state.deletedResults))
		}
	}

	/**
	 * Restore a result into the result list when an accidental delete happened
	 * @method restoreResult
	 */
	restoreResult(title) {
		console.log("Restoring: " + title)
		var index = this.findByTitle(title, this.state.deletedResults);
		if (index > -1) {
			var restored = this.state.deletedResults.splice(index, 1)[0]
			console.log("Restored: ")
			console.log(restored)

			this.setState({
				results: this.state.results.concat(restored)
			}, () => console.log(this.state.results))
		}
	}

	/**
	 * Find the object by the title and give back index
	 * @method findByTitle
	 */
	findByTitle(title, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].title === title) {
            return i
        }
    }
    return -1;
	}

	/**
	 * Handle a mouse move and display title when hovering on a book
	 * @method handleMouseMove
	 */
	handleMouseMove(e) {
		let imageCanvas = this.refs.imageCanvas
		let infoCanvas = this.refs.infoCanvas
		let infoCtx = infoCanvas.getContext("2d");

		var rect = imageCanvas.getBoundingClientRect(), // abs. size of element
				scaleX = imageCanvas.width / rect.width,    // relationship bitmap vs. element for X
				scaleY = imageCanvas.height / rect.height;  // relationship bitmap vs. element for Y

		var x = (e.clientX - rect.left) * scaleX;
		var y = (e.clientY - rect.top) * scaleY
		var infos = this.state.info

		var hit = false;
		//console.log(Math.round(x) + ',' + Math.round(y))

		for(var i = 0; i < infos.length; i++) {
			var info = infos[i]
			if(x > info.left && x < info.right) {
				if (y < info.down && y > info.up) {
					hit = true

					var curTitle = info.title
					var titleLength = infoCtx.measureText(curTitle).width
					var topPadding = 25

					var posX = x - titleLength/2 - 10
 					var offset = 0;
					if (posX < 0) {
						posX = 0;
					} else if (posX + titleLength + 20 > infoCanvas.width) {
						posX = infoCanvas.width - ( titleLength + 20 )
					}

					infoCtx.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
					infoCtx.fillStyle= 'black' // "rgba(74, 74, 74, 0.8)"
					infoCtx.fillRect(posX, y - topPadding, titleLength + 20, topPadding)
					infoCtx.font="20px Arial";
					info.state ? infoCtx.fillStyle="white" : infoCtx.fillStyle="red";
					infoCtx.fillText(curTitle, posX + 10, y - 5);
					console.log(info.title)
				}
			}
		}

		if (!hit) {
			let infoCanvas = this.refs.infoCanvas
			let infoCtx = infoCanvas.getContext("2d");
			infoCtx.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
		}
	}

	/**
	 * Handle the mouse leaving the canvas
	 * @method handleMouseLeave
	 * @param  {[type]}         e [description]
	 * @return {[type]}           [description]
	 */
	handleMouseLeave(e) {
		let infoCanvas = this.refs.infoCanvas
		let infoCtx = infoCanvas.getContext("2d");
		infoCtx.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
	}


	/**
	 * Handle a mouse click -> this will delete or re-add a book
	 * @method handleMouseClick
	 */
	handleMouseClick(e) {
		let imageCanvas = this.refs.imageCanvas
		let drawCanvas = this.refs.drawCanvas
		let drawCtx = drawCanvas.getContext("2d");
		let infoCanvas = this.refs.infoCanvas
		let infoCtx = infoCanvas.getContext("2d");

		var rect = imageCanvas.getBoundingClientRect(), // abs. size of element
				scaleX = imageCanvas.width / rect.width,    // relationship bitmap vs. element for X
				scaleY = imageCanvas.height / rect.height;  // relationship bitmap vs. element for Y

		var x = (e.clientX - rect.left) * scaleX;
		var y = (e.clientY - rect.top) * scaleY
		var infos = this.state.info

		for(var i = 0; i < infos.length; i++) {
			var info = infos[i]
			if(x > info.left && x < info.right) {
				if (y < info.down && y > info.up) {
					if (info.state) {
						drawCtx.lineWidth = 4;
						drawCtx.strokeStyle = "red";
						drawCtx.font = "20px Verdana";
						drawCtx.fillStyle = "red";
						drawCtx.strokeRect(info.left, info.up, info.right - info.left, info.down - info.up);
						info.state = false
						this.deleteResult(info.title)
					} else {
						drawCtx.lineWidth = 4;
						drawCtx.strokeStyle = "cyan";
						drawCtx.font = "20px Verdana";
						drawCtx.fillStyle = "cyan";
						drawCtx.strokeRect(info.left, info.up, info.right - info.left, info.down - info.up);
						info.state = true
						this.restoreResult(info.title)
					}
				}
			}
		}
	}

	addAll() {
		var shelf = this.state.selectedShelf
		var question = window.confirm("Are you sure you want to add all these books to your " + shelf + " shelf?");
		if(question) {
			this.state.results.forEach(book => {
				api.book().add(shelf, book.id).then(res => {
						console.log(res.data)
						console.log("Added: " + book.title)
						alert('Added all books!')
					}).catch(function(error) {
						alert("Could not fetch from DB: " + error)
						console.log("Could not fetch from DB: " + error)
					})
			})
		}
	}

	render () {
		const loadedHeader = this.state.isLoading ? (
			<SemanticLoader active inline='centered'> Scanning image for books... </SemanticLoader>
		) : (
			null
		)

		const loadedShelf = this.state.isLoading ? (
			<div className='loader'><Loader /></div>
		) : (
			<BookShelf shelf={this.state.results} name={this.state.selectedShelf} setting='add' />
		);

		return (
			<Segment padded raised>
				<div className='segmentHeader'>
					<div className='goback' onClick={this.props.goBack}>&#8617; Go back</div>
					{loadedHeader}
				</div>

				<div className="scanner">
					<div ref="canvasholder" id="canvasholder">
						<canvas ref='imageCanvas' style={{position: 'absolute'}}></canvas>
						<canvas ref='drawCanvas' style={{position: 'absolute'}}></canvas>
						<canvas ref='infoCanvas'
										onClick ={(e) => {this.handleMouseClick(e)}}
										onMouseMove={(e) => {this.handleMouseMove(e)}}
										onMouseLeave={(e) => {this.handleMouseLeave(e)}}
										style={{position: 'absolute'}}></canvas>
					</div>
				</div>
				<div className='helperText'>
					<h3>Hover to view the title and click to remove (or re-add) a book from the found books</h3>
				</div>
				<Divider />
				<div className='addTools'>
					<p className='scannerDropwdown'>Add to: <ShelfDropdown handleChange={(selected) => this.setState({selectedShelf: selected})} /></p>
					<Button primary className='addAllButton' onClick={this.addAll}>+ Add all</Button>
				</div>

				{loadedShelf}
			</Segment>
		)
	}
}

ShelfScanner.propTypes = {
	goBack: PropTypes.func
}

export default ShelfScanner;
