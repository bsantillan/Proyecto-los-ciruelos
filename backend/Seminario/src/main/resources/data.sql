-- data.sql

-- Crear la tabla cancha primero
CREATE TABLE IF NOT EXISTS cancha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    descripcion VARCHAR(300),
    tipo ENUM('Interior', 'Exterior') NOT NULL
);

-- Luego insertar los datos
INSERT INTO cancha (numero, descripcion, tipo) VALUES
(1, 'Cancha de fútbol sintético', 'Interior'),
(2, 'Cancha de tenis de polvo de ladrillo', 'Interior'),
(3, 'Cancha de paddle techada', 'Interior'),
(4, 'Cancha de vóley profesional', 'Exterior');

SELECT 'Schema executed successfully' AS Result;
