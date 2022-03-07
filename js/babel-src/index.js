function handleSearchResponse(response) {
  if (!response.ok) {
    throw new Error(response.error);
  }
  return response.json();
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      info: null
    };
  }

  // https://oeis.org/search?q=id:A${event.target.value}&fmt=json
  // Original idea was OEIS, but site does not support CORS
  handleChange(event) {
    this.setState({
      value: event.target.value
    });

    fetch(`https://api.thecatapi.com/v1/breeds/search?q=${event.target.value}`)
      .then(response => handleSearchResponse(response))
      .then(data => {
        if (data.length == 0) {
          throw new Error('No search results found')
        }
        if (!data[0].reference_image_id) {
          throw new Error('No image found')
        }
        return data[0].reference_image_id
      })
      .then(id => fetch(`https://api.thecatapi.com/v1/images/${id}`))
      .then(response => handleSearchResponse(response))
      .then(data => this.setState({
        info: data
      }))
      .catch(function(error) {
          // console.log(error);
      });
  }

  // https://stackoverflow.com/questions/41374572/how-to-render-an-array-of-objects-in-react
  // Bug: Some cat breeds do not have associated reference images
  render() {
    return (
      <div>
        <h1> The Cat API </h1>
        <form>
          <label>
            Enter query (e.g. Siamese):
            <input type='text' value={this.state.value} onChange={this.handleChange.bind(this)}/>
          </label>
        </form>
        {this.state.info && this.state.info.breeds &&
          <div className='center'>
            <div className='text-center'>
              <div> {this.state.info.breeds[0].name} </div>
              <img height='200px' src={this.state.info.url} />
            </div>
          </div>
        }
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('index-game')
);
