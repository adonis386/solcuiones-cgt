import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',  // Usuario por defecto en XAMPP
  password: 'admin',  // Contraseña por defecto en XAMPP (vacía)
  database: 'soluciones_cgt'  // Nombre de tu base de datos
});

export default pool; 