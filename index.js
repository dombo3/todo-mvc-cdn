class TodoItem {
  constructor(name) {
    this.name = name;
    this.isCompleted = false;
  }
}


class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
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
      items.push(new TodoItem(state.input))
      return {
        items: items,
        input: '',
      }
    });
  }

  render() {

    return (
      <div>
        <h1>todos</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            value={this.state.input}
            type="text"
          />
        </form>
        <Items items={this.state.items} />
        {this.state.items.length === 0 ? 
          null : <Footer items={this.state.items} />}
      </div>
    );
  }
}

class Items extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const items = this.props.items.map((item, i) => <li key={i}>{item.name}</li>)
    return (
      <ul>{items}</ul>
    );
  }
}

function Footer(props) {
  const itemCount = props.items.length;
  return <p>{itemCount} {itemCount > 1 ? "items" : "item"} left</p>;
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));