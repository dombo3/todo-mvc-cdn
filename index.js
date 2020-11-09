const APP_ALL = "all";
const APP_ACTIVE = "active";
const APP_COMPLETED = "completed";
const ENTER_KEYCODE = 13;
const ESCAPE_KEYCODE = 27;

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
      filter: APP_ALL
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
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

  handleFilter(filter) {
    this.setState({
      filter: filter,
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
    
    const toggleAll = document.querySelector("#toggle-all")
    toggleAll.checked = !items.find(item => !item.isCompleted);

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
    const items = this.state.items.slice();
    const index = items.indexOf(item);
    items.splice(index, 1);
    this.setState({
      items: items
    })
  }

  clearCompleted() {
    const items = this.state.items.slice();
    const activeItems = items.filter(item => !item.isCompleted);
    this.setState({
      items: activeItems,
    })
  }

  toggleAll(event) {
    const items = this.state.items.slice();
    items.forEach(item => item.isCompleted = event.target.checked);
    this.setState({
      items: items,
    })
  }

  render() {
    let items = this.state.items;

    items.forEach(item => {
      if (item.name === "") {
        this.handleDelete(item);
      };
    })

    if (this.state.filter === APP_ACTIVE) {
      items = items.filter(item => !item.isCompleted);
    } else if (this.state.filter === APP_COMPLETED) {
      items = items.filter(item => item.isCompleted)
    }

    let activeItemCount = items.filter(item => !item.isCompleted).length
    let completedItemCount = items.filter(item => item.isCompleted).length

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
              <input id="toggle-all" className="toggle-all" type="checkbox" onClick={this.toggleAll.bind(this)}></input>
              <label htmlFor="toggle-all"></label>
              <ul id="todo-list">{items}</ul>
              <Footer 
                filter={this.state.filter}
                activeItemCount = {activeItemCount}
                completedItemCount = {completedItemCount}
                handleFilter={this.handleFilter}
                clearCompleted={this.clearCompleted}
              />
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
    this.editTodoInput = React.createRef();
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
    item.name = this.state.editText;
    this.setState({
      editText: '',
    })
    this.props.onSave(item);
  }

  handleKeyDown(item, event) {
    if (event.which === ENTER_KEYCODE) {
      this.handleSave(item);
    } else if (event.which === ESCAPE_KEYCODE) {
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

  componentDidUpdate(props) {
    if (props.item.isEditable) {
      const element = this.editTodoInput.current;
      element.focus();
      element.setSelectionRange(element.value.length, element.value.length)
    }
  }

  render() {
    const item = this.props.item;
    const listItem = item.isEditable
      ? <li>
        <input
          id="todo-edit"
          type="text"
          ref={this.editTodoInput}
          value={this.state.editText}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleSave.bind(this, item)}
          onKeyDown={this.handleKeyDown.bind(this, item)}
        />
      </li>
      : <li>
        <input
          type="checkbox"
          onChange={(e) => this.props.onToggle(item, e)}
          checked={item.isCompleted}
          className={"todo-toggle"}
          id={"todo-toggle-" + item._id}
        />
        <label className="todo-toggle-label" htmlFor={"todo-toggle-" + item._id}></label>
        <label
          id="todo-label"
          className={item.isCompleted ? "completed" : undefined}
          onDoubleClick={this.doubleClick.bind(this, item)}>
          {item.name}
        </label>
        <button
          id="delete"
          onClick={(e) => this.props.onDelete(item, e)}></button>
      </li>

    return listItem;
  }

}

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("rendered Footer");
    console.log(this.props.completedItemCount)
    console.log(this.props.activeItemCount);
    return (
      <footer>
        <p>{this.props.activeItemCount} {this.props.activeItemCount > 1 ? "items" : "item"} left</p>
        <Filters>
          <FilterButton filterName={APP_ALL} filter={this.props.filter} handleClick={(e) => this.props.handleFilter(APP_ALL, e)}/>
          <FilterButton filterName={APP_ACTIVE} filter={this.props.filter} handleClick={(e) => this.props.handleFilter(APP_ACTIVE, e)}/>
          <FilterButton filterName={APP_COMPLETED} filter={this.props.filter} handleClick={(e) => this.props.handleFilter(APP_COMPLETED, e)}/>
        </Filters>
        {this.props.completedItemCount > 0 && <button id="clear-all" onClick={this.props.clearCompleted} >Clear completed</button>}
      </footer>
    );
  }
}

class Filters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="filters">{this.props.children}</div>
  }
}

class FilterButton extends React.Component {
  constructor(props) {
    super(props);
  }

  capitalize(filterName) {
    return filterName.charAt(0).toUpperCase() + filterName.slice(1)
  }

  render() {
    let filterName = this.props.filterName;
    return <button 
              id={filterName}
              className={this.props.filter === filterName ? "selected" : undefined} 
              onClick={this.props.handleClick}>
              {this.capitalize(filterName)}
            </button>
  }
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));