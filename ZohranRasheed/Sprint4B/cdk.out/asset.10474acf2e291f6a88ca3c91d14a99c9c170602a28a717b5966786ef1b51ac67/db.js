const { MongoClient, ServerApiVersion } = require('mongodb');

async function dbGet(filter) {
    const uri = "mongodb+srv://muhammadsaif2022sculptor:sculptor22@cluster-saif-skipq.emq45nb.mongodb.net/?retryWrites=true&w=majority&ssl=true"; 
    const client = new MongoClient(uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        const res = await client.db('WebHealth').collection('urls').find(filter).toArray()
        return res
    } catch (e) {
        res.status(502).send(e)
    }
    finally {
        await client.close()
    }
}


async function dbCreate(body) {
    const uri = "mongodb+srv://muhammadsaif2022sculptor:sculptor22@cluster-saif-skipq.emq45nb.mongodb.net/?retryWrites=true&w=majority&ssl=true"; 
    const client = new MongoClient(uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        let res = await client.db('WebHealth').collection('urls').find({ url: body.url }).toArray();
        if (res.length > 0) {
            console.log('res', res);
            return res;
        }
        else {
            console.log('post', body)
            res = await client.db('WebHealth').collection('urls').insertOne(body);
            return res;
        }
    } catch (e) {
        res.status(502).send(e)
    }
    finally {
        await client.close()
    }
}


async function dbRemove(id) {
    const uri = "mongodb+srv://muhammadsaif2022sculptor:sculptor22@cluster-saif-skipq.emq45nb.mongodb.net/?retryWrites=true&w=majority&ssl=true"; 
    const client = new MongoClient(uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        const filter = {
            "_id": id
        }
        const res = await client.db('WebHealth').collection('urls').deleteOne(filter);
        return res;
    } catch (e) {
        res.status(502).send(e)
    }
    finally {
        await client.close()
    }
}



async function dbUpdate(id, url) {
    const uri = "mongodb+srv://muhammadsaif2022sculptor:sculptor22@cluster-saif-skipq.emq45nb.mongodb.net/?retryWrites=true&w=majority&ssl=true"; 
    const client = new MongoClient(uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        const filter = {
            "_id": id
        }
        const res = await client.db('WebHealth').collection('urls').updateOne(filter, { 
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
