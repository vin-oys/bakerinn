import React from 'react'
import { Link } from 'react-router-dom';
import ListingCard from '../ListingCard'

export default function ListingDetail(props) {
  let { edit, allListings } = props;
  let path = edit ? "/dashboard/listing/" : "/homepage/listing/"

  // link path needs to be updated to be using item id
  return (
    <>
      {allListings
        ? allListings.map((listing, index) => {
          return (
            <div className="test">
              <Link key={index} to={`${path}${listing._id}`} style={{ textDecoration: "none" }}>
                <ListingCard listing={listing} />
              </Link>
            </div>
          )
        })
        : "nothing to show here"}
    </>
  )
}
