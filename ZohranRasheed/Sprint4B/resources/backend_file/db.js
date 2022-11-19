const { MongoClient, ServerApiVersion, ObjectID } = require('mongodb');


/**
   * Create new record
   * @returns the result of GET operaton
*/
async function dbGet(filter) {
    const uri = "mongodb+srv://zohran2022skipq:rasheed5269496@cluster0.lmrrm.mongodb.net/Sprint4Database?retryWrites=true&w=majority"; 
    const client = new MongoClient(uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        const res = await client.db('Sprint4Database').collection('myurlcollections').find(filter).toArray()
        return res
    } catch (e) {
        res.status(502).send(e)
    }
    finally {
        await client.close()
    }
}

/**
   * Create new record
   * @param body contains URL to store in new record
   * @returns the result of POST operaton
*/
async function dbCreate(body) {
    const uri = "mongodb+srv://zohran2022skipq:rasheed5269496@cluster0.lmrrm.mongodb.net/Sprint4Database?retryWrites=true&w=majority"; 
    const client = new MongoClient(uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        let res = await client.db('Sprint4Database').collection('myurlcollections').find({ url: body.url }).toArray();
        if (res.length > 0) {
            console.log('res', res);
            return res;
        }
        else {
            console.log('post', body)
            res = await client.db('Sprint4Database').collection('myurlcollections').insertOne(body);
            return res;
        }
    } catch (e) {
        res.status(502).send(e)
    }
    finally {
        await client.close()
    }
}

/**
   * Remove record
   * @param id id to match the record
   * @returns the result of DELETE operaton
*/
async function dbRemove(id) {
    const uri = "mongodb+srv://zohran2022skipq:rasheed5269496@cluster0.lmrrm.mongodb.net/Sprint4Database?retryWrites=true&w=majority"; 
    const client = new MongoClient(uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        const filter = {
            "_id": ObjectID(id)
        }
        const res = await client.db('Sprint4Database').collection('myurlcollections').deleteOne(filter);
        return res;
    } catch (e) {
        res.status(502).send(e)
    }
    finally {
        await client.close()
    }
}


/**
   * Update record
   * @param id id to match the record
   * @param url updated url to store
   * @returns the result of PUT operaton
*/
async function dbUpdate(id, url) {
    const uri = "mongodb+srv://zohran2022skipq:rasheed5269496@cluster0.lmrrm.mongodb.net/Sprint4Database?retryWrites=true&w=majority"; 
    const client = new MongoClient(uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        const filter = {
            "_id": ObjectID(id)
        }
        const res = await client.db('Sprint4Database').collection('myurlcollections').updateOne(filter, { 
            $set: { url: url } 
        });
        return res;
    } catch (e) {
        res.status(502).send(e)
    }
    finally {
        await client.close()
    }
}


exports.dbGet = dbGet;
exports.dbCreate = dbCreate;
exports.dbRemove = dbRemove;
exports.dbUpdate = dbUpdate;
