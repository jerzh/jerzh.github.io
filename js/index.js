var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function handleSearchResponse(response) {
  if (!response.ok) {
    throw new Error(response.error);
  }
  return response.json();
}

var Game = function (_React$Component) {
  _inherits(Game, _React$Component);

  function Game(props) {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

    _this.state = {
      value: '',
      info: null
    };
    return _this;
  }

  // https://oeis.org/search?q=id:A${event.target.value}&fmt=json
  // Original idea was OEIS, but site does not support CORS


  _createClass(Game, [{
    key: 'handleChange',
    value: function handleChange(event) {
      var _this2 = this;

      this.setState({
        value: event.target.value
      });

      fetch('https://api.thecatapi.com/v1/breeds/search?q=' + event.target.value).then(function (response) {
        return handleSearchResponse(response);
      }).then(function (data) {
        if (data.length == 0) {
          throw new Error('No search results found');
        }
        if (!data[0].reference_image_id) {
          throw new Error('No image found');
        }
        return data[0].reference_image_id;
      }).then(function (id) {
        return fetch('https://api.thecatapi.com/v1/images/' + id);
      }).then(function (response) {
        return handleSearchResponse(response);
      }).then(function (data) {
        return _this2.setState({
          info: data
        });
      }).catch(function (error) {
        // console.log(error);
      });
    }

    // https://stackoverflow.com/questions/41374572/how-to-render-an-array-of-objects-in-react
    // Bug: Some cat breeds do not have associated reference images

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          ' The Cat API '
        ),
        React.createElement(
          'form',
          null,
          React.createElement(
            'label',
            null,
            'Enter query (e.g. Siamese):',
            React.createElement('input', { type: 'text', value: this.state.value, onChange: this.handleChange.bind(this) })
          )
        ),
        this.state.info && this.state.info.breeds && React.createElement(
          'div',
          { className: 'center' },
          React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement(
              'div',
              null,
              ' ',
              this.state.info.breeds[0].name,
              ' '
            ),
            React.createElement('img', { height: '200px', src: this.state.info.url })
          )
        )
      );
    }
  }]);

  return Game;
}(React.Component);

ReactDOM.render(React.createElement(Game, null), document.getElementById('index-game'));