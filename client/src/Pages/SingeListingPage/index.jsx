import React, { Component } from 'react'
import './index.css'

import { Breadcrumb, Button } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'

class SingleListingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      loading: true,
      chatButton: null
    }
  }

  componentDidMount() {
    // get the id for creating new chat
    const listing_id = this.props.match.params.id
    const cookie = document.cookie
    let userId;
    if(cookie.includes("token")){
        userId = JSON.parse(atob(cookie.split(".")[1])).userId
    }


    this.setState({
      listing_id: listing_id
    })
    // get the data for one listing
    // need seller data
    const url = `/api/listings/${listing_id}`
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res,
          loading: false
        })

        if(res.owner_id===userId){
            this.setState({chatButton: "This is your own listing."})
        } else if (userId) {
            this.setState({chatButton: <Button disabled={this.state.loading}
                onClick={() => this.props.createChat(this.state.data)}>
                Chat
            </Button>})
        } else {
            this.setState({chatButton:<Link to="/login"><Button>Log in to chat!</Button></Link>})

        }


      })
      .catch(err => console.log(err))
  }

  render() {
    // layout the page
    // get dynamic data for single page
    let [, path1, path2, path3] = this.props.history.location.pathname.split('/');
    let img;
    if (!this.state.loading) {
      img = this.state.data.img_public_id || null
    }

    return (
      <>

        <Breadcrumb className="breadcrumb-position">
          <Breadcrumb.Item as="div" href="#" >
            <Link to={`/${path1}`}>{path1}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item as="div" href="#">
            <Link to={`/${path1}/${this.state.loading ? null : this.state.data.category}`}>{this.state.loading ? null : this.state.data.category}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item as="div" active>
            {this.state.loading ? null : this.state.data.item}
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="container singleListing" >
          <div className="col">
            <div className="itemImage">
              <div style={{ height: "280px",
                            width: "280px",
                            border: "1px solid lightgrey",
                            margin: " 10px auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundImage: (img ? `url(http://res.cloudinary.com/dk0bjhiu9/image/upload/v1/${img})` : null),
                            backgroundColor: "lightgrey",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "auto 100%",
                            backgroundPosition: "center"}}>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="row userInfo">
              <div >
                <img src="https://apprecs.org/gp/images/app-icons/300/41/com.mybox.tothetop.jpg" style={{ width: "100px", height: "100px" }} />
              </div>
              <div className="text-left col user">
                <h4>{this.state.loading ? null : this.state.data.owner_info.username}</h4>
                <p>Item location: {this.state.loading ? null : this.state.data.location}</p>

              </div>
            </div>
            <div className="text-left itemInfo" style={{overflowWrap: "anywhere"}}>
              <h3>{this.state.loading ? null : this.state.data.item}</h3>
              <p className="itemState">Currently {this.state.loading ? null : this.state.data.state}</p>
              <p>{this.state.loading ? null : this.state.data.description}</p>
              {this.state.chatButton}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(SingleListingPage);