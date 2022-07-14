import React = require('react')
import ReactDOM = require('react-dom')
import ReactQuery = require('react-query')

// Unwrap response
async function handleSearchResponse(response) {
  if (!response.ok) {
    throw new Error(response.error)
  }
  return await response.json()
}


// Component for a single cat image
function CatImage(props: { name: string, id: string }) {
  // const queryClient = ReactQuery.useQueryClient()

  async function fetchCatImage(id: string) {
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
      // query.error.message doesn't seem to exist?
      <p>An error occurred :/</p>
    )
  }

  return (
    <img height='200px' src={query.data.url} />
  )
}


// One row of search results (image + desc)
function CatAPIRow(props: {breed: CatBreed}) {
  const breed = props.breed
  return (
    <div className='section center horizontal'>
      <div className='center vertical description'>
        <div className='center horizontal'>
          {breed.reference_image_id &&
            <CatImage name={breed.name} id={breed.reference_image_id} />
          ||
            <p> (No image provided) </p>
          }
        </div>
      </div>
      <div className='center vertical description'>
        <p> <a href={breed.wikipedia_url}>
          <b> {breed.name} </b>
        </a> </p>
        <p> {breed.description || '(No description provided)'} </p>
      </div>
    </div>
  )
}


const queryClient = new ReactQuery.QueryClient()

// Hooray for TypeScript! Interfaces are good and type definitions
// are also good
interface CatBreed {
  name: string,
  reference_image_id: string,
  wikipedia_url: string,
  description: string
}

interface CatState {
  query: string
  breedData: CatBreed[]
}

// Big component for the entire CatAPI mini-project
// Template goes like React.Component<props, state>
class CatAPI extends React.Component<{}, CatState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      query: '',
      breedData: null
    }
  }

  // https://oeis.org/search?q=id:A${event.target.value}&fmt=json
  // Original idea was OEIS, but site does not support CORS
  // This was fun to debug lol

  // Instant updates! (a deliberate design decision to demonstrate React)
  async handleChange(event: { target: { value: string } }) {
    this.setState({ query: event.target.value })

    const breedData = await this.fetchCatSearch(event.target.value)
      .catch()
    this.setState({ breedData: breedData })
  }

  async fetchCatSearch(query: string) {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${query}`)
    const data = await handleSearchResponse(response)
    return data.slice(0, 10)
  }

  // https://stackoverflow.com/questions/41374572/how-to-render-an-array-of-objects-in-react
  // Functional programming o.o
  render() {
    return (
      <ReactQuery.QueryClientProvider client={queryClient}>
        <form>
          <label>
            Enter query (e.g. 'american'):
            <input type='text' value={this.state.query} onChange={this.handleChange.bind(this)}/>
          </label>
        </form>
        {this.state.breedData && this.state.breedData.length > 0 &&
          this.state.breedData.map(breed =>
            <CatAPIRow key={breed.name} breed={breed} />
          )
        || this.state.query !== '' &&
          <div className='center horizontal full-width'>
            <p> (No search results found) </p>
          </div>
        }
      </ReactQuery.QueryClientProvider>
    )
  }
}


// TODO: Update to React 18
ReactDOM.render(
  <CatAPI />,
  document.getElementById('cat-api')
)
