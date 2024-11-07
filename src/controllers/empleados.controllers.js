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