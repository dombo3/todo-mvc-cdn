class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items : [{name: "Do dishes"}, {name: "Do laundry"}],
      input: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      input: event.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState((state) => {
      const items = state.items.slice();
      items.push({name: state.input})
      return {
        items : items,
      }
    });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <h1>todos</h1>
        <form onSubmit={this.handleSubmit}>
          <input 
          onChange = {this.handleChange}
          value={this.state.input}
          type="text"
          />
        </form>
        <Items items={this.state.items}/>
      </div>
    );
  }
}

class Items extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props.items);
    const items = this.props.items.map((item,i) => <li key={i}>{item.name}</li>)
    return (
      <ul>{items}</ul>
    );
  }
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));