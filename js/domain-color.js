// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
// scale input and output to [0, 1]
function hsv2rgb(h, s, v) {
  let f = (n, k = (n + h * 6) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

  return [f(5), f(3), f(1)];
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function GraphCanvas(props) {
  const canvasRef = React.useRef(null);
  const f = math.compile(props.exp);
  const pixels = 100;
  const scale = pixels / props.range;

  function draw(ctx) {
    let imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < imageData.data.length / 4; i += 1) {
      const x = (i % imageData.width - imageData.width / 2) / scale;
      const y = (imageData.height / 2 - Math.trunc(i / imageData.width)) / scale;
      const col = props.calcResult(x, y, f);
      imageData.data[4 * i + 0] = 255 * col[0];
      imageData.data[4 * i + 1] = 255 * col[1];
      imageData.data[4 * i + 2] = 255 * col[2];
      imageData.data[4 * i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw(ctx);
  }, [draw]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    id: "graph-canvas",
    height: pixels,
    width: pixels
  });
}

function DomainColor(props) {
  const [exp, setExp] = React.useState('z^2+c');
  const [displayExp, setDisplayExp] = React.useState('z^2+c');
  const [range, setRange] = React.useState(3);
  const [cRe, setCRe] = React.useState(0);
  const [cIm, setCIm] = React.useState(0);
  const [graphType, setGraphType] = React.useState('Domain coloring');
  const graphTypes = ['Domain coloring', 'Julia set', 'Mandelbrot set'];
  const maxIter = 20;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/invinciblejackalope/IdeaProjects/blob/master/untitled/src/TransformationAnimation.java"
  }, "My domain coloring app"), " was one of the first big projects I made back when I first learned how to code in Java. This is a tribute to that project."), /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement("label", null, "Enter expression in terms of z and c:", /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: exp,
    onChange: () => {
      setExp(event.target.value);

      try {
        f = math.compile(event.target.value);
        math.complex(f.evaluate({
          z: math.complex(1, 1),
          c: math.complex(cRe, cIm)
        }));
        setDisplayExp(event.target.value);
      } catch (e) {// console.log(e)
      }
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "section center horizontal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "center2 vertical description fixed-height"
  }, exp && (graphType === 'Domain coloring' && /*#__PURE__*/React.createElement(GraphCanvas, {
    exp: displayExp,
    range: range,
    calcResult: (x, y, f) => {
      const res = math.complex(f.evaluate({
        z: math.complex(x, y),
        c: math.complex(cRe, cIm)
      })).toPolar();
      return hsv2rgb(res.phi / (2 * Math.PI), sigmoid(res.r), 1);
    }
  }) || graphType === 'Julia set' && /*#__PURE__*/React.createElement(GraphCanvas, {
    exp: displayExp,
    range: range,
    calcResult: (x, y, f) => {
      let z = math.complex(x, y);
      const c = math.complex(cRe, cIm);
      let count = 0;

      while (z.toPolar().r < 2 && count < maxIter) {
        count += 1;
        z = math.complex(f.evaluate({
          z: z,
          c: c
        }));
      }

      return count !== maxIter ? hsv2rgb(count / maxIter, 1, 1) : [0, 0, 0];
    }
  }) || graphType === 'Mandelbrot set' && /*#__PURE__*/React.createElement(GraphCanvas, {
    exp: displayExp,
    range: range,
    calcResult: (x, y, f) => {
      let z = math.complex(cRe, cIm);
      const c = math.complex(x, y);
      let count = 0;

      while (z.toPolar().r < 2 && count < maxIter) {
        count += 1;
        z = math.complex(f.evaluate({
          z: z,
          c: c
        }));
      }

      return count !== maxIter ? hsv2rgb(count / maxIter, 1, 1) : [0, 0, 0];
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "center vertical spaced description"
  }, /*#__PURE__*/React.createElement("div", {
    className: "center horizontal"
  }, /*#__PURE__*/React.createElement("label", null, " range: "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0.05",
    max: "10",
    step: "0.05",
    value: range,
    onChange: () => setRange(event.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "center2 vertical"
  }, graphType === 'Mandelbrot set' && /*#__PURE__*/React.createElement("label", null, " z = ", math.complex(cRe, cIm).toString(), " ") || /*#__PURE__*/React.createElement("label", null, " c = ", math.complex(cRe, cIm).toString(), " "), /*#__PURE__*/React.createElement("div", {
    className: "center horizontal"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "-10",
    max: "10",
    step: "0.05",
    value: cRe,
    onChange: () => setCRe(event.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "-10",
    max: "10",
    step: "0.05",
    value: cIm,
    onChange: () => setCIm(event.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "center horizontal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "center vertical"
  }, graphTypes.map(type => /*#__PURE__*/React.createElement("div", {
    key: type
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "graph-type",
    value: type,
    checked: type === graphType,
    onChange: () => {
      setCRe(0);
      setCIm(0);
      setGraphType(type);
    }
  }), /*#__PURE__*/React.createElement("label", null, " ", type, " "))))))));
}

ReactDOM.render( /*#__PURE__*/React.createElement(DomainColor, null), document.getElementById('domain-color'));