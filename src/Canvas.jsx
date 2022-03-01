import React from "react";
import * as d3 from "d3";

const barPadding = 0.2;
const animationTime = 1000;

export default class Chart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.init();
  }

  init() {
    const { data, width, height, goals } = this.props;

    this.canvas = d3.select(this.canvasRef);
    const context = this.canvas.node().getContext("2d");
    this.detatchedContainer = document.createElement("custom");
    this.dataContainer = d3.select(this.detatchedContainer);

    this.setState({ context });

    this.xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Gls))
      .range([0, width])
      .nice();

    const relData = data.reduce((arr, d) => {
      if (goals === "all" || d.Gls > goals) {
        arr.push(d);
      }
      return arr;
    }, []);

    this.barHeight = height / relData.length;

    this.yScale = d3
      .scaleLinear()
      .domain(d3.extent(relData, (d) => d.id))
      .range([0, height - this.barHeight + this.barHeight * barPadding]);

    this.dataBinding = this.dataContainer
      .selectAll("custom.rect")
      .data(data, (d) => d.id)
      .join("custom")
      .attr("class", "rect")
      .attr("data-goals", (d) => d.Gls)
      .attr("data-player", (d) => d.Player)
      .attr("x", 0)
      .attr("width", (d) => this.xScale(d.Gls))
      .attr("fill", "orange")
      .transition()
      .duration(animationTime)
      .attr("y", (d) => this.yScale(d.id))
      .attr("height", this.barHeight - this.barHeight * barPadding);

    const timer = d3.timer(() => this.draw());
    setTimeout(() => timer.stop(), animationTime);
  }

  updateChart() {
    const { data, height, goals } = this.props;

    const relData = data.reduce((arr, d) => {
      if (goals === "all" || d.Gls > goals) {
        arr.push(d);
      }
      return arr;
    }, []);

    this.barHeight = height / relData.length;

    this.yScale = d3
      .scaleLinear()
      .domain(d3.extent(relData, (d) => d.id))
      .range([0, height - this.barHeight + this.barHeight * barPadding]);

    this.dataBinding = this.dataContainer
      .selectAll("custom.rect")
      .data(data, (d) => d.id)
      .join("custom")
      .attr("class", "rect")
      .attr("data-goals", (d) => d.Gls)
      .attr("data-player", (d) => d.Player)
      .attr("x", 0)
      .attr("width", (d) => this.xScale(d.Gls))
      .attr("fill", "orange")
      .transition()
      .duration(animationTime)
      .attr("y", (d) => this.yScale(d.id))
      .attr("height", this.barHeight - this.barHeight * barPadding);

    const timer = d3.timer(() => this.draw());
    setTimeout(() => timer.stop(), animationTime);
  }

  componentDidUpdate() {
    this.updateChart()
  }

  draw() {
    const { context } = this.state;
    context.fillStyle = "#fff";
    context.rect(0, 0, this.canvas.attr("width"), this.canvas.attr("height"));
    context.fill();

    const elements = this.dataContainer.selectAll("custom.rect");
    elements.each(function () {
      const node = d3.select(this);
      context.beginPath();
      context.fillStyle = node.attr("fill");
      context.rect(
        node.attr("x"),
        node.attr("y"),
        node.attr("width"),
        node.attr("height")
      );
      context.fill();
      context.closePath();
    });
  }

  render() {
    return (
      <canvas
        ref={(el) => (this.canvasRef = el)}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

// const Canvas = ({ data, width, height, goals = "all" }) => {
//   const canvasRef = useRef();

//   useEffect(() => {
//     const canvas = d3.select(canvasRef.current);
//     const context = canvas.node().getContext("2d");
//     const detatchedContainer = document.createElement("custom");
//     const dataContainer = d3.select(detatchedContainer);

//     const xScale = d3
//       .scaleLinear()
//       .domain(d3.extent(data, (d) => d.Gls))
//       .range([0, width])
//       .nice();

//     const relData = data.reduce((arr, d) => {
//       if (goals === "all" || d.Gls > goals) {
//         arr.push(d);
//       }
//       return arr;
//     }, []);

//     const barHeight = height / relData.length;

//     const yScale = d3
//       .scaleLinear()
//       .domain(d3.extent(relData, (d) => d.id))
//       .range([0, height - barHeight + barHeight * barPadding]);

//     const dataBinding = dataContainer
//       .selectAll("custom.rect")
//       .data(data, (d) => d.id);

//     dataBinding
//       .join("custom")
//       .attr("class", "rect")
//       .attr("data-goals", (d) => d.Gls)
//       .attr("data-player", (d) => d.Player)
//       .attr("x", 0)
//       .attr("width", (d) => xScale(d.Gls))
//       .attr("fill", "orange")
//       .transition()
//       .duration(animationTime)
//       .attr("y", (d) => yScale(d.id))
//       .attr("height", barHeight - barHeight * barPadding);

//     function drawCanvas() {
//       context.fillStyle = "#fff";
//       context.rect(0, 0, canvas.attr("width"), canvas.attr("height"));
//       context.fill();

//       const elements = dataContainer.selectAll("custom.rect");
//       elements.each(function () {
//         const node = d3.select(this);
//         context.beginPath();
//         context.fillStyle = node.attr("fill");
//         context.rect(
//           node.attr("x"),
//           node.attr("y"),
//           node.attr("width"),
//           node.attr("height")
//         );
//         context.fill();
//         context.closePath();
//       });
//     }
//     const timer = d3.timer(drawCanvas);
//     setTimeout(() => timer.stop(), animationTime);
//     // d3.timer(drawCanvas)
//   }, [data, goals, height, width]);

//   return <canvas ref={canvasRef} width={width} height={height} />;
// };

// export default Canvas;
