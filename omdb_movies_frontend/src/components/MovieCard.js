import React from 'react';
import { Card, Col, message } from 'antd';
import { EditOutlined, EllipsisOutlined, HeartOutlined, EyeOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from '@reach/router';

const { Meta } = Card;


const MovieCards = (props) => {
    let movie_poster_path = `http://image.tmdb.org/t/p/w342${props.item.poster_path}`;
    movie_poster_path = movie_poster_path ? movie_poster_path : './images/empty_canvas.png';


    const markFav = (tmdb_id)=>{
        const user = props.currentuser;
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
                props.errorCB(res.tmdb_id[0]);
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
                    props.currentuserCB(res);
                })
            }
        })
    }

    return (
            <Col xs={24} md={8} l={6} xl={4}>
                <Card
                    cover={[
                        <Link key={'cover_link'+props.item.id} to={"/movies/"+props.item.id}>
                            <img
                                alt={props.item.title}
                                src={movie_poster_path}
                            />
                        </Link>
                        ]}
                    actions={props.currentuser != undefined ? [
                        props.currentuser.favorites.includes(props.item.id.toString()) ? <HeartFilled key={"fav_icon"+props.item.id} /> : <HeartOutlined key={"not_fav_icon"+props.item.id} onClick={()=>markFav(props.item.id)} title="mark as favorite?" />,
                        <Link  key={"view_details"+props.item.id} to={"/movies/"+props.item.id}>
                            <EyeOutlined key="view" title="details" />
                        </Link>
                    ] : null}
                >
                    <Meta
                        title={<Link key={'title_link'+props.item.id} to={"/movies/"+props.item.id}>{props.item.title}</Link>}
                        description={[
                            <div key={'title_description'+props.item.id}>
                                <p><b>Release Date: </b>{props.item.release_date}</p>
                                <p>{props.item.overview}</p>
                            </div>
                            ]}
                    />
                </Card>
            </Col>
    );
}

export default MovieCards;