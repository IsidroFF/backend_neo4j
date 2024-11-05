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

module.exports = {
    certificados
}