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

module.exports = {
    obtenerAeropuertosMedianos
}
