import React = require('react')
import ReactDOM = require('react-dom')
// moving away from mathjs
import math = require('mathjs')

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
// scale input and output to [0, 1]
function hsv2rgb(h: number, s: number, v: number) {
  let f = (n: number, k=(n + h * 6) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  return [f(5), f(3), f(1)]
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}


// Draws on JS canvas pixel by pixel using given calcResult function
function GraphCanvas(props: { exp: string, range: number, center: number[], calcResult: Function }) {
  const canvasRef = React.useRef(null)
  const f = math.compile(props.exp)
  const pixels = 100
  const scale = pixels / props.range

  function draw(ctx) {
    let imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height)
    for (let i = 0; i < imageData.data.length / 4; i += 1) {
      const x = (i % imageData.width - imageData.width / 2) / scale + props.center[0]
      // JS has no integer division??
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


function DomainColorInput(props: { exp: { cur: string, display: string }, setExp, graphSettings }) {
  var exp = props.exp
  var setExp = props.setExp
  var graphSettings = props.graphSettings
  return (
    <>
      <p>
        <a href='https://github.com/jerzh/IdeaProjects/blob/master/untitled/src/TransformationAnimation.java'>My domain coloring app</a> was one of the first big projects I made back when I first learned how to code in Java. This is a tribute to that project.
      </p>
      <p>
        The resolution right now is fairly low (100x100 pixels) because anything larger will create significant lag while attempting to compute the pixel values. I've scaled up the image 3x to make it more visible. I'm currently working on porting this project over to WebGL, where it should be able to take advantage of your computer's graphics card to render the image more efficiently.
      </p>
      <form>
        <label>
          Enter expression in terms of z and c:
          <input type='text' value={exp.cur}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
            setExp({
              ...exp,
              'cur': event.currentTarget.value,
            })
            try {
              const f = math.compile(event.currentTarget.value)
              math.complex(f.evaluate({
                z: math.complex(1, 1),
                c: math.complex(graphSettings.cRe, graphSettings.cIm)
              }))
              // If expression doesn't compile, don't set display expression.
              // This allows the user to change the expression without the plot suddenly disappearing.
              setExp({
                ...exp,
                'display': event.currentTarget.value,
              })
            } catch (e) {
              // console.log(e)
            }
          }} />
        </label>
      </form>
    </>
  )
}


// Big component for entire DomainColor mini-project
// Should definitely split this into multiple components
function DomainColor(props: {}) {
  // Lol this is kinda messy, maybe move to Fresh or something
  // Actually how about I put everything in an object so I'm not passing
  // around a bajillion variables and I can actually split up the components
  const [exp, setExp] = React.useState({
    'cur': 'z^2 + c',
    'display': 'z^2 + c',
  })

  const [graphSettings, setGraphSettings] = React.useState({
    // Does JS have a builtin enum type?
    'graphTypeIndex': 0,
    'range': 3,
    'cRe': 0,
    'cIm': 0,
    'centerX': 0,
    'centerY': 0,
  })

  const graphTypeNames = ['Domain coloring', 'Julia set', 'Mandelbrot set']
  const maxIter = 20

  return (
    <>
      <DomainColorInput exp={exp} setExp={setExp} graphSettings={graphSettings} />
      <div className='section center horizontal'>
        <div className='center2 vertical description fixed-height'>
          {/* Draw GraphCanvas with the relevant calcResult function. (There is most definitely a better way)
          Lol rip the vim syntax coloring is confused */}
          {exp && (graphTypeNames[graphSettings.graphTypeIndex] === 'Domain coloring' &&
            <GraphCanvas exp={exp.display} range={graphSettings.range}
              center={[graphSettings.centerX, graphSettings.centerY]}
              calcResult={(x: number, y: number, f) => {
                const res = math.complex(f.evaluate({
                  z: math.complex(x, y),
                  c: math.complex(graphSettings.cRe, graphSettings.cIm)
                })).toPolar()
                return hsv2rgb(res.phi / (2 * Math.PI), sigmoid(res.r), 1)
              }}
            />
          || graphTypeNames[graphSettings.graphTypeIndex] == 'Julia set' &&
            <GraphCanvas exp={exp.display} range={graphSettings.range}
              center={[graphSettings.centerX, graphSettings.centerY]}
              calcResult={(x: number, y: number, f) => {
                let z = math.complex(x, y)
                const c = math.complex(graphSettings.cRe, graphSettings.cIm)
                let count = 0
                while (z.toPolar().r < 2 && count < maxIter) {
                  count += 1
                  z = math.complex(f.evaluate({
                    z: z,
                    c: c
                  }))
                }
                return count !== maxIter ? hsv2rgb(count / maxIter, 1, 1) : [0, 0, 0]
              }}
            />
          || graphTypeNames[graphSettings.graphTypeIndex] === 'Mandelbrot set' &&
            <GraphCanvas exp={exp.display} range={graphSettings.range}
              center={[graphSettings.centerX, graphSettings.centerY]}
              calcResult={(x: number, y: number, f) => {
                let z = math.complex(graphSettings.cRe, graphSettings.cIm)
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
              }}
            />
          )}
        </div>
        {/* All the inputs */}
        <div className='center vertical spaced description'>
          <div className='center horizontal'>
            <label> range: </label>
            <input type='number' min='0.05' max='10' step='0.05' value={graphSettings.range}
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                setGraphSettings({
                  ...graphSettings,
                  'range': parseFloat(event.currentTarget.value),
                })
              }}
            />
          </div>
          <div className='center horizontal'>
            <label> center: </label>
            <input type='number' min='-10' max='10' step='0.05' value={graphSettings.centerX}
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                setGraphSettings({
                  ...graphSettings,
                  'centerX': parseFloat(event.currentTarget.value),
                })
              }}
            />
            <input type='number' min='-10' max='10' step='0.05' value={graphSettings.centerY}
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                setGraphSettings({
                  ...graphSettings,
                  'centerY': parseFloat(event.currentTarget.value),
                })
              }}
            />
          </div>
          <div className='center2 vertical'>
            {graphTypeNames[graphSettings.graphTypeIndex] === 'Mandelbrot set' &&
              <label> z = {math.complex(graphSettings.cRe, graphSettings.cIm).toString()} </label>
            ||
              <label> c = {math.complex(graphSettings.cRe, graphSettings.cIm).toString()} </label>
            }
            <div className='center horizontal'>
              <input type='number' min='-10' max='10' step='0.05' value={graphSettings.cRe}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  setGraphSettings({
                    ...graphSettings,
                    'cRe': parseFloat(event.currentTarget.value),
                  })
                }}
              />
              <input type='number' min='-10' max='10' step='0.05' value={graphSettings.cIm}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  setGraphSettings({
                    ...graphSettings,
                    'cIm': parseFloat(event.currentTarget.value),
                  })
                }}
              />
            </div>
          </div>
          <div className='center horizontal'>
            <div className='center vertical'>
              {graphTypeNames.map((typeName, typeIndex) => (
                <div key={typeName}>
                  <input type='radio' name='graph-type' value={typeName}
                    checked={typeIndex === graphSettings.graphTypeIndex}
                    onChange={() => {
                      setGraphSettings({
                        ...graphSettings,
                        'graphTypeIndex': typeIndex,
                        'cRe': 0,
                        'cIm': 0,
                      })
                    }} />
                  <label> {typeName} </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


// TODO: Update to React 18
ReactDOM.render(
  <DomainColor />,
  document.getElementById('domain-color')
)
