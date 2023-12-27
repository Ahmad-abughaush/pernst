import axios from "axios";

const RestaurantFinder = axios.create({
  baseURL: "http://localhost:4000/restaurants"
});

export default RestaurantFinder;

