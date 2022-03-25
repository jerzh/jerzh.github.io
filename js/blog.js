// Sources:
// https://observablehq.com/@d3/zoomable-circle-packing
// https://github.com/invinciblejackalope/networkvis/blob/master/blogger/static/blogger/index.js

const width = 500;
const height = width;

// Processing data to fit the d3.hierarchy format
let data = {
  name: "root",
  children: []
};

for (const post of data0) {
  addCategory(data.children, post.categories, post);
}

function addCategory(obj, categories, post) {
  if (categories.length == 0) {
    next = {
      name: post.short_title != '' ? post.short_title : post.title,
      value: post.word_count,
      url: post.url
    };
    obj.push(next);
    return;
  }
  let category = categories.shift();
  for (let child of obj) {
    if (child.name === category) {
      addCategory(child.children, categories, post);
      return;
    }
  }
  next = {
    name: category,
    children: []
  }
  obj.push(next);
  addCategory(next.children, categories, post);
}


// d3.pack() calculates the location and radius of each circle
const root = d3.pack()
    .size([width, height])
    .padding(3)
// d3.hierarchy() organizes the data into a hierarchy
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value));
let focus = root;
let view;
let color = d3.scaleLinear()
    .domain([0, 3])
    .range(["hsl(135,80%,80%)", "hsl(211,80%,80%)"])
    .interpolate(d3.interpolateHcl);

// Helpful to call console.log(root) to look at exact structure of data

const svg = d3.select("#blog-bubbles")
  .append("svg")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .style("display", "block")
    .style("margin", "0 -14px")
    .on("click", (event) => zoom(event, root));

// Must draw circles before text since svgs have z-order based on draw order
const node = svg.append("g")
  .selectAll("circle")
  .data(root.descendants().slice(1))
  .join("circle")
    .style("cursor", "pointer")
    .attr("fill", d => d.children ? color(d.depth) : "white")
    .attr("pointer-events", d => d.parent === root ? null : "none")
    .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
    .on("mouseout", function() { d3.select(this).attr("stroke", null); })
    .on("click", (event, d) => {
      if (d.children) focus !== d && (zoom(event, d), event.stopPropagation());
      else window.location = d.data.url;
    });

const label = svg.append("g")
    .style("font", "10px sans-serif")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    // This is how you vertically align text on given coordinates
    .attr("dominant-baseline", "middle")
  .selectAll("text")
  .data(root.descendants())
  .join("text")
    .style("fill-opacity", d => d.parent === root ? 1 : 0)
    .style("display", d => d.parent === root ? "inline" : "none")
    .text(d => d.data.name);

zoomTo([root.x, root.y, root.r * 2]);

function zoomTo(v) {
  const k = width / v[2];

  view = v;

  label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  node.attr("r", d => d.r * k);
}

function zoom(event, d) {
  const focus0 = focus;

  focus = d;

  const transition = svg.transition()
      .duration(750)
      .tween("zoom", d => {
        // +5 to ensure that circle is not cut off by svg boundaries
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + 5]);
        return t => zoomTo(i(t));
      });

  // Only allow nodes in the next layer to be clicked
  node.attr("pointer-events", "none")
  node.filter(d => d.parent === focus)
    .attr("pointer-events", null)

  label.filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
    .transition(transition)
      .style("fill-opacity", d => d.parent === focus ? 1 : 0)
      .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
      .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
}


// d3.forceSimulation() animates the circles with "forces"
var simulation = d3.forceSimulation()
    .nodes(root.descendants().slice(1))
    .force('center_force', d3.forceCenter())
    .force('gravity_force', d3.forceManyBody().strength(1))
    .force('collide_force', d => d3.forceCollide(d.r))

// function to update the locations of the nodes after every tick
function tickActions() {
  node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  label.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
}

// add above function to simulation
simulation.on('tick', tickActions)
