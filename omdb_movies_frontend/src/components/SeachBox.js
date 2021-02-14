import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ReactFetchAutocomplete from 'react-fetch-autocomplete';
import { Redirect } from '@reach/router';



export default class SearchBox extends Component {
    state = {
        value: '',
        redirect_url: undefined
    }

    suggestionParser = data =>
        data.results.map(item => ({
        description: item.title,
        id: item.id
        })
    );

    fetchUrl = ({ searchQuery }) => `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;


	render() {
        let { value, redirect_url } = this.state;
        
        if (redirect_url) {
            return <Redirect to={redirect_url} />
        }else{
            return(
                <ReactFetchAutocomplete
                                    value={value}
                    onChange={(value)=>this.setState({value})}
                    onSelect={suggestion => {
                        this.setState({redirect_url: `/movies/${suggestion.id}`})
                    }}
                    fetchUrl={this.fetchUrl}
                    suggestionParser={this.suggestionParser}
                >
                    {({ inputProps, getSuggestionProps, suggestions, error, loading }) => {
                    if (error) return <div>Error</div>;
                    return (
                        <Row>
                            <Col xs={24}>
                                <div>
                                    <input className={'searchInput'}
                                        {...inputProps({ placeholder: 'Search a movie' })}
                                    />
                                    {value && (
                                    <button className={'clearSearch'} onClick={() => this.setState({value: ''})}>x</button>
                                    )}
                                </div>
                                {loading && <div style={{position: 'absolute'}}>LOADING...</div>}
                                {suggestions.length > 0 && (
                                    <div className={'suggestionDropdown'}>
                                    {suggestions.map(suggestion => (
                                        <div className={"SuggestionItem"} style={{background: suggestion.active ? 'lightgrey' : '#fff'}} {...getSuggestionProps(suggestion)}>
                                            {suggestion.description}
                                        </div>
                                    ))}
                                    </div>
                                )}
                            </Col>
                        </Row>
                    );
                    }}
                </ReactFetchAutocomplete>
            )   
        }

	}
}
