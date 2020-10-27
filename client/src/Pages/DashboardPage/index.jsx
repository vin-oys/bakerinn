import React, { Component } from 'react'

import ListingTabs from '../../Components/ListingTabs'
import ListingDetailPage from '../../Pages/ListingDetailPage';
import EditSingleListingPage from '../../Pages/EditSingleListingPage';
import { Switch, Route } from 'react-router-dom';
import './index.css'
import ProtectedRoute from '../../Components/ProtectedRoute';

export default class DashboardPage extends Component {

  constructor(props) {
    super(props);

    // retrieve userID in cookie
    const cookie = document.cookie
    let userId = ""
    if (cookie) {
      userId = JSON.parse(atob(cookie.split(".")[1])).userId
    }

    this.state = {
      userId: userId,
      available: [],
      loan: [],
      borrowing: []
    }
  }

  componentDidMount() {
    this.fetchUserBorrowesListing()
    this.fetchUserPostedListing()
    this.fetchUserLendingListing()
  }

  fetchUserPostedListing = async () => {
    const url = `/api/listings/user/${this.state.userId}`;

    try {
      let res = await fetch(url)
      let userListings = await res.json()

      this.setState({
        available: userListings
      })
    } catch (err) {
      console.log(err);
    }
  }

  fetchUserBorrowesListing = async () => {
    const url = `/api/listings/user/${this.state.userId}/borrowed`;
    try {
      let res = await fetch(url)
      let borrowedListings = await res.json()

      this.setState({
        borrowing: borrowedListings
      })
    } catch (err) {
      console.log(err);
    }
  }

  fetchUserLendingListing = async () => {
    const url = `/api/listings/user/${this.state.userId}/loan`;
    try {
      let res = await fetch(url)
      let loanListings = await res.json()

      this.setState({
        loan: loanListings
      })
    } catch (err) {
      console.log(err);
    }
  }

  addNewListingToState = (obj) => {
    this.setState(prevState => ({
      available: [...prevState.available, obj]
    }))
  }

  render() {
    // console.log(this.state);
    return (
      <div>

        <Switch style={{ padding: "0" }}>
          <ProtectedRoute exact path="/dashboard">
            <div className="dashboard-header">
              <h3>Welcome back, {this.props.user}.</h3>
            </div>

            <div style={{ height: "600px" }}>
              <ListingTabs
                user={this.props.user}
                userId={this.state.userId}
                updateParentState={this.addNewListingToState}
                borrowing={this.state.borrowing}
                borrowNo={this.state.borrowing.length}
                listingNo={this.state.available.length}
                lendNo={this.state.loan.length}
              />
            </div>
          </ProtectedRoute>




          {/* available */}
          <Route path="/dashboard/available">
            <ListingDetailPage allListings={this.state.available}
              nextpage={"loan"}
              edit={true} />
          </Route>




          {/* On loan */}
          <Route path="/dashboard/loan">
            <ListingDetailPage allListings={this.state.loan}
              nextpage={"available"}
              edit={true} />
          </Route>




          <Route path="/dashboard/listing/:id" component={EditSingleListingPage} />

        </Switch>

      </div>
    )
  }
}