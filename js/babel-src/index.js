async function handleSearchResponse(response) {
  if (!response.ok) {
    throw new Error(response.error)
  }
  return await response.json()
}

// Bug: Typing 'as' at the right speed may lead to an Abyssinian cat being
// displayed alongside a description of the Asian Semi-longhair.
class CatAPI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      breedData: null,
      imageUrl: null
    }
  }

  // https://oeis.org/search?q=id:A${event.target.value}&fmt=json
  // Original idea was OEIS, but site does not support CORS
  async handleChange(event) {
    this.setState({ query: event.target.value })

    const breedData = await this.fetchCatSearch(event.target.value)
      .catch(e => null)
    if (!breedData) return  // If not found, keep last result
    this.setState({ breedData: breedData })

    if (!breedData.reference_image_id) {
      this.setState({ imageUrl: null })
      return
    }
    const imageUrl = await this.fetchCatImage(breedData.reference_image_id)
      .catch(e => null)
    this.setState({ imageUrl: imageUrl })
  }

  async fetchCatSearch(query) {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${query}`)
    const data = await handleSearchResponse(response)
    if (data.length == 0) {
      throw new Error('No search results found')
    }
    return data[0]
  }

  async fetchCatImage(id) {
    const response = await fetch(`https://api.thecatapi.com/v1/images/${id}`)
    const data = await handleSearchResponse(response)
    return data.url
  }

  // https://stackoverflow.com/questions/41374572/how-to-render-an-array-of-objects-in-react
  render() {
    return (
      <div className='section'>
        <h1> The Cat API </h1>
        <form>
          <label>
            Enter query (e.g. Siamese):
            <input type='text' value={this.state.query} onChange={this.handleChange.bind(this)}/>
          </label>
        </form>
        {this.state.breedData &&
          <div className='center'>
            <div className='vertical-center'>
              {this.state.imageUrl &&
                <img height='200px' src={this.state.imageUrl} />
              }
            </div>
            <div className='vertical-center description'>
              <p> <b> {this.state.breedData.name} </b> </p>
              <p> {this.state.breedData.description} </p>
            </div>
          </div>
        }
      </div>
    )
  }
}

function Game() {
  return (
    <>
      <CatAPI />
    </>
  )
}

ReactDOM.render(
  <Game />,
  document.getElementById('index-game')
)
