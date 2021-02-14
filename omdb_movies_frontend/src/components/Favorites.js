import React, { Component } from 'react';
import { Layout, message, Row} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCards from './MovieCard';
import { Redirect } from '@reach/router';

const { Content } = Layout;

export default class Favorites extends Component {
    state = {
        data: [],
        favorites: []
    }
    componentDidMount(){
        let favorites = JSON.parse(localStorage.getItem('CurrentUser'))['favorites'];
        this.setState({favorites})
        let promises = [];
        favorites.map(v=> promises.push(fetch(`https://api.themoviedb.org/3/movie/${v}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)));

        // console.log(favorites);

        const awaitJson = (responses) => Promise.all(responses.map(response => {
            if(response.ok) return response.json();
            throw new Error(response.statusText);
        }));

        let self = this;

        Promise.all(promises)
        .then(awaitJson)
        .then((data)=> {
            self.setState({data});
        })
        .catch(function handleError(error) {
          console.log("Error" + error);
        });

    }

    fetchUrl = ({ searchQuery }) => `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;

	render() {
        let {data, favorites} = this.state;
        if((favorites.length > 0)){
            return (
                <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                    {data ? <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                        <div className="site-card-wrapper" style={{minHeight: 700}}>
                                    
                            <div className="site-card-wrapper">
                                <Row gutter={[8, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                        
                                    {   
                                        data.length > 0 && data.map((item,i)=>{
                                            if(item && item.release_date){
                                                return <MovieCards errorCB={(data)=> message.error(data)} currentuserCB={this.props.currentuserCB} currentuser={this.props.currentuser} key={i.toString()} item={item}/>
                                            }else{
                                                return ''
                                            }

                                        })
                                    }
                                </Row>
                            </div>

                        </div>
                    </div> : 'Loading...'}
                </Content>
            );
        }else{
            return (
                <Content className="site-layout" style={{ padding: '0 50px' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                        No favorite items
                    </div>
                </Content>
            )
        }
		
	}
}
