## Gestión de Aeropuertos. Una instancia gubernamental requiere una BD que cumpla lo siguiente.

- De cada aeropuerto se desea guardar un id, nombre, ciudad, dirección, número de pistas. En cada aeropuerto trabajan varias empresas autorizadas para hacer uso del aeropuerto.
``` cypher
CREATE (a:Aeropuerto {id: 'A1', nombre: 'Aeropuerto Internacional', ciudad: 'Ciudad X', direccion: 'Dirección X', numeroPistas: 4}); 
```

- Cada empresa cuenta con RFC, nombre, nacionalidad oficial de la empresa, dirección de la sede central, teléfonos y el número de aviones con que cuenta.
- Existen empresas de tres tipos en función de los vuelos que realizan: nacional, continental e internacional
- De las empresas nacionales se requiere almacenar el país al que pertenece, que es donde realiza todas las operaciones administrativas y pago de impuestos. Es necesario almacenar si tiene permiso para realizar viajes fuera del país (en algunas ocasiones puede la empresa realizar vuelos internacionales por petición expresa de un cliente)
```cypher
CREATE (e:Empresa {RFC: 'RFC1234', nombre: 'AeroLineasX', nacionalidad: 'MX', direccion: 'Dirección Sede X', telefonos: ['+1234567890'], numeroAviones: 15, tipo: 'Nacional', pais: 'México', permisoInternacional: true});
```
- De cada empresa continental se requiere almacenar el continente, y los países del continente sobre los que opera.
```cypher
CREATE (e:Empresa {RFC: 'RFC1234', nombre: 'AeroLineasX', nacionalidad: 'MX', direccion: 'Dirección Sede X', telefonos: ['+1234567890'], numeroAviones: 15, tipo: 'Continental', pais: 'México', permisoInternacional: true, continente: 'America', paisesDeOperacion: ['MX', 'EUA', 'CA', 'AR', 'CHILE', 'CO']});
```
- Una empresa internacional requiere registrar los países en los que no puede operar.
```cypher
CREATE (e:Empresa {RFC: 'RFC1234', nombre: 'AeroLineasX', nacionalidad: 'MX', direccion: 'Dirección Sede X', telefonos: ['+1234567890'], numeroAviones: 15, tipo: 'Internacional', pais: 'México', permisoInternacional: true, continente: 'America', paisesDeOperacion: ['MX', 'EUA', 'CA', 'AR', 'CHILE', 'CO'], paisesSinOperacion: ['JAPON', 'ESPAÑA', 'INDIA', 'RUSIA']});
```
- Se requiere registrar el personal que trabaja en cada empresa: id, nacionalidad, país de residencia, nombres, dirección, lengua materna.
- Del personal se desea distinguir entre tres categorías: pilotos, personal de tierra y personal de apoyo.
- De cada piloto se desea almacenar el tipo de licencia con que cuenta y la última evaluación que realizó como piloto.
```cypher
CREATE (p:Personal {id: 'P1', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Juan Pérez', direccion: 'Calle X', lenguaMaterna: 'Español', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-01-15'});
```
- Del personal de apoyo se requiere almacenar los idiomas que habla y su número de teléfono.
```cypher
CREATE (p:Personal {id: 'P1', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Juan Pérez', direccion: 'Calle X', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas:['Ingles', 'Frances']});
```
- De cada personal de tierra se requiere almacenar las tareas que realiza y las certificaciones laborales que tiene
```cypher
CREATE (p:Personal {id: 'P1', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Juan Pérez', direccion: 'Calle X', lenguaMaterna: 'Español', categoria: 'Personal de  Tierra', tareas: [], certificaciones: []});
```
- De cada avión se desea almacenar id, modelo, millas de autonomía (sin repostar combustible), número de pasajeros, número de integrantes de tripulación para operar el avión, fecha de la última revisión técnica del avión. También se desea conocer a qué ruta está asignado un avión
```cypher
CREATE (a:Avion {id: 'AV1', modelo: 'Boeing 747', autonomia: 6000, numeroPasajeros: 300, tripulacion: 10, ultimaRevision: '2023-12-20'});
```
- Cada ruta cuenta con código, origen y destino, y duración del vuelo. Estas rutas son asignadas a los pilotos. Un piloto puede tener asignadas (permiso para volar) muchas rutas.
```cypher
CREATE (r:Ruta {codigo: 'R123', origen: 'Ciudad X', destino: 'Ciudad Y', duracion: 3.5, avion: 'AV1', escalas:[1,2,3,4]});
```
1. Consultas:
- Q00. Script del escenario de datos.
```cypher
// Región Norte
MERGE (ae1:Aeropuerto {id: 1, nombre: 'A. I. Gral. Roberto Fierro Villalobos', ciudad: 'Chihuahua', estado: 'Chihuahua', direccion: 'Blvd. Juan Pablo II 14, 31390 Chihuahua, Chih', pistas: 15})

// Región Bajío y Valle de México
MERGE (ae2:Aeropuerto {id: 2, nombre: 'A. I. Lic. Jesús Terán Peredo', ciudad: 'Aguascalientes', estado: 'Aguascalientes', direccion: 'Carr. Panamericana Km. 22, 20340 Buenavista de Peñuelas, Ags.', pistas: 7})
MERGE (ae3:Aeropuerto {id: 3, nombre: 'A. I. Lic. Adolfo López Mateos', ciudad: 'Toluca', estado: 'Estado de México', direccion: 'San Pedro Totoltepec, 50226, Toluca de Lerdo, Méx.', pistas: 16})
MERGE (ae4:Aeropuerto {id: 4, nombre: 'A. I. de Querétaro', ciudad: 'Querétaro', estado: 'Querétaro', direccion: 'Carretera Estatal 200, Carr. Querétaro-Tequisquiapan 22500, 76270 Santiago de Querétaro, Qro', pistas: 11})

// Región Pacífico
MERGE (ae5:Aeropuerto {id: 5, nombre: 'A. I. Manuel Márquez de León', ciudad: 'La Paz', estado: 'Baja California Sur', direccion: 'México 1, 23206, B.C.S., México', pistas: 5})
MERGE (ae6:Aeropuerto {id: 6, nombre: 'A. I. Gral. Rodolfo Sánchez Taboada', ciudad: 'Mexicali', estado: 'Baja California', direccion: 'Carretera Mesa de Andrade Km. 23.5 Col. Mariano Abasolo, 21600, B.C., México', pistas: 10})


// Región Sur
MERGE (ae7:Aeropuerto {id: 7, nombre: 'A. I. Ángel Albino Corzo', ciudad: 'Tuxtla Gutiérrez', estado: 'Chiapas', direccion: 'Domicilio Conocido S/N, Aeropuerto Ángel Albino Corzo, Chiapa de Corzo, C.P. 29176, Chiapas.', pistas: 4})
MERGE (ae8:Aeropuerto {id: 8, nombre: 'A. I. Xoxocotlán', ciudad: 'Oaxaca', estado: 'Oaxaca', direccion: 'Carr. Oaxaca-Pto. Ángel Santa. Cruz Xoxocotlán, Oax., C.P. 71230', pistas: 5})
MERGE (ae9:Aeropuerto {id: 9, nombre: 'A. I. de Cancún', ciudad: 'Cancún', estado: 'Quintana Roo', direccion: '20 Desviacion Carretera Canciln- Chetumal, Municipio Benito Juarez, Cancun, Quintana Roo, Codigo Postal 77565, Mexico.', pistas: 16})

// Empresas nacionales
MERGE (e1:Empresa {RFC: 'NAT001', nombre: 'VuelosMéxico', nacionalidad: 'MX', direccion: 'Av. Principal 100, CDMX', telefonos: ['+521234567890'], numeroAviones: 10, tipo: 'Nacional', pais: 'México', permisoInternacional: false})
MERGE (e2:Empresa {RFC: 'NAT002', nombre: 'AeroArgentina', nacionalidad: 'AR', direccion: 'Calle Buenos Aires 50, Buenos Aires', telefonos: ['+541234567890'], numeroAviones: 8, tipo: 'Nacional', pais: 'Argentina', permisoInternacional: true})
MERGE (e3:Empresa {RFC: 'NAT003', nombre: 'VuelaChile', nacionalidad: 'CL', direccion: 'Av. Santiago 200, Santiago', telefonos: ['+569123456789'], numeroAviones: 12, tipo: 'Nacional', pais: 'Chile', permisoInternacional: true})
MERGE (e4:Empresa {RFC: 'NAT004', nombre: 'AeroPeru', nacionalidad: 'PE', direccion: 'Calle Lima 300, Lima', telefonos: ['+511234567890'], numeroAviones: 7, tipo: 'Nacional', pais: 'Perú', permisoInternacional: false})
MERGE (e5:Empresa {RFC: 'NAT005', nombre: 'ColombiaAir', nacionalidad: 'CO', direccion: 'Carrera Bogotá 101, Bogotá', telefonos: ['+571234567890'], numeroAviones: 9, tipo: 'Nacional', pais: 'Colombia', permisoInternacional: true})
MERGE (e6:Empresa {RFC: 'NAT006', nombre: 'BrasilAire', nacionalidad: 'BR', direccion: 'Rua Sao Paulo 45, Sao Paulo', telefonos: ['+551123456789'], numeroAviones: 20, tipo: 'Nacional', pais: 'Brasil', permisoInternacional: false})


// Empresas continentales
MERGE (e7:Empresa {RFC: 'CON001', nombre: 'AmeriVuelos', nacionalidad: 'US', direccion: '123 Main St, New York', telefonos: ['+11234567890'], numeroAviones: 50, tipo: 'Continental', pais: 'Estados Unidos', permisoInternacional: true, continente: 'América', paisesDeOperacion: ['MX', 'US', 'CA', 'AR', 'CL', 'CO']})
MERGE (e8:Empresa {RFC: 'CON002', nombre: 'EuroAir', nacionalidad: 'DE', direccion: 'Berlin Strasse 10, Berlin', telefonos: ['+49123456789'], numeroAviones: 30, tipo: 'Continental', pais: 'Alemania', permisoInternacional: true, continente: 'Europa', paisesDeOperacion: ['DE', 'FR', 'IT', 'ES', 'PT', 'NL']})
MERGE (e9:Empresa {RFC: 'CON003', nombre: 'AsiaFly', nacionalidad: 'CN', direccion: 'Beijing Avenue 5, Beijing', telefonos: ['+86123456789'], numeroAviones: 35, tipo: 'Continental', pais: 'China', permisoInternacional: true, continente: 'Asia', paisesDeOperacion: ['CN', 'JP', 'KR', 'IN', 'TH', 'VN']})
MERGE (e10:Empresa {RFC: 'CON004', nombre: 'AfricAir', nacionalidad: 'ZA', direccion: 'Johannesburg Rd 101, Johannesburg', telefonos: ['+27123456789'], numeroAviones: 15, tipo: 'Continental', pais: 'Sudáfrica', permisoInternacional: true, continente: 'África', paisesDeOperacion: ['ZA', 'EG', 'NG', 'KE', 'TZ', 'GH']})
MERGE (e11:Empresa {RFC: 'CON005', nombre: 'AussieJet', nacionalidad: 'AU', direccion: 'Sydney Way 88, Sydney', telefonos: ['+61123456789'], numeroAviones: 25, tipo: 'Continental', pais: 'Australia', permisoInternacional: true, continente: 'Oceanía', paisesDeOperacion: ['AU', 'NZ', 'PG', 'FJ', 'SB', 'WS']})
MERGE (e12:Empresa {RFC: 'CON006', nombre: 'LatamWings', nacionalidad: 'CL', direccion: 'Santiago Central 250, Santiago', telefonos: ['+56987654321'], numeroAviones: 18, tipo: 'Continental', pais: 'Chile', permisoInternacional: true, continente: 'América', paisesDeOperacion: ['CL', 'PE', 'AR', 'UY', 'BO', 'PY']})

// Empresas internacionales
MERGE (e13:Empresa {RFC: 'INT001', nombre: 'GlobalWings', nacionalidad: 'US', direccion: '456 Airway Blvd, Los Angeles', telefonos: ['+11234567890'], numeroAviones: 100, tipo: 'Internacional', pais: 'Estados Unidos', permisoInternacional: true, paisesSinOperacion: ['IR', 'KP', 'CU']})
MERGE (e14:Empresa {RFC: 'INT002', nombre: 'SkyWorld', nacionalidad: 'UK', direccion: 'London Sky Road 33, London', telefonos: ['+44123456789'], numeroAviones: 90, tipo: 'Internacional', pais: 'Reino Unido', permisoInternacional: true, paisesSinOperacion: ['IR', 'KP', 'CU', 'SY']})
MERGE (e15:Empresa {RFC: 'INT003', nombre: 'TransAsia', nacionalidad: 'SG', direccion: 'Singapore Sky Tower 77, Singapore', telefonos: ['+65123456789'], numeroAviones: 70, tipo: 'Internacional', pais: 'Singapur', permisoInternacional: true, paisesSinOperacion: ['IR', 'KP', 'SY', 'VE']})
MERGE (e16:Empresa {RFC: 'INT004', nombre: 'EuroGlobal', nacionalidad: 'DE', direccion: 'Frankfurt Am Main 55, Frankfurt', telefonos: ['+49123456789'], numeroAviones: 80, tipo: 'Internacional', pais: 'Alemania', permisoInternacional: true, paisesSinOperacion: ['KP', 'SY', 'SD', 'CU']})
MERGE (e17:Empresa {RFC: 'INT005', nombre: 'AfricAirways', nacionalidad: 'ZA', direccion: 'Cape Town Intl 300, Cape Town', telefonos: ['+27123456789'], numeroAviones: 60, tipo: 'Internacional', pais: 'Sudáfrica', permisoInternacional: true, paisesSinOperacion: ['SY', 'IR', 'KP', 'VE']})
MERGE (e18:Empresa {RFC: 'INT006', nombre: 'AeroOrbit', nacionalidad: 'FR', direccion: 'Paris Rue 100, Paris', telefonos: ['+33123456789'], numeroAviones: 85, tipo: 'Internacional', pais: 'Francia', permisoInternacional: true, paisesSinOperacion: ['KP', 'IR', 'CU', 'SY']})

// Relaciones EMPRESA-AEROPUERTO
MERGE (e1)-[:OPERA]->(ae1)
MERGE (e2)-[:OPERA]->(ae2)
MERGE (e3)-[:OPERA]->(ae3)
MERGE (e4)-[:OPERA]->(ae4)
MERGE (e5)-[:OPERA]->(ae5)
MERGE (e6)-[:OPERA]->(ae6)
MERGE (e7)-[:OPERA]->(ae7)
MERGE (e8)-[:OPERA]->(ae8)
MERGE (e9)-[:OPERA]->(ae9)
MERGE (e10)-[:OPERA]->(ae1)
MERGE (e11)-[:OPERA]->(ae2)
MERGE (e12)-[:OPERA]->(ae3)
MERGE (e13)-[:OPERA]->(ae4)
MERGE (e14)-[:OPERA]->(ae5)
MERGE (e15)-[:OPERA]->(ae6)
MERGE (e16)-[:OPERA]->(ae7)
MERGE (e17)-[:OPERA]->(ae8)
MERGE (e18)-[:OPERA]->(ae9)
MERGE (e8)-[:OPERA]->(ae1)
MERGE (e9)-[:OPERA]->(ae2)
MERGE (e4)-[:OPERA]->(ae3)
MERGE (e6)-[:OPERA]->(ae4)
MERGE (e8)-[:OPERA]->(ae5)
MERGE (e1)-[:OPERA]->(ae6)
MERGE (e2)-[:OPERA]->(ae7)
MERGE (e3)-[:OPERA]->(ae8)
MERGE (e5)-[:OPERA]->(ae9)
MERGE (e1)-[:OPERA]->(ae1)
MERGE (e17)-[:OPERA]->(ae2)
MERGE (e15)-[:OPERA]->(ae3)
MERGE (e14)-[:OPERA]->(ae4)
MERGE (e12)-[:OPERA]->(ae5)
MERGE (e11)-[:OPERA]->(ae6)
MERGE (e16)-[:OPERA]->(ae7)
MERGE (e18)-[:OPERA]->(ae8)
MERGE (e5)-[:OPERA]->(ae9)

// Empleados
// Pilotos
MERGE (p1:Personal {id: 'P001', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Juan Pérez', direccion: 'Calle 1', lenguaMaterna: 'Español', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-01-15'})
MERGE (p2:Personal {id: 'P002', nacionalidad: 'AR', paisResidencia: 'Argentina', nombres: 'Carlos Gómez', direccion: 'Calle 2', lenguaMaterna: 'Español', categoria: 'Piloto', licencia: 'CPL', ultimaEvaluacion: '2024-02-10'})
MERGE (p3:Personal {id: 'P003', nacionalidad: 'CL', paisResidencia: 'Chile', nombres: 'Ana Martínez', direccion: 'Calle 3', lenguaMaterna: 'Español', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2023-12-20'})
MERGE (p4:Personal {id: 'P004', nacionalidad: 'US', paisResidencia: 'Estados Unidos', nombres: 'Tom Smith', direccion: 'Street 4', lenguaMaterna: 'Inglés', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-03-18'})
MERGE (p5:Personal {id: 'P005', nacionalidad: 'DE', paisResidencia: 'Alemania', nombres: 'Lisa Müller', direccion: 'Strasse 5', lenguaMaterna: 'Alemán', categoria: 'Piloto', licencia: 'CPL', ultimaEvaluacion: '2024-04-25'})

MERGE (p1)-[:TRABAJA]->(e1)
MERGE (p2)-[:TRABAJA]->(e2)
MERGE (p3)-[:TRABAJA]->(e3)
MERGE (p4)-[:TRABAJA]->(e4)
MERGE (p5)-[:TRABAJA]->(e5)
 
// Personal de Apoyo
MERGE (p6:Personal {id: 'P006', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Marta Hernández', direccion: 'Calle 6', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas: ['Inglés', 'Francés'], telefono: '+521234567890'})
MERGE (p7:Personal {id: 'P007', nacionalidad: 'CL', paisResidencia: 'Chile', nombres: 'Luis Rodríguez', direccion: 'Calle 7', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas: ['Español', 'Inglés'], telefono: '+569876543210'})
MERGE (p8:Personal {id: 'P008', nacionalidad: 'AR', paisResidencia: 'Argentina', nombres: 'Gabriela Torres', direccion: 'Calle 8', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas: ['Español', 'Portugués'], telefono: '+541234567890'})
MERGE (p9:Personal {id: 'P009', nacionalidad: 'FR', paisResidencia: 'Francia', nombres: 'Jean Dupont', direccion: 'Rue 9', lenguaMaterna: 'Francés', categoria: 'Apoyo', idiomas: ['Francés', 'Inglés', 'Español'], telefono: '+33123456789'})
MERGE (p10:Personal {id: 'P010', nacionalidad: 'BR', paisResidencia: 'Brasil', nombres: 'María Souza', direccion: 'Rua 10', lenguaMaterna: 'Portugués', categoria: 'Apoyo', idiomas: ['Portugués', 'Inglés'], telefono: '+55123456789'})

MERGE (p6)-[:TRABAJA]->(e6)
MERGE (p7)-[:TRABAJA]->(e7)
MERGE (p8)-[:TRABAJA]->(e8)
MERGE (p9)-[:TRABAJA]->(e9)
MERGE (p10)-[:TRABAJA]->(e10)

// Personal de Tierra
MERGE (p11:Personal {id: 'P011', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Roberto Jiménez', direccion: 'Calle 11', lenguaMaterna: 'Español', categoria: 'Personal de Tierra', tareas: ['Mantenimiento', 'Revisión de seguridad'], certificaciones: ['Técnico en Mantenimiento de Aeronaves', 'Técnico en Seguridad de Aeronaves', 'Seguridad en Aeropuertos']})
MERGE (p12:Personal {id: 'P012', nacionalidad: 'CO', paisResidencia: 'Colombia', nombres: 'Sara Gutiérrez', direccion: 'Calle 12', lenguaMaterna: 'Español', categoria: 'Personal de Tierra', tareas: ['Inspección de carga', 'Control de tráfico en tierra'], certificaciones: ['Operador de Carga', 'Seguridad en Aeropuertos', 'Técnico en Seguridad de Aeronaves', 'Operador de Equipos Aeroportuarios']})
MERGE (p13:Personal {id: 'P013', nacionalidad: 'US', paisResidencia: 'Estados Unidos', nombres: 'Michael Johnson', direccion: 'Street 13', lenguaMaterna: 'Inglés', categoria: 'Personal de Tierra', tareas: ['Mantenimiento', 'Inspección de equipaje'], certificaciones: ['Técnico en Seguridad de Aeronaves', 'Seguridad en Aeropuertos', 'Especialista en Combustible']})
MERGE (p14:Personal {id: 'P014', nacionalidad: 'DE', paisResidencia: 'Alemania', nombres: 'Johann Becker', direccion: 'Strasse 14', lenguaMaterna: 'Alemán', categoria: 'Personal de Tierra', tareas: ['Mantenimiento de pista', 'Supervisión de equipo de rampa'], certificaciones: ['Operador de Equipos Aeroportuarios']})
MERGE (p15:Personal {id: 'P015', nacionalidad: 'FR', paisResidencia: 'Francia', nombres: 'Chloe Dubois', direccion: 'Rue 15', lenguaMaterna: 'Francés', categoria: 'Personal de Tierra', tareas: ['Revisión de seguridad', 'Carga de combustible'], certificaciones: ['Seguridad en Aeropuertos', 'Especialista en Combustible']})

MERGE (p11)-[:TRABAJA]->(e11)
MERGE (p12)-[:TRABAJA]->(e12)
MERGE (p13)-[:TRABAJA]->(e13)
MERGE (p14)-[:TRABAJA]->(e14)
MERGE (p15)-[:TRABAJA]->(e15)

// Pilotos
MERGE (p16:Personal {id: 'P016', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Luis Romero', direccion: 'Calle 16', lenguaMaterna: 'Español', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-06-15'})
MERGE (p17:Personal {id: 'P017', nacionalidad: 'BR', paisResidencia: 'Brasil', nombres: 'Marcos da Silva', direccion: 'Rua 17', lenguaMaterna: 'Portugués', categoria: 'Piloto', licencia: 'CPL', ultimaEvaluacion: '2024-05-22'})
MERGE (p18:Personal {id: 'P018', nacionalidad: 'FR', paisResidencia: 'Francia', nombres: 'Sophie Martin', direccion: 'Rue 18', lenguaMaterna: 'Francés', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-07-02'})
MERGE (p19:Personal {id: 'P019', nacionalidad: 'DE', paisResidencia: 'Alemania', nombres: 'Hans Keller', direccion: 'Strasse 19', lenguaMaterna: 'Alemán', categoria: 'Piloto', licencia: 'CPL', ultimaEvaluacion: '2023-11-12'})
MERGE (p20:Personal {id: 'P020', nacionalidad: 'US', paisResidencia: 'Estados Unidos', nombres: 'Emily Brown', direccion: 'Street 20', lenguaMaterna: 'Inglés', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-08-15'})

MERGE (p16)-[:TRABAJA]->(e16)
MERGE (p17)-[:TRABAJA]->(e17)
MERGE (p18)-[:TRABAJA]->(e18)
MERGE (p19)-[:TRABAJA]->(e1)
MERGE (p20)-[:TRABAJA]->(e2)

// Personal de Apoyo
MERGE (p21:Personal {id: 'P021', nacionalidad: 'CL', paisResidencia: 'Chile', nombres: 'Fernando Soto', direccion: 'Calle 21', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas: ['Inglés', 'Español'], telefono: '+56976543210'})
MERGE (p22:Personal {id: 'P022', nacionalidad: 'AR', paisResidencia: 'Argentina', nombres: 'Paula Ortiz', direccion: 'Calle 22', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas: ['Español', 'Francés'], telefono: '+541234567891'})
MERGE (p23:Personal {id: 'P023', nacionalidad: 'CA', paisResidencia: 'Canadá', nombres: 'Jack Wilson', direccion: 'Street 23', lenguaMaterna: 'Inglés', categoria: 'Apoyo', idiomas: ['Inglés', 'Francés'], telefono: '+15123456789'})
MERGE (p24:Personal {id: 'P024', nacionalidad: 'CO', paisResidencia: 'Colombia', nombres: 'Diana Mejía', direccion: 'Calle 24', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas: ['Español', 'Portugués'], telefono: '+573012345678'})
MERGE (p25:Personal {id: 'P025', nacionalidad: 'IT', paisResidencia: 'Italia', nombres: 'Giulia Rossi', direccion: 'Via 25', lenguaMaterna: 'Italiano', categoria: 'Apoyo', idiomas: ['Italiano', 'Inglés'], telefono: '+393512345678'})

MERGE (p21)-[:TRABAJA]->(e3)
MERGE (p22)-[:TRABAJA]->(e4)
MERGE (p23)-[:TRABAJA]->(e5)
MERGE (p24)-[:TRABAJA]->(e6)
MERGE (p25)-[:TRABAJA]->(e7)

// Personal de Tierra
MERGE (p26:Personal {id: 'P026', nacionalidad: 'ES', paisResidencia: 'España', nombres: 'Pedro Alonso', direccion: 'Calle 26', lenguaMaterna: 'Español', categoria: 'Personal de Tierra', tareas: ['Carga de equipaje', 'Mantenimiento'], certificaciones: ['Carga en Aeropuertos', 'Mantenimiento Básico', 'Seguridad en Aeropuertos', 'Especialista en Combustible']})
MERGE (p27:Personal {id: 'P027', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Javier Ruiz', direccion: 'Calle 27', lenguaMaterna: 'Español', categoria: 'Personal de Tierra', tareas: ['Revisión de seguridad', 'Inspección de aeronaves'], certificaciones: ['Seguridad Aeroportuaria', 'Inspección de Aeronaves', 'Carga en Aeropuertos', 'Mantenimiento Básico']})
MERGE (p28:Personal {id: 'P028', nacionalidad: 'JP', paisResidencia: 'Japón', nombres: 'Yuki Nakamura', direccion: '街道 28', lenguaMaterna: 'Japonés', categoria: 'Personal de Tierra', tareas: ['Carga de combustible', 'Revisión de pista'], certificaciones: ['Combustible en Aeronaves', 'Operaciones en Pista']})
MERGE (p29:Personal {id: 'P029', nacionalidad: 'US', paisResidencia: 'Estados Unidos', nombres: 'Sarah Davis', direccion: 'Street 29', lenguaMaterna: 'Inglés', categoria: 'Personal de Tierra', tareas: ['Mantenimiento', 'Control de equipo en rampa'], certificaciones: ['Mantenimiento en Aeronaves', 'Equipo Aeroportuario']})
MERGE (p30:Personal {id: 'P030', nacionalidad: 'GB', paisResidencia: 'Reino Unido', nombres: 'Harry Johnson', direccion: 'Road 30', lenguaMaterna: 'Inglés', categoria: 'Personal de Tierra', tareas: ['Inspección de carga', 'Supervisión de seguridad'], certificaciones: ['Seguridad Aeroportuaria', 'Control de Carga']})

MERGE (p26)-[:TRABAJA]->(e8)
MERGE (p27)-[:TRABAJA]->(e1)
MERGE (p28)-[:TRABAJA]->(e10)
MERGE (p29)-[:TRABAJA]->(e11)
MERGE (p30)-[:TRABAJA]->(e12)

// Pilotos
MERGE (p31:Personal {id: 'P031', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Clara Torres', direccion: 'Calle 31', lenguaMaterna: 'Español', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-03-10'})
MERGE (p32:Personal {id: 'P032', nacionalidad: 'PE', paisResidencia: 'Perú', nombres: 'Carlos Fernández', direccion: 'Calle 32', lenguaMaterna: 'Español', categoria: 'Piloto', licencia: 'CPL', ultimaEvaluacion: '2024-02-25'})
MERGE (p33:Personal {id: 'P033', nacionalidad: 'IT', paisResidencia: 'Italia', nombres: 'Marco Bellini', direccion: 'Via 33', lenguaMaterna: 'Italiano', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-04-05'})
MERGE (p34:Personal {id: 'P034', nacionalidad: 'IN', paisResidencia: 'India', nombres: 'Aditi Sharma', direccion: 'Calle 34', lenguaMaterna: 'Hindi', categoria: 'Piloto', licencia: 'CPL', ultimaEvaluacion: '2023-12-15'})
MERGE (p35:Personal {id: 'P035', nacionalidad: 'JP', paisResidencia: 'Japón', nombres: 'Taro Yamamoto', direccion: '街道 35', lenguaMaterna: 'Japonés', categoria: 'Piloto', licencia: 'ATPL', ultimaEvaluacion: '2024-07-20'})

MERGE (p31)-[:TRABAJA]->(e13)
MERGE (p32)-[:TRABAJA]->(e14)
MERGE (p33)-[:TRABAJA]->(e15)
MERGE (p34)-[:TRABAJA]->(e16)
MERGE (p35)-[:TRABAJA]->(e17)

// Personal de Apoyo
MERGE (p36:Personal {id: 'P036', nacionalidad: 'BR', paisResidencia: 'Brasil', nombres: 'Fernanda Sousa', direccion: 'Rua 36', lenguaMaterna: 'Portugués', categoria: 'Apoyo', idiomas: ['Portugués', 'Inglés'], telefono: '+557198765432'})
MERGE (p37:Personal {id: 'P037', nacionalidad: 'AR', paisResidencia: 'Argentina', nombres: 'Lucía González', direccion: 'Calle 37', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas: ['Español', 'Inglés'], telefono: '+541234567892'})
MERGE (p38:Personal {id: 'P038', nacionalidad: 'CA', paisResidencia: 'Canadá', nombres: 'Michael Thompson', direccion: 'Street 38', lenguaMaterna: 'Inglés', categoria: 'Apoyo', idiomas: ['Inglés', 'Francés'], telefono: '+15123456780'})
MERGE (p39:Personal {id: 'P039', nacionalidad: 'CO', paisResidencia: 'Colombia', nombres: 'Andrés Castro', direccion: 'Calle 39', lenguaMaterna: 'Español', categoria: 'Apoyo', idiomas: ['Español', 'Inglés'], telefono: '+573012345679'})
MERGE (p40:Personal {id: 'P040', nacionalidad: 'DE', paisResidencia: 'Alemania', nombres: 'Lena Schmidt', direccion: 'Strasse 40', lenguaMaterna: 'Alemán', categoria: 'Apoyo', idiomas: ['Alemán', 'Inglés'], telefono: '+491234567890'})

MERGE (p36)-[:TRABAJA]->(e18)
MERGE (p37)-[:TRABAJA]->(e1)
MERGE (p38)-[:TRABAJA]->(e2)
MERGE (p39)-[:TRABAJA]->(e3)
MERGE (p40)-[:TRABAJA]->(e4)

// Personal de Tierra
MERGE (p41:Personal {id: 'P041', nacionalidad: 'MX', paisResidencia: 'México', nombres: 'Roberto García', direccion: 'Calle 41', lenguaMaterna: 'Español', categoria: 'Personal de Tierra', tareas: ['Carga de equipaje', 'Revisión de seguridad'], certificaciones: ['Carga en Aeropuertos']})
MERGE (p42:Personal {id: 'P042', nacionalidad: 'US', paisResidencia: 'Estados Unidos', nombres: 'Sarah Williams', direccion: 'Street 42', lenguaMaterna: 'Inglés', categoria: 'Personal de Tierra', tareas: ['Inspección de carga', 'Mantenimiento'], certificaciones: ['Inspección de Aeronaves']})
MERGE (p43:Personal {id: 'P043', nacionalidad: 'JP', paisResidencia: 'Japón', nombres: 'Kenta Tanaka', direccion: '街道 43', lenguaMaterna: 'Japonés', categoria: 'Personal de Tierra', tareas: ['Mantenimiento', 'Revisión de pistas'], certificaciones: ['Mantenimiento en Aeronaves']})
MERGE (p44:Personal {id: 'P044', nacionalidad: 'GB', paisResidencia: 'Reino Unido', nombres: 'Oliver Wilson', direccion: 'Road 44', lenguaMaterna: 'Inglés', categoria: 'Personal de Tierra', tareas: ['Carga de combustible', 'Supervisión de seguridad'], certificaciones: ['Combustible en Aeronaves']})
MERGE (p45:Personal {id: 'P045', nacionalidad: 'ES', paisResidencia: 'España', nombres: 'María López', direccion: 'Calle 45', lenguaMaterna: 'Español', categoria: 'Personal de Tierra', tareas: ['Revisión de carga', 'Control de equipo en rampa'], certificaciones: ['Control de Carga']})

MERGE (p41)-[:TRABAJA]->(e5)
MERGE (p42)-[:TRABAJA]->(e6)
MERGE (p43)-[:TRABAJA]->(e7)
MERGE (p44)-[:TRABAJA]->(e8)
MERGE (p45)-[:TRABAJA]->(e9)

// Aviones
MERGE (a1:Avion {id: 'AV1', modelo: 'Boeing 747', autonomia: 6000, numeroPasajeros: 300, tripulacion: 10, ultimaRevision: '2023-12-20'})
MERGE (a2:Avion {id: 'AV2', modelo: 'Airbus A320', autonomia: 5900, numeroPasajeros: 180, tripulacion: 6, ultimaRevision: '2024-01-15'})
MERGE (a3:Avion {id: 'AV3', modelo: 'Boeing 737', autonomia: 5000, numeroPasajeros: 215, tripulacion: 5, ultimaRevision: '2024-02-10'})
MERGE (a4:Avion {id: 'AV4', modelo: 'Airbus A330', autonomia: 7000, numeroPasajeros: 250, tripulacion: 8, ultimaRevision: '2024-03-05'})
MERGE (a5:Avion {id: 'AV5', modelo: 'Boeing 787', autonomia: 7500, numeroPasajeros: 240, tripulacion: 8, ultimaRevision: '2024-04-01'})
MERGE (a6:Avion {id: 'AV6', modelo: 'Boeing 777', autonomia: 8500, numeroPasajeros: 368, tripulacion: 10, ultimaRevision: '2024-05-12'})
MERGE (a7:Avion {id: 'AV7', modelo: 'Embraer E175', autonomia: 4000, numeroPasajeros: 88, tripulacion: 3, ultimaRevision: '2023-11-25'})
MERGE (a8:Avion {id: 'AV8', modelo: 'Bombardier CRJ900', autonomia: 3700, numeroPasajeros: 90, tripulacion: 3, ultimaRevision: '2024-06-18'})
MERGE (a9:Avion {id: 'AV9', modelo: 'Airbus A350', autonomia: 8000, numeroPasajeros: 440, tripulacion: 8, ultimaRevision: '2023-12-05'})
MERGE (a10:Avion {id: 'AV10', modelo: 'Boeing 757', autonomia: 6000, numeroPasajeros: 200, tripulacion: 6, ultimaRevision: '2024-01-20'})
MERGE (a11:Avion {id: 'AV11', modelo: 'Airbus A321', autonomia: 5900, numeroPasajeros: 240, tripulacion: 6, ultimaRevision: '2024-02-15'})
MERGE (a12:Avion {id: 'AV12', modelo: 'Boeing 737 MAX', autonomia: 6500, numeroPasajeros: 230, tripulacion: 5, ultimaRevision: '2024-03-20'})
MERGE (a13:Avion {id: 'AV13', modelo: 'McDonnell Douglas MD-80', autonomia: 4000, numeroPasajeros: 150, tripulacion: 5, ultimaRevision: '2024-04-10'})
MERGE (a14:Avion {id: 'AV14', modelo: 'Airbus A220', autonomia: 6000, numeroPasajeros: 130, tripulacion: 4, ultimaRevision: '2024-05-15'})
MERGE (a15:Avion {id: 'AV15', modelo: 'Boeing 767', autonomia: 7000, numeroPasajeros: 240, tripulacion: 7, ultimaRevision: '2024-06-22'})
MERGE (a16:Avion {id: 'AV16', modelo: 'Boeing 787 Dreamliner', autonomia: 7000, numeroPasajeros: 296, tripulacion: 8, ultimaRevision: '2024-07-30'})
MERGE (a17:Avion {id: 'AV17', modelo: 'Airbus A310', autonomia: 5500, numeroPasajeros: 280, tripulacion: 6, ultimaRevision: '2023-10-18'})
MERGE (a18:Avion {id: 'AV18', modelo: 'Boeing 720', autonomia: 4500, numeroPasajeros: 150, tripulacion: 5, ultimaRevision: '2024-02-22'})
MERGE (a19:Avion {id: 'AV19', modelo: 'Lockheed Martin C-130', autonomia: 3200, numeroPasajeros: 92, tripulacion: 4, ultimaRevision: '2024-03-30'})
MERGE (a20:Avion {id: 'AV20', modelo: 'Airbus A340', autonomia: 7800, numeroPasajeros: 380, tripulacion: 10, ultimaRevision: '2024-05-05'})
MERGE (a21:Avion {id: 'AV21', modelo: 'Boeing 787-9', autonomia: 7630, numeroPasajeros: 296, tripulacion: 8, ultimaRevision: '2024-06-11'})
MERGE (a22:Avion {id: 'AV22', modelo: 'Airbus A319', autonomia: 5700, numeroPasajeros: 140, tripulacion: 4, ultimaRevision: '2024-07-17'})
MERGE (a23:Avion {id: 'AV23', modelo: 'Boeing 747-8', autonomia: 8000, numeroPasajeros: 410, tripulacion: 10, ultimaRevision: '2023-12-12'})
MERGE (a24:Avion {id: 'AV24', modelo: 'McDonnell Douglas DC-10', autonomia: 5700, numeroPasajeros: 250, tripulacion: 7, ultimaRevision: '2024-01-28'})
MERGE (a25:Avion {id: 'AV25', modelo: 'Airbus A380', autonomia: 9000, numeroPasajeros: 555, tripulacion: 20, ultimaRevision: '2024-03-03'})

// Asignar aviones a empresas
MERGE (e1)-[:POSEE]->(a1)
MERGE (e1)-[:POSEE]->(a2)
MERGE (e1)-[:POSEE]->(a3)
MERGE (e1)-[:POSEE]->(a4)
MERGE (e2)-[:POSEE]->(a5)
MERGE (e2)-[:POSEE]->(a6)
MERGE (e2)-[:POSEE]->(a7)
MERGE (e2)-[:POSEE]->(a8)
MERGE (e2)-[:POSEE]->(a9)
MERGE (e3)-[:POSEE]->(a10)
MERGE (e3)-[:POSEE]->(a11)
MERGE (e3)-[:POSEE]->(a12)
MERGE (e4)-[:POSEE]->(a12)
MERGE (e4)-[:POSEE]->(a14)
MERGE (e4)-[:POSEE]->(a15)
MERGE (e5)-[:POSEE]->(a16)
MERGE (e5)-[:POSEE]->(a17)
MERGE (e5)-[:POSEE]->(a18)
MERGE (e5)-[:POSEE]->(a19)
MERGE (e5)-[:POSEE]->(a20)
MERGE (e6)-[:POSEE]->(a21)
MERGE (e6)-[:POSEE]->(a22)
MERGE (e6)-[:POSEE]->(a23)
MERGE (e7)-[:POSEE]->(a24)
MERGE (e7)-[:POSEE]->(a25)

MERGE (e8)-[:POSEE]->(a1)
MERGE (e8)-[:POSEE]->(a2)
MERGE (e8)-[:POSEE]->(a3)
MERGE (e8)-[:POSEE]->(a4)
MERGE (e8)-[:POSEE]->(a5)
MERGE (e9)-[:POSEE]->(a6)
MERGE (e9)-[:POSEE]->(a7)
MERGE (e9)-[:POSEE]->(a8)
MERGE (e10)-[:POSEE]->(a9)
MERGE (e10)-[:POSEE]->(a10)
MERGE (e11)-[:POSEE]->(a11)
MERGE (e11)-[:POSEE]->(a12)
MERGE (e11)-[:POSEE]->(a12)
MERGE (e11)-[:POSEE]->(a14)
MERGE (e12)-[:POSEE]->(a15)
MERGE (e12)-[:POSEE]->(a16)
MERGE (e13)-[:POSEE]->(a17)
MERGE (e14)-[:POSEE]->(a18)
MERGE (e15)-[:POSEE]->(a19)
MERGE (e16)-[:POSEE]->(a20)
MERGE (e17)-[:POSEE]->(a21)
MERGE (e17)-[:POSEE]->(a22)
MERGE (e18)-[:POSEE]->(a23)
MERGE (e18)-[:POSEE]->(a24)
MERGE (e18)-[:POSEE]->(a25)

MERGE (e1)-[:POSEE]->(a9)
MERGE (e1)-[:POSEE]->(a10)
MERGE (e1)-[:POSEE]->(a11)
MERGE (e1)-[:POSEE]->(a12)
MERGE (e1)-[:POSEE]->(a12)
MERGE (e1)-[:POSEE]->(a14)
MERGE (e1)-[:POSEE]->(a15)
MERGE (e1)-[:POSEE]->(a16)
MERGE (e1)-[:POSEE]->(a17)
MERGE (e1)-[:POSEE]->(a18)
MERGE (e1)-[:POSEE]->(a19)
MERGE (e1)-[:POSEE]->(a20)
MERGE (e1)-[:POSEE]->(a21)
MERGE (e1)-[:POSEE]->(a22)
MERGE (e1)-[:POSEE]->(a23)
MERGE (e1)-[:POSEE]->(a24)
MERGE (e1)-[:POSEE]->(a25)
MERGE (e1)-[:POSEE]->(a8)
MERGE (e1)-[:POSEE]->(a7)

MERGE (e2)-[:POSEE]->(a11)
MERGE (e2)-[:POSEE]->(a12)
MERGE (e2)-[:POSEE]->(a12)
MERGE (e2)-[:POSEE]->(a14)
MERGE (e2)-[:POSEE]->(a15)
MERGE (e2)-[:POSEE]->(a16)
MERGE (e2)-[:POSEE]->(a17)
MERGE (e2)-[:POSEE]->(a18)
MERGE (e2)-[:POSEE]->(a19)
MERGE (e2)-[:POSEE]->(a20)
MERGE (e2)-[:POSEE]->(a21)
MERGE (e2)-[:POSEE]->(a22)
MERGE (e2)-[:POSEE]->(a23)
MERGE (e2)-[:POSEE]->(a24)
MERGE (e2)-[:POSEE]->(a25)
MERGE (e2)-[:POSEE]->(a8)
MERGE (e2)-[:POSEE]->(a7)

MERGE (e3)-[:POSEE]->(a15)
MERGE (e3)-[:POSEE]->(a16)
MERGE (e3)-[:POSEE]->(a17)
MERGE (e3)-[:POSEE]->(a18)
MERGE (e3)-[:POSEE]->(a19)
MERGE (e3)-[:POSEE]->(a20)
MERGE (e3)-[:POSEE]->(a21)
MERGE (e3)-[:POSEE]->(a22)
MERGE (e3)-[:POSEE]->(a23)
MERGE (e3)-[:POSEE]->(a24)
MERGE (e3)-[:POSEE]->(a25)
MERGE (e3)-[:POSEE]->(a8)
MERGE (e3)-[:POSEE]->(a7)


// Asignar aviones a aeropuertos
MERGE (a1)-[:OPERA_EN]->(ae1)
MERGE (a2)-[:OPERA_EN]->(ae2)
MERGE (a3)-[:OPERA_EN]->(ae3)
MERGE (a4)-[:OPERA_EN]->(ae4)
MERGE (a5)-[:OPERA_EN]->(ae5)
MERGE (a6)-[:OPERA_EN]->(ae6)
MERGE (a7)-[:OPERA_EN]->(ae7)
MERGE (a8)-[:OPERA_EN]->(ae8)
MERGE (a9)-[:OPERA_EN]->(ae9)
MERGE (a10)-[:OPERA_EN]->(ae1)
MERGE (a11)-[:OPERA_EN]->(ae2)
MERGE (a12)-[:OPERA_EN]->(ae3)
MERGE (a13)-[:OPERA_EN]->(ae4)
MERGE (a14)-[:OPERA_EN]->(ae5)
MERGE (a15)-[:OPERA_EN]->(ae6)
MERGE (a16)-[:OPERA_EN]->(ae7)
MERGE (a17)-[:OPERA_EN]->(ae8)
MERGE (a18)-[:OPERA_EN]->(ae9)
MERGE (a19)-[:OPERA_EN]->(ae1)
MERGE (a20)-[:OPERA_EN]->(ae2)
MERGE (a21)-[:OPERA_EN]->(ae3)
MERGE (a22)-[:OPERA_EN]->(ae4)
MERGE (a23)-[:OPERA_EN]->(ae5)
MERGE (a24)-[:OPERA_EN]->(ae6)
MERGE (a25)-[:OPERA_EN]->(ae7)

MERGE (a1)-[:OPERA_EN]->(ae8)
MERGE (a2)-[:OPERA_EN]->(ae9)
MERGE (a3)-[:OPERA_EN]->(ae1)
MERGE (a4)-[:OPERA_EN]->(ae2)
MERGE (a5)-[:OPERA_EN]->(ae3)
MERGE (a6)-[:OPERA_EN]->(ae4)
MERGE (a7)-[:OPERA_EN]->(ae5)
MERGE (a8)-[:OPERA_EN]->(ae6)
MERGE (a9)-[:OPERA_EN]->(ae7) 
MERGE (a10)-[:OPERA_EN]->(ae8)
MERGE (a11)-[:OPERA_EN]->(ae1)
MERGE (a12)-[:OPERA_EN]->(ae2)
MERGE (a13)-[:OPERA_EN]->(ae3)
MERGE (a14)-[:OPERA_EN]->(ae4)
MERGE (a15)-[:OPERA_EN]->(ae5)
MERGE (a16)-[:OPERA_EN]->(ae6)
MERGE (a17)-[:OPERA_EN]->(ae7)
MERGE (a18)-[:OPERA_EN]->(ae8)
MERGE (a19)-[:OPERA_EN]->(ae9)
MERGE (a20)-[:OPERA_EN]->(ae1)
MERGE (a21)-[:OPERA_EN]->(ae2)
MERGE (a22)-[:OPERA_EN]->(ae3)
MERGE (a23)-[:OPERA_EN]->(ae4)
MERGE (a24)-[:OPERA_EN]->(ae5)
MERGE (a25)-[:OPERA_EN]->(ae6)

MERGE (a1)-[:OPERA_EN]->(ae7)
MERGE (a2)-[:OPERA_EN]->(ae8)
MERGE (a3)-[:OPERA_EN]->(ae9)
MERGE (a4)-[:OPERA_EN]->(ae1)
MERGE (a5)-[:OPERA_EN]->(ae2)
MERGE (a6)-[:OPERA_EN]->(ae3)
MERGE (a7)-[:OPERA_EN]->(ae4)
MERGE (a8)-[:OPERA_EN]->(ae5)
MERGE (a9)-[:OPERA_EN]->(ae6) 
MERGE (a10)-[:OPERA_EN]->(ae7)
MERGE (a11)-[:OPERA_EN]->(ae8)
MERGE (a12)-[:OPERA_EN]->(ae9)
MERGE (a13)-[:OPERA_EN]->(ae1)
MERGE (a14)-[:OPERA_EN]->(ae2)
MERGE (a15)-[:OPERA_EN]->(ae3)
MERGE (a16)-[:OPERA_EN]->(ae4)
MERGE (a17)-[:OPERA_EN]->(ae5)
MERGE (a18)-[:OPERA_EN]->(ae6)
MERGE (a19)-[:OPERA_EN]->(ae7)
MERGE (a20)-[:OPERA_EN]->(ae8)
MERGE (a21)-[:OPERA_EN]->(ae9)
MERGE (a22)-[:OPERA_EN]->(ae1)
MERGE (a23)-[:OPERA_EN]->(ae2)
MERGE (a24)-[:OPERA_EN]->(ae3)
MERGE (a25)-[:OPERA_EN]->(ae4)

MERGE (a1)-[:OPERA_EN]->(ae5)
MERGE (a2)-[:OPERA_EN]->(ae6)
MERGE (a3)-[:OPERA_EN]->(ae7)
MERGE (a4)-[:OPERA_EN]->(ae8)
MERGE (a5)-[:OPERA_EN]->(ae9)
MERGE (a6)-[:OPERA_EN]->(ae1)
MERGE (a7)-[:OPERA_EN]->(ae2)
MERGE (a8)-[:OPERA_EN]->(ae3)
MERGE (a9)-[:OPERA_EN]->(ae4) 
MERGE (a10)-[:OPERA_EN]->(ae5)
MERGE (a11)-[:OPERA_EN]->(ae6)
MERGE (a12)-[:OPERA_EN]->(ae7)
MERGE (a13)-[:OPERA_EN]->(ae8)
MERGE (a14)-[:OPERA_EN]->(ae9)
MERGE (a15)-[:OPERA_EN]->(ae1)
MERGE (a16)-[:OPERA_EN]->(ae2)
MERGE (a17)-[:OPERA_EN]->(ae3)
MERGE (a18)-[:OPERA_EN]->(ae4)
MERGE (a19)-[:OPERA_EN]->(ae5)
MERGE (a20)-[:OPERA_EN]->(ae6)
MERGE (a21)-[:OPERA_EN]->(ae7)
MERGE (a22)-[:OPERA_EN]->(ae8)
MERGE (a23)-[:OPERA_EN]->(ae9)
MERGE (a24)-[:OPERA_EN]->(ae1)
MERGE (a25)-[:OPERA_EN]->(ae2)


// Rutas
MERGE (r1:Ruta {codigo: 'R001', origen: 'Chihuahua', destino: 'Aguascalientes', duracion: 2.5, avion: 'AV1', escalas:[1, 3]})
MERGE (r2:Ruta {codigo: 'R002', origen: 'Toluca', destino: 'Querétaro', duracion: 5, avion: 'AV2', escalas:[2, 5, 6]})
MERGE (r3:Ruta {codigo: 'R003', origen: 'La Paz', destino: 'Mexicali', duracion: 1.5, avion: 'AV3', escalas:[7]})
MERGE (r4:Ruta {codigo: 'R004', origen: 'Tuxtla Gutiérrez', destino: 'Cancún', duracion: 4, avion: 'AV4', escalas:[4, 6, 9]})
MERGE (r5:Ruta {codigo: 'R005', origen: 'Oaxaca', destino: 'Chihuahua', duracion: 3, avion: 'AV5', escalas:[8, 2]})
MERGE (r6:Ruta {codigo: 'R006', origen: 'Aguascalientes', destino: 'Toluca', duracion: 6.5, avion: 'AV6', escalas:[1, 4, 7, 9]})
MERGE (r7:Ruta {codigo: 'R007', origen: 'Querétaro', destino: 'La Paz', duracion: 5.2, avion: 'AV7', escalas:[3, 8, 10]})
MERGE (r8:Ruta {codigo: 'R008', origen: 'Mexicali', destino: 'Tuxtla Gutiérrez', duracion: 2, avion: 'AV8', escalas:[5]})
MERGE (r9:Ruta {codigo: 'R009', origen: 'Cancún', destino: 'Oaxaca', duracion: 3.8, avion: 'AV9', escalas:[2, 6]})
MERGE (r10:Ruta {codigo: 'R010', origen: 'Oaxaca', destino: 'Tuxtla Gutiérrez', duracion: 7.1, avion: 'AV10', escalas:[1, 5, 8]})
MERGE (r11:Ruta {codigo: 'R011', origen: 'La Paz', destino: 'Toluca', duracion: 2.5, avion: 'AV1', escalas:[1, 3]})
MERGE (r12:Ruta {codigo: 'R012', origen: 'Chihuahua', destino: 'Cancún', duracion: 5, avion: 'AV2', escalas:[2, 5, 6]})
MERGE (r13:Ruta {codigo: 'R013', origen: 'Mexicali', destino: 'Querétaro', duracion: 1.5, avion: 'AV3', escalas:[7]})
MERGE (r14:Ruta {codigo: 'R014', origen: 'Chihuahua', destino: 'Toluca', duracion: 4, avion: 'AV4', escalas:[4, 6, 9]})
MERGE (r15:Ruta {codigo: 'R015', origen: 'La Paz', destino: 'Tuxtla Gutiérrez', duracion: 3, avion: 'AV5', escalas:[8, 2]})
MERGE (r16:Ruta {codigo: 'R016', origen: 'Oaxaca', destino: 'Aguascalientes', duracion: 6.5, avion: 'AV6', escalas:[1, 4, 7, 9]})
MERGE (r17:Ruta {codigo: 'R017', origen: 'Querétaro', destino: 'Mexicali', duracion: 5.2, avion: 'AV7', escalas:[3, 8, 10]})
MERGE (r18:Ruta {codigo: 'R018', origen: 'Cancún', destino: 'Chihuahua', duracion: 2, avion: 'AV8', escalas:[5]})
MERGE (r19:Ruta {codigo: 'R019', origen: 'La Paz', destino: 'Aguascalientes', duracion: 3.8, avion: 'AV9', escalas:[2, 6]})
MERGE (r20:Ruta {codigo: 'R020', origen: 'Querétaro', destino: 'Toluca', duracion: 7.1, avion: 'AV10', escalas:[1, 5, 8]})

MERGE (p1)-[:PERMISO_RUTA]->(r1)
MERGE (p2)-[:PERMISO_RUTA]->(r2)
MERGE (p3)-[:PERMISO_RUTA]->(r3)
MERGE (p4)-[:PERMISO_RUTA]->(r4)
MERGE (p5)-[:PERMISO_RUTA]->(r5)
MERGE (p16)-[:PERMISO_RUTA]->(r6)
MERGE (p17)-[:PERMISO_RUTA]->(r7)
MERGE (p18)-[:PERMISO_RUTA]->(r8)
MERGE (p19)-[:PERMISO_RUTA]->(r9)
MERGE (p20)-[:PERMISO_RUTA]->(r10)
MERGE (p31)-[:PERMISO_RUTA]->(r11)
MERGE (p32)-[:PERMISO_RUTA]->(r12)
MERGE (p33)-[:PERMISO_RUTA]->(r13)
MERGE (p34)-[:PERMISO_RUTA]->(r14)
MERGE (p35)-[:PERMISO_RUTA]->(r15)

MERGE (p1)-[:PERMISO_RUTA]->(r16)
MERGE (p2)-[:PERMISO_RUTA]->(r17)
MERGE (p3)-[:PERMISO_RUTA]->(r18)
MERGE (p4)-[:PERMISO_RUTA]->(r19)
MERGE (p5)-[:PERMISO_RUTA]->(r20)
MERGE (p16)-[:PERMISO_RUTA]->(r1)
MERGE (p17)-[:PERMISO_RUTA]->(r2)
MERGE (p18)-[:PERMISO_RUTA]->(r3)
MERGE (p19)-[:PERMISO_RUTA]->(r4)
MERGE (p20)-[:PERMISO_RUTA]->(r5)
MERGE (p31)-[:PERMISO_RUTA]->(r6)
MERGE (p32)-[:PERMISO_RUTA]->(r7)
MERGE (p33)-[:PERMISO_RUTA]->(r8)
MERGE (p34)-[:PERMISO_RUTA]->(r9)
MERGE (p35)-[:PERMISO_RUTA]->(r10)

MERGE (p1)-[:PERMISO_RUTA]->(r11)
MERGE (p2)-[:PERMISO_RUTA]->(r12)
MERGE (p3)-[:PERMISO_RUTA]->(r13)
MERGE (p4)-[:PERMISO_RUTA]->(r14)
MERGE (p5)-[:PERMISO_RUTA]->(r15)
MERGE (p16)-[:PERMISO_RUTA]->(r16)
MERGE (p17)-[:PERMISO_RUTA]->(r17)
MERGE (p18)-[:PERMISO_RUTA]->(r18)
MERGE (p19)-[:PERMISO_RUTA]->(r19)
MERGE (p20)-[:PERMISO_RUTA]->(r20)
MERGE (p31)-[:PERMISO_RUTA]->(r1)
MERGE (p32)-[:PERMISO_RUTA]->(r2)
MERGE (p33)-[:PERMISO_RUTA]->(r3)
MERGE (p34)-[:PERMISO_RUTA]->(r4)
MERGE (p35)-[:PERMISO_RUTA]->(r5)

MERGE (p1)-[:PERMISO_RUTA]->(r6)
MERGE (p2)-[:PERMISO_RUTA]->(r7)
MERGE (p3)-[:PERMISO_RUTA]->(r8)
MERGE (p4)-[:PERMISO_RUTA]->(r9)
MERGE (p5)-[:PERMISO_RUTA]->(r10)
MERGE (p16)-[:PERMISO_RUTA]->(r11)
MERGE (p17)-[:PERMISO_RUTA]->(r12)
MERGE (p18)-[:PERMISO_RUTA]->(r13)
MERGE (p19)-[:PERMISO_RUTA]->(r14)
MERGE (p20)-[:PERMISO_RUTA]->(r15)
MERGE (p31)-[:PERMISO_RUTA]->(r16)
MERGE (p32)-[:PERMISO_RUTA]->(r17)
MERGE (p33)-[:PERMISO_RUTA]->(r18)
MERGE (p34)-[:PERMISO_RUTA]->(r19)
MERGE (p35)-[:PERMISO_RUTA]->(r20)
```
- Q01. Obtener la lista de aeropuertos con más de 3 pistas
```cypher
MATCH (a:Aeropuerto)
WHERE a.pistas > 3
RETURN a;
```
- Q02. Obtener la lista de empresas que trabajan en un aeropuerto específico
```cypher
MATCH (a:Aeropuerto {id: 'A1'})<-[:OPERA]-(e:Empresa)
RETURN a,e;
```
- Q03. Obtener la lista de aviones con una autonomía de vuelo mayor a 5000 millas.
```cypher
MATCH (a:Avion)
WHERE a.autonomia > 5000
RETURN a.id, a.modelo, a.autonomia;
```
- Q04. Obtener la lista de pilotos que tienen licencia para volar una ruta específica
```cypher
MATCH (p:Personal {categoria: 'Piloto'})-[:PERMISO_RUTA]->(r:Ruta {codigo: 'R003'})
RETURN p.nombres;
```
- Q05. Obtener la lista de países en los que una empresa internacional no puede operar
```cypher
MATCH (e:Empresa {RFC: 'RFC1234', tipo: 'Internacional'})
RETURN e.paisesNoOperar;
```
- Q06. Eliminar una empresa que ya no trabaja en un aeropuerto específico. Eliminar también la información asociada
```cypher
MATCH (a:Aeropuerto {id: 'A1'})<-[:OPERA]-(e:Empresa {RFC: 'RFC1234'})
DETACH DELETE e;
```
- Q07. Encontrar las empresas que tienen más de 10 aviones y que trabajan en al menos dos aeropuertos diferentes.
```cypher
MATCH (e:Empresa)-[:POSEE]->(a:Avion)
MATCH (e)-[:OPERA]->(ae:Aeropuerto)
WITH e, COUNT(DISTINCT a) AS numAviones, COUNT(DISTINCT ae) AS numAeropuertos
WHERE numAviones > 10 AND numAeropuertos >= 2
RETURN e.nombre AS empresa, numAviones, numAeropuertos
```
- Q08. Obtener la lista de rutas que son operadas por pilotos con licencia de tipo ATPL y que tienen una duración de vuelo mayor a 2 horas
```cypher
MATCH (p:Personal {categoria: 'Piloto', licencia: 'ATPL'})-[:PERMISO_RUTA]->(r:Ruta)
WHERE r.duracion > 2
RETURN r.codigo, r.duracion;
```
- Q09. Obtener la lista de personal de tierra que tiene más de 3 certificaciones y que trabaja para empresas que tienen más de 20 aviones.
```cypher
MATCH (p:Personal {categoria: 'Personal de Tierra'})-[:TRABAJA]->(e:Empresa)
MATCH (e)-[:POSEE]->(a:Avion)
WITH e, p, SIZE(p.certificaciones) AS numCertificaciones, COUNT(DISTINCT a) AS numAviones
WHERE numCertificaciones > 3 AND numAviones > 20
RETURN p.nombres, p.certificaciones;
```
- Q10. Encontrar las rutas que son operadas por al menos dos empresas diferentes y que tienen una escala en un aeropuerto específico. (NO)
```cypher
MATCH (e1:Empresa)-[:OPERA]->(r:Ruta)<-[:OPERA]-(e2:Empresa), (a:Aeropuerto {id: 'A1'})
WHERE e1 <> e2
RETURN r.codigo, a.nombre;
```
- Q11. Agregar una nueva ruta de vuelo entre dos aeropuertos que implique tres escalas (tres nodos intermedios) entre el origen y el destino. (NO)
```cypher
CREATE (r:Ruta {codigo: 'R456', origen: 'Querétaro', destino: 'Tuxtla Gutiérrez', escalas: [4, 5, 6]});
```
- Q12. Por cuestiones de política laboral una empresa requiere dar de baja del sistema a todos sus pilotos.
```cypher
MATCH (e:Empresa {RFC: 'NAT001'})<-[:TRABAJA]-(n) 
WHERE n.categoria = 'Piloto' 
DETACH DELETE n RETURN e,n
```
- Q13. Una venta de activos implica que todos los vuelos, pilotos, personal, etc, deben pasar de una empresa a otra.
```cypher
MATCH (eOld:Empresa {RFC: "NAT001"})
MATCH (eNew:Empresa {RFC: "NAT002"})
MATCH (eOld)-[rel:OPERA]->(ae:Aeropuerto)
MATCH (eOld)-[av:POSEE]->(a:Avion)
MATCH (eOld)<-[tra:TRABAJA]-(p:Personal)
MERGE (eNew)-[:OPERA]->(ae)
MERGE (eNew)-[:POSEE]->(a)
MERGE (eNew)<-[:TRABAJA]-(p)
DELETE av
DELETE rel
DELETE tra
DETACH DELETE eOld
```
- Q14. Se requiere listar todos los vuelos incluyendo las escalas que realiza cada vuelo.
```cypher
MATCH (r:Ruta)
RETURN r.codigo, r.escalas;
```
- Q15. Un aeropuerto será remodelado por lo que el aeropuerto debe ser eliminado y todas sus operaciones deben ser reasignadas.
```cypher
MATCH (aeOld:Aeropuerto {id: 3})
MATCH (aeNew:Aeropuerto {id: 5})
MATCH (e:Empresa)-[rel:OPERA]->(aeOld)
MATCH (a:Avion)-[vue:OPERA_EN]->(aeOld)
MERGE (e)-[:OPERA]->(aeNew)
MERGE (a)-[:OPERA_EN]->(aeNew)
DELETE rel
DELETE vue
WITH aeOld
DETACH DELETE aeOld
```

---
## Código del backend
[Repo de github](https://github.com/IsidroFF/backend_neo4j)  
Estructura de carpetas y archivos
- src
	- cache
		- logger.js
	- controllers
		- aeropuertos.controllers.js
		- aviones.controllers.js
		- empleados.controllers.js
		- empresas.controllers.js
	- database
		- neo4j.database.js
		- redis.database.js
	- routes
		- aeropuertos.routes.js
		- aviones.routes.js
		- empleados.routes.js
		- empresas.routes.js
	- app.js
	- server.js
- .env
- docker-compose.yml

### src/cache/logger.js
```js
const client = require('../database/redis.database')

// Exportar una función middleware que se ejecutará en cada solicitud
module.exports = (req, res, next) => {
    res.on('finish', async () => {

        let fecha = new Date();

        const key = `${req.method}: ${fecha.toLocaleDateString()}: ${fecha.getHours()}-${fecha.getMinutes()}-${fecha.getSeconds()}: ${req.originalUrl}`;
        const valor = JSON.stringify({
            clave: key,
            time: new Date(),
            req: {
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                body: req.body
            },
            res: {
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                response: req.method === 'GET' ? res.data : null
            }
        });

        await client.sendCommand([
            'JSON.SET',
            key,
            '.',
            valor
        ]);
    });
    next();
};
```

### src/controllers/aeropuertos.controllers.js
```js
const neo4jConnection = require('../database/neo4j.database.js')

const obtenerAeropuertosMedianos = async (req, res) => {
    const session = neo4jConnection.session();
    const { pistas } = req.body;

    try {
        const result = await session.run(
            'MATCH (a:Aeropuerto) WHERE a.pistas > $pistas RETURN a;',
            { pistas }
        );

        const Aeropuertos = result.records.map(record => record.get('a').properties);

        res.data = Aeropuertos;
        res.status(200).json({
            message: "Successfull",
            data: {
                pistas,
                Aeropuertos
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};


const reasignarAeropuerto = async (req, res) => {
    const session = neo4jConnection.session();
    const { idOldAe, idNewAe } = req.body;

    try {
        const result = await session.run(
            `MATCH (aeOld:Aeropuerto {id: $idOldAe}) MATCH (aeNew:Aeropuerto {id: $idNewAe}) MATCH (e:Empresa)-[rel:OPERA]->(aeOld) MATCH (a:Avion)-[vue:OPERA_EN]->(aeOld) MERGE (e)-[:OPERA]->(aeNew) MERGE (a)-[:OPERA_EN]->(aeNew) DELETE rel DELETE vue WITH aeOld DETACH DELETE aeOld`,
            { idOldAe, idNewAe }
        );

        res.data = result;

        res.status(200).json({
            message: "Successfull",
            data: {
                idOldAe, 
                idNewAe, 
                result
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

module.exports = {
    obtenerAeropuertosMedianos,
    reasignarAeropuerto
}

```
### src/controllers/aviones.controllers.js
```js
const neo4jConnection = require('../database/neo4j.database.js')

const autonomiaAvionres = async (req, res) => {
    const session = neo4jConnection.session();
    const { autonomia } = req.body;

    try {
        const result = await session.run(
            'MATCH (a:Avion) WHERE a.autonomia > $autonomia RETURN a',
            { autonomia }
        );

        const Aviones = result.records.map(record => record.get('a').properties);

        res.data = Aviones;
        res.status(200).json({
            message: "Successfull",
            data: {
                autonomia,
                Aviones
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

module.exports = {
    autonomiaAvionres
}

```
### src/controllers/empleados.controllers.js
```js
const neo4jConnection = require('../database/neo4j.database.js')

const certificados = async (req, res) => {
    const session = neo4jConnection.session();
    const { id } = req.body;

    try {
        const result = await session.run(
            `MATCH (per:Personal { id: $id}) RETURN per.certificaciones`,
            { id }
        );

        const certificaciones = result.records.map(record => record.get('per.certificaciones'));

        res.data = certificaciones;

        res.status(200).json({
            message: "Successfull",
            data: {
                id,
                certificaciones
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

const eliminarRutasPilotos = async (req, res) => {
    const session = neo4jConnection.session();
    const { idPiloto } = req.body;

    try {
        const result = await session.run(
            `MATCH (p:Personal {categoria:"Piloto", id: $idPiloto })-[rel:PERMISO_RUTA]->(n) DETACH DELETE rel RETURN p,n`,
            { idPiloto }
        );

        res.data = result;
        
        res.status(200).json({
            message: "Successfull",
            data: {
                idPiloto,
                result
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

module.exports = {
    certificados,
    eliminarRutasPilotos
}
```
### src/controllers/empresas.controllers.js
```js
const neo4jConnection = require('../database/neo4j.database.js')

const paisesSinOperacionEI = async (req, res) => {
    const session = neo4jConnection.session();
    const { rfc } = req.body;

    try {
        const result = await session.run(
            `MATCH (e:Empresa {RFC: $rfc, tipo: 'Internacional'}) RETURN e.paisesSinOperacion AS paisesSinOperacion;`,
            { rfc }
        );

        const paisesSinOperacion = result.records.map(record => record.get('paisesSinOperacion'));

        res.data = paisesSinOperacion;

        res.status(200).json({
            message: "Successfull",
            data: {
                rfc,
                paisesSinOperacion
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

const empresasEnAeropuertos = async (req, res) => {
    const session = neo4jConnection.session();
    const { id } = req.body;

    try {
        const result = await session.run(
            `MATCH (a:Aeropuerto {id: $id})<-[:OPERA]-(e:Empresa) RETURN e.nombre`,
            { id }
        );

        const empresasOperaAeropuerto = result.records.map(record => record.get('e.nombre'));

        res.data = empresasOperaAeropuerto;

        res.status(200).json({
            message: "Successfull",
            data: {
                id,
                empresasOperaAeropuerto
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

const eliminarEmpresaAeropuerto = async (req, res) => {
    const session = neo4jConnection.session();
    const { idAeropuerto, rfcEmpresa } = req.body;

    try {
        const result = await session.run(
            `MATCH (a:Aeropuerto {id: $idAeropuerto })<-[rel:OPERA]-(e:Empresa {RFC: $rfcEmpresa}) DETACH DELETE e;`,
            { idAeropuerto, rfcEmpresa }
        );
        
        const comprobacion = await session.run(
            `MATCH (a:Aeropuerto {id: $idAeropuerto})<-[:OPERA]-(e:Empresa) RETURN e.nombre`,
            { idAeropuerto }
        );

        const empresasOperaAeropuerto = comprobacion.records.map(record => record.get('e.nombre'));

        res.data = empresasOperaAeropuerto;

        res.status(200).json({
            message: "Successfull",
            data: {
                idAeropuerto, 
                rfcEmpresa,
                empresasOperaAeropuerto
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

const emmpleadosEmpresa = async (req, res) => {
    const session = neo4jConnection.session();
    const { rfc } = req.body;

    try {
        const result = await session.run(
            `MATCH (e:Empresa {RFC: $rfc })<-[:TRABAJA]-(n) RETURN n.nombres`,
            { rfc }
        );

        const listaEmplados = result.records.map(record => record.get('n.nombres'));

        res.data = listaEmplados;

        res.status(200).json({
            message: "Successfull",
            data: {
                rfc,
                listaEmplados
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

const eliminarPilotos = async (req, res) => {
    const session = neo4jConnection.session();
    const { rfc } = req.body;

    try {
        // Primero, obtenemos los pilotos y los eliminamos
        const eliminarResult = await session.run(
            `MATCH (e:Empresa {RFC: $rfc})<-[:TRABAJA]-(n) WHERE n.categoria = 'Piloto' DETACH DELETE n RETURN e`,
            { rfc }
        );

        // Luego, buscamos los empleados restantes (excluyendo pilotos)
        const result = await session.run(
            `MATCH (e:Empresa {RFC: $rfc})<-[:TRABAJA]-(n) RETURN n.nombres AS nombres, n.categoria AS categoria`,
            { rfc }
        );

        const listaEmpleados = result.records.map(record => ({
            nombres: record.get('nombres'),
            categoria: record.get('categoria')
        }));

        res.data = listaEmpleados;
        
        res.status(200).json({
            message: "Successfull",
            data: {
                rfc,
                listaEmpleados
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

const reasignarEmpresa = async (req, res) => {
    const session = neo4jConnection.session();
    const { rfcOld, rfcNew } = req.body;

    try {
        // Primero, obtenemos los pilotos y los eliminamos
        const result = await session.run(
            `MATCH (eOld:Empresa {RFC: $rfcOld})
             MATCH (eNew:Empresa {RFC: $rfcNew})
             MATCH (eOld)-[rel:OPERA]->(ae:Aeropuerto)
             MATCH (eOld)-[av:POSEE]->(a:Avion)
             MATCH (eOld)<-[tra:TRABAJA]-(p:Personal)
             MERGE (eNew)-[:OPERA]->(ae)
             MERGE (eNew)-[:POSEE]->(a)
             MERGE (eNew)<-[:TRABAJA]-(p)
             DELETE av
             DELETE rel
             DELETE tra
             DETACH DELETE eOld`,
            { rfcOld, rfcNew }
        );

        res.data = result;
        
        res.status(200).json({
            message: "Successfull",
            data: {
                rfcOld, 
                rfcNew,
                result
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

const eliminarAviones = async (req, res) => {
    const session = neo4jConnection.session();
    const { rfc } = req.body;

    try {
        // Primero, obtenemos los pilotos y los eliminamos
        const result = await session.run(
            `MATCH (e:Empresa {RFC: $rfc})-[r:POSEE]->(n) DELETE r RETURN e, n;`,
            { rfc }
        );

        res.data = result;
        
        res.status(200).json({
            message: "Successfull",
            data: {
                rfc,
                result
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        await session.close();
    }
};

module.exports = {
    paisesSinOperacionEI,
    empresasEnAeropuertos,
    eliminarEmpresaAeropuerto,
    emmpleadosEmpresa,
    eliminarPilotos,
    reasignarEmpresa,
    eliminarAviones
}

```
### src/database/neo4j.database.js
```js
const neo4j = require("neo4j-driver");
const dotenv = require('dotenv')

dotenv.config()

const NEO4J_URL = process.env.NEO4J_URL

const driver = neo4j.driver(
    NEO4J_URL,
    neo4j.auth.basic('neo4j', 'neo4j')
);

module.exports = driver
```
### src/database/redis.database.js
```js
const redis = require('redis');
const dotenv = require('dotenv')

dotenv.config()

const REDIS_URL = process.env.REDIS_URL

const client = redis.createClient({
    socket: {
        port: 6379,
        host: REDIS_URL
    }
});

module.exports = client
```
### src/routes/aeropuertos.routes.js
```js
const express = require('express');
const router = express.Router();

const { obtenerAeropuertosMedianos, reasignarAeropuerto } = require('../controllers/aeropuertos.controllers.js');

router.get('/med', obtenerAeropuertosMedianos)
router.delete('/reasignar', reasignarAeropuerto)

module.exports = router 
```
### src/routes/aviones.routes.js
```js
const express = require('express');
const router = express.Router();

const { autonomiaAvionres } = require('../controllers/aviones.controllers.js');

router.get('/autonomia', autonomiaAvionres)

module.exports = router 
```
### src/routes/empleados.routes.js
```js
const express = require('express');
const router = express.Router();

const { certificados, eliminarRutasPilotos } = require('../controllers/empleados.controllers');

router.get('/certificados', certificados);
router.delete('/pilotos/rutas', eliminarRutasPilotos);

module.exports = router 
```
### src/routes/empresas.routes.js
```js
const express = require('express');
const router = express.Router();

const { 
    paisesSinOperacionEI, 
    empresasEnAeropuertos, 
    eliminarEmpresaAeropuerto, 
    emmpleadosEmpresa, 
    eliminarPilotos, 
    reasignarEmpresa,
    eliminarAviones
} = require('../controllers/empresas.controllers.js');

router.get('/int/nopaises', paisesSinOperacionEI);
router.get('/aeropuertos', empresasEnAeropuertos);
router.get('/empleados', emmpleadosEmpresa);

router.delete('/aeropuertos', eliminarEmpresaAeropuerto);
router.delete('/empleados/pilotos', eliminarPilotos);
router.delete('/reasignar', reasignarEmpresa);
router.delete('/aviones', eliminarAviones);

module.exports = router 
```
### app.js
```js
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const logger = require('./cache/logger');

// Rutas
const AeropuertosRouter = require('./routes/aeropuertos.routes.js');
const EmpresaRouter = require('./routes/empresas.routes.js');
const AvionesRouter = require('./routes/aviones.routes.js');
const EmpleadosRouter = require('./routes/empleados.routes.js')

//middlewares
app.use(logger)
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

// Permitir JSON en las peticiones
app.use(express.json());

// Rutas de NEO4J
app.use('/aeropuertos', AeropuertosRouter);
app.use('/empresas', EmpresaRouter);
app.use('/aviones', AvionesRouter);
app.use('/empleados', EmpleadosRouter);

// Exportamos la aplicacion de express creada
module.exports = app
```
### server.js
```js
// Imports
const redisConnection = require("./database/redis.database.js");
const app = require('./app.js')
const dotenv = require('dotenv');


// Configuraciones de las variables de entorno
dotenv.config();
const PORT = process.env.PORT;

// Conexión con la base de datos
redisConnection
    .on('error', err => console.log('Redis Client Error', err))
    .connect()
    .then(() => console.log("Conectado a redis"));

// Ejecución de la aplicación
app.listen(PORT, () => {
    console.log('Server en http://localhost:' + PORT);
});

```
### .env
```.env
REDIS_URL=172.17.0.3
NEO4J_URL=neo4j://172.17.0.2
PORT=3000
```
### docker-compose.yml
```yml
version: '3.9'
services:
  neo4j:
    image: neo4j
    container_name: neo_presentacion
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=none
    networks:
      - backend

  redis_stack:
    image: redis/redis-stack
    container_name: stack2
    ports:
      - "6379:6379"
      - "8001:8001"
    networks:
      - backend

  backend_app:
    image: isidroitt/node_neo4j_api:latest
    container_name: "node_app"
    ports:
      - "3000:3000"
    networks:
      - backend
    environment:
      REDIS_URL: stack2
      NEO4J_URL: neo4j://neo_presentacion:7687
    depends_on:
      - redis_stack
      - neo4j

networks:
  backend:
    driver: bridge
```

## Consultas POSTMAN
```json
{
	"info": {
		"_postman_id": "e492703c-3a6a-4650-a27b-2d9c3cd8b500",
		"name": "AeropuertosNeo4J-IAFF",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "29492134"
	},
	"item": [
		{
			"name": "Q1 - get - Aeropuertos pistas",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"pistas\" : 3\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/aeropuertos/med",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"aeropuertos",
						"med"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q2 - get - Empresas que operan en aeropuertos",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"id\": 1\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/empresas/aeropuertos",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empresas",
						"aeropuertos"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q3 - get - Autonomia Aviones",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"autonomia\": 5000\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/aviones/autonomia",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"aviones",
						"autonomia"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q5 - get -Empresas Internacionales",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"rfc\": \"INT006\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/empresas/int/nopaises",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empresas",
						"int",
						"nopaises"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q? - get - Empleados empresa",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"rfc\": \"INT002\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/empresas/empleados",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empresas",
						"empleados"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q? - get - Empleado Certificaciones",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"id\": \"P026\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/empleados/certificados",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empleados",
						"certificados"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q6 - mod - Eliminar empresa de aeropuerto",
			"request": {
				"method": "DELETE",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"idAeropuerto\": 1, \n    \"rfcEmpresa\": \"CON002\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/empresas/aeropuertos",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empresas",
						"aeropuertos"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q12 - mod - Eliminar pilotos",
			"request": {
				"method": "DELETE",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"rfc\": \"NAT003\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/empresas/empleados/pilotos",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empresas",
						"empleados",
						"pilotos"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q13 - mod - Reasignar empresa",
			"request": {
				"method": "DELETE",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"rfcOld\":\"NAT001\",\n    \"rfcNew\":\"NAT002\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/empresas/reasignar",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empresas",
						"reasignar"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q15 - mod - Reasignar aeropuerto",
			"request": {
				"method": "DELETE",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{ \n    \"idOldAe\": 3, \n    \"idNewAe\": 2 \n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/aeropuertos/reasignar",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"aeropuertos",
						"reasignar"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q? - mod - Eliminar aviones",
			"request": {
				"method": "DELETE",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"rfc\": \"NAT002\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/empresas/aviones",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empresas",
						"aviones"
					]
				}
			},
			"response": []
		},
		{
			"name": "Q? - mod - Eliminar rutas pilotos",
			"request": {
				"method": "DELETE",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"idPiloto\": \"P018\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/empleados/pilotos/rutas",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"empleados",
						"pilotos",
						"rutas"
					]
				}
			},
			"response": []
		}
	],
	"event": [
		{
			"listen": "test",
			"script": {
				"exec": [
					"pm.test(\"Body matches string\", function () {",
					"    pm.expect(pm.response.text()).to.include(\"Successfull\");",
					"});",
					"pm.test(\"Status code is 200\", function () {",
					"    pm.response.to.have.status(200);",
					"});"
				],
				"type": "text/javascript"
			}
		}
	]
}
```