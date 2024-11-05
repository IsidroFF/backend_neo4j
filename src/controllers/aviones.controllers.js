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
