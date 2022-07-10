declare var math: any

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
// scale input and output to [0, 1]
function hsv2rgb(h: number, s: number, v: number) {
  let f = (n: number, k=(n + h * 6) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  return [f(5), f(3), f(1)]
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}


function GraphCanvas(props: { exp: string, range: number, center: number[], calcResult: Function }) {
  const canvasRef = React.useRef(null)
  const f = math.compile(props.exp)
  const pixels = 100
  const scale = pixels / props.range

  function draw(ctx) {
    let imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height)
    for (let i = 0; i < imageData.data.length / 4; i += 1) {
      const x = (i % imageData.width - imageData.width / 2) / scale + props.center[0]
      const y = (imageData.height / 2 - Math.trunc(i / imageData.width)) / scale + props.center[1]
      const col = props.calcResult(x, y, f)
      imageData.data[4 * i + 0] = 255 * col[0]
      imageData.data[4 * i + 1] = 255 * col[1]
      imageData.data[4 * i + 2] = 255 * col[2]
      imageData.data[4 * i + 3] = 255
    }
    ctx.putImageData(imageData, 0, 0)
  }

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    draw(ctx)
  }, [draw])

  return (
    <canvas ref={canvasRef} id='graph-canvas' height={pixels} width={pixels} />
  )
}


function DomainColor(props: {}) {
  const [exp, setExp] = React.useState('z^2+c')
  const [displayExp, setDisplayExp] = React.useState('z^2+c')
  const [range, setRange] = React.useState(3)
  const [cRe, setCRe] = React.useState(0)
  const [cIm, setCIm] = React.useState(0)
  const [graphType, setGraphType] = React.useState('Domain coloring')
  const [centerX, setCenterX] = React.useState(0)
  const [centerY, setCenterY] = React.useState(0)

  const graphTypes = ['Domain coloring', 'Julia set', 'Mandelbrot set']
  const maxIter = 20

  return (
    <>
      <p>
        <a href='https://github.com/invinciblejackalope/IdeaProjects/blob/master/untitled/src/TransformationAnimation.java'>My domain coloring app</a> was one of the first big projects I made back when I first learned how to code in Java. This is a tribute to that project.
      </p>
      <form>
        <label>
          Enter expression in terms of z and c:
          <input type='text' value={exp}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
            setExp(event.currentTarget.value)
            try {
              const f = math.compile(event.currentTarget.value)
              math.complex(f.evaluate({
                z: math.complex(1, 1),
                c: math.complex(cRe, cIm)
              }))
              setDisplayExp(event.currentTarget.value)
            } catch (e) {
              // console.log(e)
            }
          }} />
        </label>
      </form>
      <div className='section center horizontal'>
        <div className='center2 vertical description fixed-height'>
          {exp && (graphType === 'Domain coloring' &&
            <GraphCanvas exp={displayExp} range={range} center={[centerX, centerY]}
              calcResult={(x: number, y: number, f) => {
              const res = math.complex(f.evaluate({
                z: math.complex(x, y),
                c: math.complex(cRe, cIm)
              })).toPolar()
              return hsv2rgb(res.phi / (2 * Math.PI), sigmoid(res.r), 1)
            }} />
          || graphType === 'Julia set' &&
            <GraphCanvas exp={displayExp} range={range} center={[centerX, centerY]}
              calcResult={(x: number, y: number, f) => {
              let z = math.complex(x, y)
              const c = math.complex(cRe, cIm)
              let count = 0
              while (z.toPolar().r < 2 && count < maxIter) {
                count += 1
                z = math.complex(f.evaluate({
                  z: z,
                  c: c
                }))
              }
              return count !== maxIter ? hsv2rgb(count / maxIter, 1, 1) : [0, 0, 0]
            }} />
          || graphType === 'Mandelbrot set' &&
            <GraphCanvas exp={displayExp} range={range} center={[centerX, centerY]}
              calcResult={(x: number, y: number, f) => {
              let z = math.complex(cRe, cIm)
              const c = math.complex(x, y)
              let count = 0
              while (z.toPolar().r < 2 && count < maxIter) {
                count += 1
                z = math.complex(f.evaluate({
                  z: z,
                  c: c
                }))
              }
              return count !== maxIter ? hsv2rgb(count / maxIter, 1, 1) : [0, 0, 0]
            }} />
          )}
        </div>
        <div className='center vertical spaced description'>
          <div className='center horizontal'>
            <label> range: </label>
            <input type='number' min='0.05' max='10' step='0.05' value={range}
              onChange={(event: React.FormEvent<HTMLInputElement>) => setRange(parseFloat(event.currentTarget.value))} />
          </div>
          <div className='center horizontal'>
            <label> center: </label>
            <input type='number' min='-10' max='10' step='0.05' value={centerX}
              onChange={(event: React.FormEvent<HTMLInputElement>) => setCenterX(parseFloat(event.currentTarget.value))} />
            <input type='number' min='-10' max='10' step='0.05' value={centerY}
              onChange={(event: React.FormEvent<HTMLInputElement>) => setCenterY(parseFloat(event.currentTarget.value))} />
          </div>
          <div className='center2 vertical'>
            {graphType === 'Mandelbrot set' &&
              <label> z = {math.complex(cRe, cIm).toString()} </label>
            ||
              <label> c = {math.complex(cRe, cIm).toString()} </label>
            }
            <div className='center horizontal'>
              <input type='number' min='-10' max='10' step='0.05' value={cRe}
                onChange={(event: React.FormEvent<HTMLInputElement>) => setCRe(parseFloat(event.currentTarget.value))} />
              <input type='number' min='-10' max='10' step='0.05' value={cIm}
                onChange={(event: React.FormEvent<HTMLInputElement>) => setCIm(parseFloat(event.currentTarget.value))} />
            </div>
          </div>
          <div className='center horizontal'>
            <div className='center vertical'>
              {graphTypes.map(type => (
                <div key={type}>
                  <input type='radio' name='graph-type' value={type}
                    checked={type === graphType}
                    onChange={() => {
                      setCRe(0)
                      setCIm(0)
                      setGraphType(type)
                    }} />
                  <label> {type} </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ReactDOM.render(
  <DomainColor />,
  document.getElementById('domain-color')
)
