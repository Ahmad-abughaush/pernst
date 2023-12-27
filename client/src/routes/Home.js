import React from 'react'
import Header from "../components/Header"
import AddRestaurant from '../components/AddRestaurant'
import RestaurantsList from '../components/RestaurantsList'
export default function Home() {
  return (
<div>
<Header/>
<AddRestaurant/>
<RestaurantsList/>
</div>
  )
}
