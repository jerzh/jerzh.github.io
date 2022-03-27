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
  const scale = 10;
  const f = math.compile(props.exp);

  function calcResult(x, y) {
    const res = math.complex(f.evaluate({
      z: math.complex(x, y)
    })).toPolar();
    return hsv2rgb(res.phi / (2 * Math.PI), sigmoid(res.r / scale), 1);
  }

  function draw(ctx) {
    let imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < imageData.data.length / 4; i += 1) {
      const x = (i % imageData.width - imageData.width / 2) / scale;
      const y = (imageData.height / 2 - Math.trunc(i / imageData.width)) / scale;
      const col = calcResult(x, y);
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
    height: "200px",
    width: "200px"
  });
}

function DomainColor(props) {
  const [exp, setExp] = React.useState('z');
  const [displayExp, setDisplayExp] = React.useState('z');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/invinciblejackalope/IdeaProjects/blob/master/untitled/src/TransformationAnimation.java"
  }, "My domain coloring app"), " was one of the first big projects I made back when I first learned how to code in Java. This is a tribute to that project."), /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement("label", null, "Enter expression in terms of z:", /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: exp,
    onChange: () => {
      setExp(event.target.value);

      try {
        f = math.compile(event.target.value);
        math.complex(f.evaluate({
          z: math.complex(1, 1)
        }));
        setDisplayExp(event.target.value);
      } catch (e) {// console.log(e)
      }
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vertical-center description"
  }, /*#__PURE__*/React.createElement("div", {
    className: "horizontal-center"
  }, exp && /*#__PURE__*/React.createElement(GraphCanvas, {
    exp: displayExp
  })))));
}

ReactDOM.render( /*#__PURE__*/React.createElement(DomainColor, null), document.getElementById('domain-color'));