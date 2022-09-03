import d3 = require('d3')

const width = 500
const height = width

// This is basically top level await at this point lol since
// I'm too lazy to handle errors
async function main() {
  interface postData {
    title: string,
    short_title: string,
    categories: string[],
    word_count: number,
    url: string
  }

  // Fetch data from Jekyll template
  const response = await fetch('../assets/blog-data.json.liquid')
  const data0: postData[] = await response.json()

  interface postTree {
    name: string,
    value: number,
    url: string,
    children: postTree[],
  }

  // Process data to fit the d3.hierarchy format
  let data: postTree = {
    name: "root",
    value: null,
    url: null,
    children: [],
  }

  for (const post of data0) {
    addCategory(data.children, post.categories, post)
  }

  function addCategory(obj: postTree[], categories: string[], post: postData) {
    if (categories.length == 0) {
      let next = {
        name: post.short_title != '' ? post.short_title : post.title,
        value: post.word_count,
        url: post.url,
        children: []
      }
      obj.push(next)
      return
    }
    let category = categories.shift()
    for (let child of obj) {
      if (child.name === category) {
        addCategory(child.children, categories, post)
        return
      }
    }
    let next = {
      name: category,
      value: null,
      url: null,
      children: []
    }
    obj.push(next)
    addCategory(next.children, categories, post)
  }

  // https://observablehq.com/@d3/zoomable-circle-packing
  // d3.pack() calculates the location and radius of each circle
  // Should be type HierarchyCircularNode<postTree> but TS is mad
  const root: d3.HierarchyCircularNode<any> = d3.pack()
      .size([width, height])
      .padding(3)
  // d3.hierarchy() organizes the data into a hierarchy
    (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value))
  let focus = root
  let view: d3.ZoomView
  let color = d3.scaleLinear()
      .domain([0, 3])
      // @ts-ignore (using strings here to represent colors still works)
      .range(["hsl(135,80%,80%)", "hsl(211,80%,80%)"])
      // @ts-ignore
      .interpolate(d3.interpolateHcl)

  // Helpful to call console.log(root) to look at exact structure of data

  const svg = d3.select("#blog-bubbles")
    .append("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .on("click", (event) => zoom(event, root))

  // Must draw circles before text since svgs have z-order based on draw order
  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .style("cursor", "pointer")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("pointer-events", d => d.parent === root ? null : "none")
      .on("mouseover", function() { d3.select(this).attr("stroke", "#000") })
      .on("mouseout", function() { d3.select(this).attr("stroke", null) })
      .on("click", (event, d: d3.HierarchyCircularNode<postTree>) => {
        if (d.children) focus !== d && (zoom(event, d), event.stopPropagation())
        else window.location.href = d.data.url
      })

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
      .text((d: d3.HierarchyCircularNode<postTree>) => d.data.name)

  zoomTo([root.x, root.y, root.r * 2])

  function zoomTo(v: d3.ZoomView) {
    const k = width / v[2]

    view = v

    label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
    node.attr("r", d => d.r * k)
  }

  function zoom(_event: any, d: d3.HierarchyCircularNode<postTree>) {
    const focus0 = focus

    focus = d

    const transition = svg.transition()
        .duration(750)
        .tween("zoom", d => {
          // +5 to ensure that circle is not cut off by svg boundaries
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + 5])
          return t => zoomTo(i(t))
        })

    // Only allow nodes in the next layer to be clicked
    node.attr("pointer-events", "none")
    node.filter(d => d.parent === focus)
      .attr("pointer-events", null)

    // @ts-ignore
    label.filter(function(d) { return d.parent === focus || this.style.display === "inline" })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        // @ts-ignore
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline" })
        // @ts-ignore
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none" })
  }
}

main()
