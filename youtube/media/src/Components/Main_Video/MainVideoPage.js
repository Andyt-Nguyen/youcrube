import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../Nav/NavBar'
import MainVideo from './SubComponents/MainVideo'
import VideoTitle from './SubComponents/VideoTitle';
import UserInteraction from './SubComponents/UserInteraction';
import UserInfo from './UserInfo/UserInfo';
import RecommendedVideos from './SubComponents/RecommendedVid/RecommendedVideos';
import Video from './SubComponents/RecommendedVid/SubComponents/Video';
import { VideoSkeletonLoader } from '../Common'
import TitleLoader from './SubComponents/Loader/TitleLoader'
import UserInteractionLoader from './SubComponents/Loader/UserInteractionLoader'
import UserInfoLoader from './SubComponents/Loader/UserInfoLoader'
import MainVideoLoader from './SubComponents/Loader/MainVideoLoader'

import './css/main_video.css'
import './css/media_query_471.css'
import './css/media_query_995.css'

export default class MainVideoPage extends Component {
    constructor() {
        super()
        this.state = {
            recVideos: null,
            mainvVideoContent: null
        }
    }

    saveToUserHistory() {
        try {
            const jwt = JSON.parse(localStorage.getItem('auth_token')).token
            const user_id = JSON.parse(localStorage.getItem('auth_token')).user_id
            const { videoId:video_id } = this.props.match.params

            fetch('http://localhost:5000/api/users/saveHistory', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({user_id,video_id})
            }).then(  res => res.json())
              .then(  data => console.log(data))
              .catch( err => console.log(err))
        } catch(error) {

            console.log("User not authed")

        }
        
    }

    getRecVideos(videoId) {
        fetch(`http://localhost:5000/api/query/recommended/${videoId}`)
            .then( res => res.json() )
            .then( recVideos => this.setState({ mainvVideoContent:recVideos[1],recVideos:recVideos[0] }))
    }

    renderRecVideos() {
        return this.state.recVideos.map( a => (
            <Link key={a.videoId} style={{textDecoration:'none', color:'#000'}} to={`/watch_vod/${a.videoId}`}>
                <Video 
                    img={a.thumbnail} 
                    title={a.title} 
                    channel_name={a.channelName} 
                    views={a.views}/>
            </Link>
        ))
    }
    
    renderSkeletonLoader() {
        const placeholder = [1,2,3,4,5,6,7]
        return placeholder.map( a => <VideoSkeletonLoader key={a} displayFlex={true}/>)
    }

    
    componentWillReceiveProps(nextProps){
        this.setState({recVideos:null, mainvVideoContent:null})
        if (this.props.match.params.videoId !== nextProps.match.params.videoId) {
            this.getRecVideos(nextProps.match.params.videoId);
            window.scrollTo(0, 0)
        }
    }

    
    componentDidMount() {
        const videoId = this.props.match.params.videoId
        this.getRecVideos(videoId)
        window.scrollTo(0, 0)
        // this.saveToUserHistory()
    }

    render() {
        return (
            <React.Fragment>
            <NavBar />
            <div className="container">
                <div className="split_main_rec">
                    <div className="video_and_comments_container">
                        {
                            this.state.mainvVideoContent == null
                            ? <MainVideoLoader />
                            : <MainVideo videoId={this.props.match.params.videoId} />
                        }
                        
                        {
                            this.state.mainvVideoContent == null
                            ? <TitleLoader />
                            : <VideoTitle title={this.state.mainvVideoContent.title} />
                        }
                        
                        { 
                            this.state.mainvVideoContent == null
                            ? <UserInteractionLoader />
                            : <UserInteraction 
                                 views={this.state.mainvVideoContent.viewCount}/>
                        }

                        {
                            this.state.mainvVideoContent == null
                            ? <UserInfoLoader />
                            : <UserInfo
                                subCount={this.state.mainvVideoContent.subCount}
                                desc={this.state.mainvVideoContent.desc}
                                thumbnail={this.state.mainvVideoContent.thumbnail} 
                                username={this.state.mainvVideoContent.channelName} 
                                publisedAt={this.state.mainvVideoContent.published}/>
                        }
                       
                        
                    </div>
                    <RecommendedVideos>
                        {
                            this.state.recVideos == null
                            ? this.renderSkeletonLoader()
                            : this.renderRecVideos()
                        }
                    </RecommendedVideos>
                </div>
            </div>
            </React.Fragment>
        )
    }
}