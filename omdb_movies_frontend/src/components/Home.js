import React, { Component } from 'react';
import { Layout, Row, Col, message } from 'antd';
import InfiniteScroll from "react-infinite-scroll-component";
import MovieCards from './MovieCard';
import SearchBox from './SeachBox';

const { Content } = Layout;

export default class Home extends Component {
    state = {
        hasMore: true,
        data: {},
        movies: [],
        value: ''
    }

    componentDidMount(){
        this.fetchData(1);
    }
    

    fetchData(page){
        let {movies} = this.state;
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=${page}`).then(res=> res.json())
        .then(data=>{
          this.setState({data});
          this.setState({movies: movies.concat(data.results)})
        })
    }

    fetchMoreData = () => {
        if (this.state.data.page >= this.state.data.total_pages) {
          this.setState({ hasMore: false });
          return;
        }
        this.fetchData(this.state.data.page+1);
    };

    suggestionParser = data =>
        data.results.map(item => ({
        description: item.title,
        id: item.id
        })
    );

    fetchUrl = ({ searchQuery }) => `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;


	render() {
        let { data, movies, value } = this.state;

        if(data){
            return (
                <div>
                    <div style={{width: '100%', marginTop: 20, padding: '10%', background: "url('./images/home_bg.png') no-repeat center center"}}>
                        <SearchBox/>
                    </div>

                    <Content className="site-layout" style={{ padding: '0 50px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                            <InfiniteScroll
                                dataLength={movies.length}
                                next={this.fetchMoreData}
                                key
                                hasMore={this.state.hasMore}
                                loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
                                endMessage={
                                    <p style={{ textAlign: "center" }}>
                                    <b>Thats all movies for today!</b>
                                    </p>
                                }
                            >
                                
                                        <div className="site-card-wrapper">
                                            <Row gutter={[8, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                                    
                                                {   
                                                    movies.length > 0 && movies.map((item,i)=>{
                                                        if(item && item.release_date){
                                                            return <MovieCards errorCB={(data)=> message.error(data)} currentuserCB={this.props.currentuserCB} currentuser={this.props.currentuser} key={i.toString()} item={item}/>
                                                        }else{
                                                            return ''
                                                        }
                
                                                    })
                                                }
                                            </Row>
                                        </div>
                            </InfiniteScroll>
                        </div>
                    </Content>
                </div>
            );
        }else{
            return(
                <div>Loading...</div>
            )
        }
	}
}
