// Fetches restaurant json

async function fetchRestaurants() {
  const run = async () => {
    const response = await fetch(
      "https://api.yelp.com/v3/businesses/search?term&latitude=40.757339&longitude=-73.985992&radius=200&categories=restaurants&price=3&open_now=true&sort_by=rating"
    );

    if (!response.ok) {
      const message = `An error has occured with yelp API: ${response.status}`;
      throw new Error(message);
    }
    const restaurants = await response.json();

    console.log(restaurants);
  };
}

// fetchRestaurants()
// .then((restaurants) => {
//     console.log(restaurants);
//   })
//   .catch((error) => {
//     error.message;
//   });

module.exports = fetchRestaurants;
