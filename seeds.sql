USE bamazonDB;

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
    ("The Tennant of Wildfell Hall", "Books", 5.99, 120),
    ("Diaper Genie", "Baby", 59.99, 40),
    ("Ice Scraper", "Automotive", 12.59, 20),
    ("Denim Jacket", "Women's Clothing", 74.99, 10),
    ("Annette Hanshaw's Greatest Hits", "Music", 8.99, 6),
    ("Die Hard", "Movies", 10.99, 10),
    ("New and Selected Poems, Volume One", "Books", 15.99, 25),
    ("Howl's Moving Castle", "Books", 5.99, 50),
    ("Howl's Moving Castle", "Movies", 9.99, 50),
    ("S as in Sullivan, Maxine", "Music", 9.99, 4);

INSERT INTO departments (department_name, over_head_costs) VALUES
    ("Automotive", 300.00),
    ("Baby", 450.00),
    ("Books", 400.00),
    ("Movies", 350.00),
    ("Music", 200.00),
    ("Women's Clothing", 250.00);