import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


function isSearched(searchTerm) {
    return function (item) {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result : null,
            searchTerm: DEFAULT_QUERY,
        };

        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
    }

    setSearchTopStories(result){
        this.setState({result});
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    onDismiss(id) {
        console.log(id);

        function isNotId(item) {
            return item.objectID !== id;
        }

        const updatedList = this.state.list.filter(isNotId);
        this.setState({list: updatedList});

    }

    render() {

        const {result, searchTerm} = this.state;

        if (!result) return null;

        return (
            <div className="page">
                <div className="interactions">
                <Search value={searchTerm}
                        onChange={this.onSearchChange}>

                    Search
                </Search>
                </div>
                <Table list={result.hits}
                       pattern={searchTerm}
                       onDismiss={this.onDismiss}/>
            </div>
        )
    }
}

const Search = ({value, onChange, children}) =>
        <form>
            {children}
            <input type="text"
                   value={value}
                   onChange={onChange}
            />
        </form>;

class Table extends Component {
    render() {

        const {list, pattern, onDismiss} = this.props;

        return (
            <div className="table">
                {list.filter(isSearched(pattern)).map(item => {
                    return <div key={item.objectID} className="table-row">

                   <span style={{ width: '40%' }}>
                  <a href={item.url}>{item.title}</a>
                </span>
                        <span style={{ width: '30%' }}>
                  {item.author}
                </span>
                        <span style={{ width: '10%' }}>
                  {item.num_comments}
                </span>
                        <span style={{ width: '10%' }}>
                  {item.points}
                </span>
                        <span style={{ width: '10%' }}>
                  <Button
                      onClick={() => onDismiss(item.objectID)}
                      className="button-inline"
                  >
                    Dismiss
                  </Button>
                       </span>

                    </div>;
                })}
            </div>
            )
    }
}

class Button extends Component {
    render() {
        const {onClick, className='', children, } = this.props;
        return (
            <button className="button-inline"
                onClick={onClick}
                className={className}
                type="button"
                >{children}</button>
        )
    }
}

export default App;
