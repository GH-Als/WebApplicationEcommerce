CREATE DATABASE masadb;

use masadb;


select * from user;
select * from product;
select * from customer_order;
select * from order_items;

delete from product;

INSERT INTO product (name, image_url, price, stock_quantity) VALUES
('Vanilla Cola', 'assets/Drinks/Cola1.png', 15.00, 50),
('Cherry Cola', 'assets/Drinks/cola2.png', 15.00, 30),
('Original Skittle Gummies', 'assets/Candy/Skittles.png', 20.00, 20),
('SourPatch Blue Raspberry', 'assets/Candy/SourPatch.png', 20.00, 25),
('KitKat Birthday Cake', 'assets/Chocolate/kitkat1.png', 10.00, 40),
('KitKat Mint and Dark Chocolate', 'assets/Chocolate/kitkat2.png', 10.00, 35),
('Monster Pacific Punch', 'assets/Drinks/M1.png', 20.00, 15),
('Monster Ultra Rosa', 'assets/Drinks/M2.png', 20.00, 10),
('Monster Aussie Lemonade', 'assets/Drinks/M3.png', 20.00, 8),
('Mountain Dew Baja Blast', 'assets/Drinks/MD1.png', 15.00, 20),
('Mountain Dew Voltage', 'assets/Drinks/MD2.png', 15.00, 25),
('Mountain Dew Spark', 'assets/Drinks/MD3.png', 15.00, 18),
('Mountain Dew Code Red', 'assets/Drinks/MD4.png', 15.00, 22),
('Butterfinger', 'assets/Chocolate/Butterfinger.png', 10.00, 40),
('M&M Crunchy Cookie', 'assets/Chocolate/M&M.png', 12.00, 50),
('Oreo Cakesters', 'assets/Chocolate/Oreo.png', 15.00, 35),
('Reeses White', 'assets/Chocolate/Reeses.png', 15.00, 28),
('Oreo Cadbury', 'assets/Chocolate/Cadbury.png', 15.00, 30),
('Skittles Sour Gummies', 'assets/Candy/Skittles2.png', 20.00, 12),
('SourPatch Peach', 'assets/Candy/SourPatch2.png', 20.00, 14),
('Warhead Pickle', 'assets/Candy/Pickle.png', 15.00, 18);


