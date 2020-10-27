import React from 'react'
import { Breadcrumb, CardDeck } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ListingDetail from '../../Components/ListingDetail'

export default function CategoryPage({listings, category}) {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item as="div" href="#">
          <Link to={`/homepage`}>homepage</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item as="div" active>
          {category}
        </Breadcrumb.Item>
      </Breadcrumb>

      <h4>All listings for {category}</h4>
      <CardDeck>
        <ListingDetail allListings={listings}/>
      </CardDeck>
    </div>
  )
}