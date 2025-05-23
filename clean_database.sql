-- Limpiar la base de datos
USE soluciones_cgt;

-- Eliminar registros duplicados de componentes
DELETE c1 FROM componentes c1
INNER JOIN componentes c2
WHERE c1.id > c2.id
AND c1.nombre = c2.nombre
AND c1.categoria_id = c2.categoria_id;

-- Reiniciar el auto_increment
ALTER TABLE componentes AUTO_INCREMENT = 1;

-- Verificar que no haya duplicados
SELECT nombre, categoria_id, COUNT(*) as count
FROM componentes
GROUP BY nombre, categoria_id
HAVING count > 1; 