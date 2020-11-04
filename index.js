class TodoItem {
  constructor(name) {
    this._id = TodoItem.generateId();
    this.name = name;
    this.isCompleted = false;
    this.isEditable = false;
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
    this.handleToggle = this.handleToggle.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

  handleAppState(state) {
    this.setState({
      applicationState: state,
    })
  }

  handleEdit(item) {
    const items = this.state.items.slice();
    items.forEach(item => item.isEditable = false);
    item.isEditable = true;
    // explain i === item
    // console.log(items.find(i => i === item));
    items[items.indexOf(item)] = item;
    this.setState({
      items: items
    })
  }

  handleToggle(item) {
    const items = this.state.items.slice();
    // const currentItem = items.find(item => item._id === id);
    const index = items.indexOf(item);
    item.isCompleted = !item.isCompleted;
    items[index] = item;
    this.setState({
      items: items
    })
  }

  handleSave(item) {
    const items = this.state.items.slice();
    const index = items.indexOf(item);
    item.isEditable = false;
    items[items.indexOf(item)] = item;
    this.setState({
      items: items
    })
  }

  handleDelete(item) {
    //does not work when use it from handleSave
    const items = this.state.items.slice();
    const index = items.indexOf(item);
    items.splice(index, 1);
    this.setState({
      items: items
    })
  }

  render() {
    let items = this.state.items;

    if (this.state.applicationState === "onlyActive") {
      items = items.filter(item => !item.isCompleted);
    } else if (this.state.applicationState === "onlyCompleted") {
      items = items.filter(item => item.isCompleted)
    }

    items = items.map((item) =>
      <Item
        key={item._id}
        item={item}
        onToggle={this.handleToggle}
        onEdit={this.handleEdit}
        onSave={this.handleSave}
        onDelete={this.handleDelete}
      />
    );

    return (
      <main id="main">
        <h1 className="header">todos</h1>
        <section id="todo-box">
          <form
            onSubmit={this.handleSubmit}
            id="input-form"
          >
            <input
              id="input-bar"
              onChange={this.handleChange}
              value={this.state.input}
              type="text"
              placeholder="What needs to be done?"
            />
          </form>
          {this.state.items.length === 0 
            ? null
            : <section id="todo-list-box">
                <input id="toggle-all" className="toggle-all" type="checkbox"></input>
                <label htmlFor="toggle-all"></label>
                <ul id="todo-list">{items}</ul>
                <Footer items={this.state.items} appState={this.handleAppState} />
              </section>
          }
        </section>
      </main>
    );
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editText: ''
    }
  }

  handleChange(event) {
    this.setState({
      editText: event.target.value,
    })
  }

  handleSave(item) {
    if (!this.state.editText) {
      this.props.onDelete(item);
    }
    item.name = this.state.editText;
    this.setState({
      editText: '',
    })
    this.props.onSave(item);
  }

  handleKeyDown(item, event) {
    if (event.which === 13) {
      this.handleSave(item);
    } else if (event.which === 27) {
      this.props.onSave(item);
      this.setState({
        editText: '',
      })
    }
  }

  doubleClick(item) {
    this.setState({
      editText: item.name
    })
    this.props.onEdit(item);
  }

  render() {
    const item = this.props.item;
    const id = item._id;

    return (
      <li>
        <input
          type="checkbox"
          onChange={this.props.onToggle.bind(this, item)}
          checked={item.isCompleted}
          className="todo-toggle"
          id={"todo-toggle-" + item._id}
        />
        <label className="todo-toggle-label" htmlFor={"todo-toggle-" + item._id}></label>

        {item.isEditable
          ? <input
            type="text"
            value={this.state.editText}
            onChange={this.handleChange.bind(this)}
            onBlur={this.handleSave.bind(this, item)}
            onKeyDown={this.handleKeyDown.bind(this, item)} />
          : <label 
            id="todo-label"
            onDoubleClick={this.doubleClick.bind(this, item)}>
            {item.name}
          </label>}
        <button onClick={this.props.onDelete.bind(this, item)}>DeleteMe</button>
      </li>
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