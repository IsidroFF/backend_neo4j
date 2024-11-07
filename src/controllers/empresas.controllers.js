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
