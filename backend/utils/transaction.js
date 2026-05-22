const mongoose = require('mongoose');

async function runInTransaction(callback) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await callback(session);
        await session.commitTransaction();
        return result;
    } catch (err) {
        await session.abortTransaction();

        const noReplicaSet =
            err.message?.includes('replica set') ||
            err.message?.includes('mongos') ||
            err.code === 20;

        if (noReplicaSet) {
            return callback(null);
        }
        throw err;
    } finally {
        session.endSession();
    }
}

module.exports = { runInTransaction };
