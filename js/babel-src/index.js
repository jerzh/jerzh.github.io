async function handleSearchResponse(response) {
  if (!response.ok) {
    throw new Error(response.error)
  }
  return await response.json()
}


function CatImage(props) {
  const queryClient = ReactQuery.useQueryClient()

  async function fetchCatImage(id) {
    const response = await fetch(`https://api.thecatapi.com/v1/images/${id}`)
    return await handleSearchResponse(response)
  }

  const query = ReactQuery.useQuery(['catImage', props.name],
    () => fetchCatImage(props.id),
    { staleTime: Infinity, refetchOnWindowFocus: false })

  if (query.isLoading) {
    return (
      <p>Loading image...</p>
    )
  }

  if (query.isError) {
    return (
      <p>Error: {query.error.message}</p>
    )
  }

  return (
    <img height='200px' src={query.data.url} />
  )
}


class CatAPI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      breedData: null
    }
  }

  // https://oeis.org/search?q=id:A${event.target.value}&fmt=json
  // Original idea was OEIS, but site does not support CORS
  async handleChange(event) {
    this.setState({ query: event.target.value })

    const breedData = await this.fetchCatSearch(event.target.value)
      .catch(e => null)
    this.setState({ breedData: breedData })
  }

  async fetchCatSearch(query) {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${query}`)
    const data = await handleSearchResponse(response)
    return data.slice(0, 10)
  }

  // https://stackoverflow.com/questions/41374572/how-to-render-an-array-of-objects-in-react
  render() {
    return (
      <div className='section'>
        <h1> The Cat API (now with React Query!) </h1>
        <form>
          <label>
            Enter query (e.g. Siamese):
            <input type='text' value={this.state.query} onChange={this.handleChange.bind(this)}/>
          </label>
        </form>
        {this.state.breedData && this.state.breedData.length > 0
          && this.state.breedData.map(breed => (
          <div key={breed.name} className='center'>
            <div className='vertical-center description'>
              <div className='horizontal-center'>
                {breed.reference_image_id &&
                  <CatImage name={breed.name} id={breed.reference_image_id} />
                || <p> (No image provided) </p>}
              </div>
            </div>
            <div className='vertical-center description'>
              <p> <a href={breed.wikipedia_url}>
                <b> {breed.name} </b>
              </a> </p>
              <p> {breed.description || '(No description provided)'} </p>
            </div>
          </div>
        )) || this.state.query !== '' &&
          <div className='horizontal-center full-width'>
            <p> (No search results found) </p>
          </div>
        }
      </div>
    )
  }
}


const queryClient = new ReactQuery.QueryClient()

// Spotify API would be interesting but I have no secure way of storing API keys
// on GitHub Pages
function Game() {
  return (
    <ReactQuery.QueryClientProvider client={queryClient}>
      <CatAPI />
    </ReactQuery.QueryClientProvider>
  )
}


ReactDOM.render(
  <Game />,
  document.getElementById('index-game')
)
