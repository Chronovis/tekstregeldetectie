import React from "react";
import Slider from "hire-range-slider";

const LEFT_MAP_WIDTH = 50;
const TOP_MAP_HEIGHT = 50;

const applyThreshold = (threshold) => (value) => {
	value = Math.round(value);
	if (value >= threshold) value = 255;
	if (value < threshold) value = 120;

	return value;
}

const getImageSize = (image) => {
	const maxHeight = document.documentElement.clientHeight - 220;
	const maxWidth = document.documentElement.clientWidth - 70;
	return [maxWidth, maxHeight];
}

class App extends React.Component {
	constructor(props) {
	  super(props);

		this.state = {
			imageData: null,
			imageHeight: null,
			imageWidth: null
		}
	}

	componentDidMount() {
		const imgCanvas = this.refs.image;
		const leftMapCanvas = this.refs.leftmap;
		const topMapCanvas = this.refs.topmap;
		const imgCtx = imgCanvas.getContext("2d");

		const img = new Image();
		img.src = "/images/rembrandt-bw.png";
		img.onload = () => {
			const [imgWidth, imgHeight] = getImageSize(img);

			imgCanvas.width = imgWidth;
			imgCanvas.height = imgHeight;
			leftMapCanvas.width = LEFT_MAP_WIDTH;
			leftMapCanvas.height = imgHeight;
			topMapCanvas.width = imgWidth;
			topMapCanvas.height = TOP_MAP_HEIGHT;

			imgCtx.drawImage(img, 0, 0, imgWidth, imgHeight);
			let imageData = imgCtx.getImageData(0, 0, imgWidth, imgHeight);

			// Because the image is black and white, the GBA in RGBA can be discarded
			// and are left with an array of R's.
			imageData = imageData.data
				.reduce((prev, curr, index, array) => {
					if ((index + 1) % 4 === 0) {
						prev.push(array[index - 3]);
					}

					return prev;
				}, []);

			this.setState({
				imageData: imageData,
				imageHeight: imgHeight,
				imageWidth: imgWidth,
				threshholdTop: 220,
				thresholdLeft: 215
			});
		}
	}

	componentDidUpdate() {
		this.drawTopMap();
		this.drawLeftMap();
	}

	drawTopMap() {
		const mapCtx = this.refs.topmap.getContext("2d");
		let lineData = this.state.imageData
			.reduce((prev, curr, index, array) => {
				const columnIndex = index - (Math.floor(index/this.state.imageWidth) * this.state.imageWidth);
				if (prev[columnIndex] == null) prev[columnIndex] = 0;
				prev[columnIndex] += curr;
				return prev;
			}, [])
			.map((sum) => sum/this.state.imageHeight);

			lineData
				.map(applyThreshold(this.state.threshholdTop))
				.forEach((value, index) => {
					mapCtx.fillStyle = `rgb(${value}, ${value}, ${value})`;
					mapCtx.fillRect(index, 0, 1, TOP_MAP_HEIGHT);
				});
	}

	drawLeftMap() {
		const mapCtx = this.refs.leftmap.getContext("2d");
		const imageCtx = this.refs.image.getContext("2d");
		const lineData = this.state.imageData
			.reduce((prev, curr, index, array) => {
				const sumIndex = Math.floor(index/this.state.imageWidth);

				if (index === 0) prev[sumIndex] = 0;
				if ((index + 1) % this.state.imageWidth === 0) {
					prev[sumIndex] = prev[sumIndex] / this.state.imageWidth;

					if (sumIndex + 1 !== this.state.imageHeight) prev[sumIndex + 1] = 0;
				} else {
					prev[sumIndex] += curr;
				}
				return prev;
			}, []);

		let _ = lineData
			.map(applyThreshold(this.state.thresholdLeft))
			.reduce((prev, curr, index) => {
				const len = prev.length;
				if (prev[len - 1] != null && curr === prev[len - 1].value) {
					prev[len - 1].count += 1;
					prev[len - 1].to = index;
				} else {
					prev[len] = {
						count: 1,
						from: index,
						value: curr
					};
				}

				return prev;
			}, [])
			.forEach((bar) => {
				if (bar.value === 120) {
					imageCtx.strokeStyle = "green";
					console.log(bar)
					imageCtx.rect(0, bar.from, this.state.imageWidth, bar.count);
					imageCtx.stroke()
				}
			})

		lineData
			.map(applyThreshold(this.state.thresholdLeft))
			.forEach((value, index) => {
				mapCtx.fillStyle = `rgb(${value}, ${value}, ${value})`;
				mapCtx.fillRect(0, index, LEFT_MAP_WIDTH, 1);
			});
	}

	render() {
		return (
			<div className="app">
				<header>
					<Slider
						lowerLimit={this.state.thresholdLeft/255}
						upperLimit={2}
						onChange={(value) => {
							if (value.refresh) {
								this.setState({thresholdLeft: value.lowerLimit * 255});
							}
						}}/>
					<Slider
						lowerLimit={this.state.threshholdTop/255}
						upperLimit={2}
						onChange={(value) => {
							if (value.refresh) {
								console.log(value.lowerLimit)
								this.setState({threshholdTop: value.lowerLimit * 255});
							}
						}}/>
				</header>

				<canvas id="topmap" ref="topmap"></canvas>
				<canvas id="leftmap" ref="leftmap"></canvas>
				<canvas id="image" ref="image"></canvas>
			</div>
		);
	}
}

export default App;
