import React, { useEffect, useState } from 'react'
import { useLocation, withRouter, useHistory } from 'react-router-dom'
import './index.css'



function SearchResults({ searchInput }) {
    let history = useHistory()
    let query = new URLSearchParams(useLocation().search)
    let searchQueryTemp = query.get("q")

    let [searchQuery, setSearchQuery] = useState(searchQueryTemp)
    let [listingsHTML, setListingsHTML] = useState(null)
    let [usersHTML, setUsersHTML] = useState(null)

    useEffect(()=>{
        if (searchInput) {
            setSearchQuery(searchInput)
        }
    },[searchInput])

    useEffect(()=>{

      let searchListingsUrl="/api/search/listings?q="+searchQuery
      let searchUsersUrl="/api/search/users?q="+searchQuery

      fetch(searchListingsUrl)
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            let listingsHTMLTemp = res.map((item)=>{
                return (<div className="indiv-listing-search-result" onClick={()=>{goToListingsPage(item._id)}}>
                    <div className="indiv-listing-top">
                        <div className="indiv-listing-name"><h5>{item.item}</h5> <span>for {item.option}</span></div>
                        <div><h5>${item.price}</h5> </div>
                    </div>

                    <div className="indiv-listing-state">currently {item.state}</div>
                    <p>{item.description}</p>
                    </div>)
            })

            if(listingsHTMLTemp.length==0){
                listingsHTMLTemp = "No listings match your search."
            }

            setListingsHTML(listingsHTMLTemp)

        })

      fetch(searchUsersUrl)
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            let usersHTMLTemp = res.map((item)=>{
                return (<div>{item.username}</div>)
            })

            if(usersHTMLTemp.length==0){
                usersHTMLTemp = "No users match your search."
            }

            setUsersHTML(usersHTMLTemp)

        })

    }, [searchQuery])

    function goToListingsPage(listing_id){
        history.push("/homepage/listing/"+listing_id)

    }

    return (<div className="all-results">
                <div className="search-results">
                <h3>Users</h3>
                {usersHTML}
                </div>
                <div className="search-results">
                <h3>Listings</h3>
                {listingsHTML}
                </div>
            </div>)







}


export default withRouter(SearchResults)