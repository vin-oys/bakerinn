import React, { Component } from 'react'
import Switch from 'react-bootstrap/esm/Switch';
import { Route, withRouter } from 'react-router-dom';

import CarouselV2 from '../../Components/Carousel/test';
import Discovery from '../../Components/Discovery';
import IntroBanner from '../../Components/IntroBanner';
import CategoryPage from '../CategoryPage';
import SingleListingPage from '../SingeListingPage';

import './index.css'

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastestListing: null,
      ingredient: null,
      equipment: null
    }
  }


  componentDidMount() {
    const url = '/api/listings'

    // sort by category
    // suggestion random ten

    fetch(url)
      .then(res => res.json())
      .then(res => {
        res.reverse()
        let ingredient = null;
        let equipment = null;
        if (res) {
          ingredient = res.filter((item) => {
            return item.category === "ingredient"
          })
          equipment = res.filter((item) => {
            return item.category === "equipment"
          })
        }
        this.setState({
          lastestListing: res,
          ingredient: ingredient,
          equipment: equipment
        })
      })
  }

  render() {
    let { isLoggedIn } = this.props;
    return (
      <>
        <Switch style={{ padding: "0" }}>
          <Route exact path="/homepage">

            {isLoggedIn
              ? (<Discovery />)
              : (<IntroBanner />)
            }

            <div style={{ marginTop: "150px", marginBottom: "60px" }}>
              <CarouselV2 title="Freshest offers"
                lastestListing={this.state.lastestListing} />
            </div>

            <div className="carou-group">
              <CarouselV2 title="New ingredients"
                headerLink="/homepage/ingredient"
                lastestListing={this.state.ingredient} />
            </div>

            <div className="carou-group">
              <CarouselV2 title="New equipment"
                headerLink="/homepage/equipment"
                lastestListing={this.state.equipment} />
            </div>

            <div className="carou-group">
              <CarouselV2 title="Suggestions"
                lastestListing={this.state.lastestListing} />
            </div>

          </Route>

          <Route path="/homepage/listing/:id">
            <SingleListingPage createChat={this.props.createChat} />
          </Route>

          <Route path="/homepage/ingredient">
            <CategoryPage listings={this.state.ingredient} category="ingredient" />
          </Route>
          <Route path="/homepage/equipment">
            <CategoryPage listings={this.state.equipment} category="equipment" />
          </Route>
        </Switch>
      </>
    )
  }
}

export default withRouter(HomePage)