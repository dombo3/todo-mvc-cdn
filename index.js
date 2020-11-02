class TodoItem {
  constructor(name) {
    this._id = TodoItem.generateId();
    this.name = name;
    this.isCompleted = false;
  }

  static generateId() {
    if (!this.latestId) {
      return this.latestId = 1;
    } else {
      this.latestId++
      return this.latestId;
    }
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      input: '',
      applicationState: "all"
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAppState = this.handleAppState.bind(this);
    this.handleItems = this.handleItems.bind(this);
  }

  handleChange(event) {
    //Conditional Rendering?//
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

  handleAppState(state) {
    this.setState({
      applicationState: state,
    })
  }

  handleItems(items) {
    this.setState({
      items: items,
    })
  }

  render() {
    let items = this.state.items;
    if (this.state.applicationState === "onlyActive") {
      items = items.filter(item => !item.isCompleted);
    } else if (this.state.applicationState === "onlyCompleted") {
      items = items.filter(item => item.isCompleted)
    }

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
        <Items items={items} handleItems={this.handleItems} />
        {this.state.items.length === 0 ?
          null : <Footer items={this.state.items} appState={this.handleAppState} />}
      </div>
    );
  }
}

class Items extends React.Component {
  constructor(props) {
    super(props)
  }

  toggle(e, id) {
    const items = this.props.items.slice();
    const currentItem = items.find(item => item._id === id);
    const index = items.indexOf(currentItem);
    currentItem.isCompleted = !currentItem.isCompleted;
    items[index] = currentItem;
    this.props.handleItems(items);
  }

  render() {
    const items = this.props.items.map((item, i) =>
      <li key={i}>
        <label htmlFor={item._id}>
          <input id={item._id} name="isItemDone" type="checkbox" onChange={(e) => this.toggle(e, item._id)} checked={item.isCompleted}></input>{item.name}
        </label>
        <button>DeleteMe</button>
      </li>
    );
    return (
      <ul>{items}</ul>
    );
  }
}

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(e, state) {
    this.props.appState(state);
  }

  render() {
    const itemCount = this.props.items.filter(item => !item.isCompleted).length;
    return (
      <div>
        <p>{itemCount} {itemCount > 1 ? "items" : "item"} left</p>
        {/*Create Enums for ApplicationState?*/}
        <button onClick={(e) => this.handleClick(e, "all")}>All</button>
        <button onClick={(e) => this.handleClick(e, "onlyActive")}>Active</button>
        <button onClick={(e) => this.handleClick(e, "onlyCompleted")}>Completed</button>
      </div>
    );
  }
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));