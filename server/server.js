require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./db/index");
const port = process.env.PORT ;

const app = express();

app.use(cors());
app.use(express.json());

// Routes

// Get all restaurants
app.get("/restaurants/get-all-restaurants", async (req, res) => {
  try {
    const results = await database.query('SELECT * FROM restaurants ORDER BY id ASC');
    console.log(results.rows);
    res.status(200).json({
      status: true,
      resualts:results.rows.length,
      data:{
      restaurants: results.rows, }
});
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({
      status: false,
      error: 'Internal Server Error',
    });
  }
});


// Get a restaurant (you can use a parameter to specify the restaurant ID or name)
app.get("/restaurants/get-restaurant/:id", async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const result = await database.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
        if (result.rows.length > 0) {
            // If a restaurant is found with the given ID
            res.status(200).json({ 
                status: true,
                restaurant: result.rows[0],
            });
        } else {
            // If no restaurant is found with the given ID
            res.status(404).json({ 
                status: false,
                message: 'Restaurant not found',
            });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({
            status: false,
            error: 'Internal Server Error',
        });
    }
});


// Other routes can be added similarly

// For example, to create a new restaurant
app.post("/restaurants/create-restaurant", async (req, res) => {
    try {
        const { name, location, price_range } = req.body;

        // Validate that price_range is a valid number
        if (isNaN(price_range)) {
            return res.status(400).json({
                status: false,
                error: 'Invalid value for price_range. Must be a number.',
            });
        }

        const result = await database.query('INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING *', [name, location, price_range]);

        // Check for errors from the database
        if (result.rows.length > 0) {
            const createdRestaurant = result.rows[0];
            res.status(201).json({ 
                status: true,
                restaurant: createdRestaurant,
                message: "Restaurant created successfully"
            });
        } else {
            // Log the error message from the database
            console.error('Error from the database:', result.error);

            res.status(500).json({
                status: false,
                error: 'Failed to create restaurant',
            });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({
            status: false,
            error: 'Internal Server Error',
        });
    }
});


// Update a restaurant
app.put("/restaurants/update-restaurant/:id", async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const { name, location, price_range } = req.body;
        // Check if the restaurant with the given ID exists
        const checkRestaurant = await database.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
        if (checkRestaurant.rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Restaurant not found',
            });
        }

        const result = await database.query('UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING *', [name, location, price_range, restaurantId]);
        if (result.rows.length > 0) {
            const updatedRestaurant = result.rows[0];
            res.status(200).json({
                status: true,
                restaurant: updatedRestaurant,
                message: "Restaurant updated successfully"
            });
        } else {
            res.status(500).json({
                status: false,
                error: 'Failed to update restaurant',
            });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({
            status: false,
            error: 'Internal Server Error',
        });
    } 
});

// Delete A Restaurant
app.delete("/restaurants/delete-restaurant/:id", async (req, res) => {
    try {
        const restaurantId = req.params.id;

        // Check if the restaurant with the given ID exists
        const checkRestaurant = await database.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);

        if (checkRestaurant.rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Restaurant not found',
            });
        }

        // Delete the restaurant
        const result = await database.query('DELETE FROM restaurants WHERE id = $1 RETURNING *', [restaurantId]);

        if (result.rows.length > 0) {
            const deletedRestaurant = result.rows[0];
            res.status(200).json({
                status: true,
                restaurant: deletedRestaurant,
                message: "Restaurant deleted successfully"
            });
        } else {
            res.status(500).json({
                status: false,
                error: 'Failed to delete restaurant',
            });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({
            status: false,
            error: 'Internal Server Error',
        });
    }
});


// Routes


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});




