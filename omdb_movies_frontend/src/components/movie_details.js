import React, { Component } from 'react';
import { Layout, Row, Col, Typography, Button } from 'antd';
import { EditOutlined, EllipsisOutlined, HeartOutlined, EyeOutlined, HeartFilled } from '@ant-design/icons';
import CircleProgressBar from './CircleProgressBarBase';
import Modal from 'antd/lib/modal/Modal';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export default class MovieDetails extends Component {
    state = {
        data: undefined
    }

    componentDidMount(){
        this.fetchData();
    }
    

    fetchData(){
        fetch(`https://api.themoviedb.org/3/movie/${this.props.id}/external_ids?api_key=${process.env.REACT_APP_TMDB_API_KEY}`).then(res=> res.json())
        .then(data=>{
            fetch(`http://omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&i=${data.imdb_id}`).then(res=> res.json())
            .then(data=>{
                this.setState({data});
            })
        })
    }

    markFav(tmdb_id){
        const self = this;
        const user = self.props.currentuser;
        const token = user['token'];
        let user_id = user['url'].split('/');
        user_id = parseInt(user_id[user_id.length - 2]);
        console.log(user_id);
        console.log(tmdb_id);

        let url = 'http://localhost:8000/api';

        fetch(url+'/favorites/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({tmdb_id,user: user_id})
        }).then(res=> res.json())
        .then(res=>{
            if(Array.isArray(res.tmdb_id)){
                self.props.errorCB(res.tmdb_id[0]);
            }else{
                fetch(url+'/users/current/',{
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Token ${token}`
                    }
                }).then(res=>res.json())
                .then(res=> {
                    res.token = token;
                    window.localStorage.setItem('CurrentUser', JSON.stringify(res));
                    self.props.currentuserCB(res);
                })
            }
        })
    }

	render() {
        let {data} = this.state;
        let ratings;
        if(data && data.Ratings){
            ratings = data.Ratings.map((v,i)=>{
                let rating = v.Value;
                let obj = {
                    Source: v.Source,
                }
                if(rating.includes('%')){
                    let val = rating.split('%')[0];
                    obj.val = val
                }
                if(rating != undefined && rating.indexOf('/') > -1){
                    if(rating.split('/')[1] == 10){
                        let val = rating.split('/')[0]*10;
                        obj.val = val
                    }
                    if(rating.split('/')[1] == 100){
                        let val = rating.split('/')[0];
                        obj.val = val
                    }
                }
                return obj;
            });
        }

        
        
        return (
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                {data ? <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                    <div className="site-card-wrapper" style={{minHeight: 700}}>
                        <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                            <Col xs={24} md={8} lg={6} xl={6}>
                                <img alt={data.Title} src={data.Poster} style={{width:'100%'}}/>
                            </Col>
                            <Col xs={24} md={16} lg={18} xl={18}>
                                <Typography>
                                    <Title>{data.Title}</Title>
                                    <Paragraph>
                                    </Paragraph>
                                    
                                    <Title level={4}>{data.Production != 'N/A' ? `Produced by: ${data.Production}` : `Directed by: ${data.Director}`} | Release date: {data.Released}</Title>
                                    <Paragraph>
                                        <Text strong>
                                            Total Runtime: {data.Runtime} {data.BoxOffice != 'N/A' && ` | ${data.BoxOffice}`} {data.Genre != 'N/A' && ` | Genre: ${data.Genre}`}
                                        </Text>
                                        <br/>
                                        <br/>
                                        <Button type={this.props.currentuser && this.props.currentuser.favorites.includes(this.props.id.toString()) ? "danger" : "default"} key={"fav_icon"+ this.props.id} onClick={()=>this.markFav(this.props.id)}  title="mark as favorite?" shape="circle" icon={<HeartFilled />} size={'large'} />
                                        <br/>
                                        <br/>
                                        <Title level={5}>Overview</Title>
                                        {data.Plot}

                                    </Paragraph>
                                    <Row>
                                        <Col xs={24} md={12} lg={8} xl={8}>
                                            
                                            <Row>
                                                {
                                                ratings != undefined && 
                                                    ratings.map((v,i)=>{
                                                        let jsx = [];
                                                        if(v.Source == "Internet Movie Database"){
                                                            jsx.push(<Col xs={7} key={i.toString()}>
                                                                <div className={'rating'}>
                                                                <img alt="imdb_log" src="/images/imdb_logo.png" style={{width:'100%', borderRadius: '4px 4px 0 0'}} />
                                                                <CircleProgressBar
                                                                    className={'moviePoularityPerc'}
                                                                    trailStrokeColor="white"
                                                                    strokeColor="#6BA9FF"
                                                                    percentage={v.val}
                                                                />
                                                                </div>
                                                            </Col>)
                                                        }
                                                        if(v.Source == "Rotten Tomatoes"){
                                                            jsx.push(<Col xs={7} key={i.toString()}>
                                                                <div className={'rating'}>
                                                                <img alt="rotten-tomatoes_logo" src="/images/rotten-tomatoes_logo.png" style={{width:'100%', borderRadius: '4px 4px 0 0'}} />
                                                                <CircleProgressBar
                                                                    className={'moviePoularityPerc'}
                                                                    trailStrokeColor="white"
                                                                    strokeColor="#6BA9FF"
                                                                    percentage={v.val}
                                                                />
                                                                </div>
                                                            </Col>)
                                                        }
                                                        if(v.Source == "Metacritic"){
                                                            jsx.push(<Col xs={7} key={i.toString()}>
                                                                <div className={'rating'}>
                                                                <img alt="Metacritic_logo" src="/images/Metacritic_logo.png" style={{width:'100%', borderRadius: '4px 4px 0 0'}} />
                                                                <CircleProgressBar
                                                                    className={'moviePoularityPerc'}
                                                                    trailStrokeColor="white"
                                                                    strokeColor="#6BA9FF"
                                                                    percentage={v.val}
                                                                />
                                                                </div>
                                                            </Col>)
                                                        }
                                                        return jsx;
                                                    })
                                                }
                                            </Row>

                                        </Col>
                                    </Row>
                                    
                                </Typography>
                            </Col>
                        </Row>
                    </div>
                </div> : 'Loading...'}
            </Content>
        );
	}
}
