-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS soluciones_cgt;
USE soluciones_cgt;

-- Crear la tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- Crear la tabla de componentes
CREATE TABLE IF NOT EXISTS componentes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria_id INT NOT NULL,
  imagen_url VARCHAR(255),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Insertar categorías iniciales
INSERT INTO categorias (nombre) VALUES
  ('Motherboard'),
  ('Tarjeta Gráfica'),
  ('Procesador'),
  ('Memoria RAM'),
  ('Case');

-- Insertar algunos componentes de ejemplo
INSERT INTO componentes (nombre, descripcion, precio, categoria_id, imagen_url) VALUES
  ('ASUS ROG STRIX B550-F', 'Placa base AMD AM4 con PCIe 4.0', 199.99, 1, '/images/motherboard/asus-rog-strix-b550f.jpg'),
  ('NVIDIA RTX 4070', 'Tarjeta gráfica de gama alta con ray tracing', 599.99, 2, '/images/gpu/nvidia-rtx-4070.jpg'),
  ('AMD Ryzen 7 5800X', 'Procesador de 8 núcleos y 16 hilos', 299.99, 3, '/images/cpu/amd-ryzen-7-5800x.jpg'),
  ('Corsair Vengeance RGB Pro', 'Kit de 32GB (2x16GB) DDR4 3600MHz', 149.99, 4, '/images/ram/corsair-vengeance-rgb-pro.jpg'),
  ('Lian Li O11 Dynamic', 'Gabinete ATX con panel lateral de vidrio', 149.99, 5, '/images/case/lian-li-o11-dynamic.jpg'); 