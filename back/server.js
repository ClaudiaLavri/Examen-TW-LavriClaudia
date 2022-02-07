const Sequelize = require('sequelize');
const sequelize = require('./database/db.js');
const express = require('express');
const app = express();
const fs = require('fs');
const parse = require('csv-parser');
const parseCsv = require('csvtojson');
const objToCsv = require('objects-to-csv');
const cors = require("cors");

var dataSpacecraft;

const Spacecraft = require('./models/Spacecraft.js');
const Astronaut = require('./models/Astronaut.js');

Spacecraft.hasMany(Astronaut, {
    foreignKEy: 'SpacecraftIdSpace',
    sourceKey: 'idSpace'
})

app.use((err, req, res, next) => {
    console.error("[ERROR]:" + err);
    res.status(500).json({ message: "Server Error" });
});

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.use(cors());

//sincronizare baza de date
// (async () => {
//     await sequelize.sync({ alter: true });
// })();

const port = 4000;
app.listen(port, () => {
    console.log("Server is running on port 4000");
});

//////////////////SPACECRAFT///////////////////
app.get('/spacecraft', async (req, res, next) => {

    try {
        var spacecraft;
        var spacecraft_sort;

        //filtare
        if (req.query.numeSpace) {
            if (req.query.viteza) {
                spacecraft = await Spacecraft.findAll({
                    where: {
                        numeSpace: req.query.numeSpace,
                        viteza: req.query.viteza
                    }
                })
            }
            else {
                spacecraft = await Spacecraft.findAll({
                    where: {
                        numeSpace: req.query.numeSpace
                    }
                })
            }
        } else if (req.query.viteza) {
            spacecraft = await Spacecraft.findAll({
                where: {
                    viteza: req.query.viteza
                }
            })
        }
        else {
            spacecraft = await Spacecraft.findAll();
        }

        //sortare
        if (req.xhr && req.query.numeSpace && req.query.viteza) {
            spacecraft_sort = await Spacecraft.findAll(
                {
                    where: {
                        numeSpace: req.query.numeSpace,
                        viteza: req.query.viteza
                    },
                    order: [
                        ['numeSpace', 'ASC']
                    ]
                });
            res.status(200).json(spacecraft_sort);
        } else if (req.xhr && req.query.numeSpace) {
            spacecraft_sort = await Spacecraft.findAll(
                {
                    where: {
                        numeSpace: req.query.numeSpace
                    },
                    order: [
                        ['numeSpace', 'ASC']
                    ]
                });
            res.status(200).json(spacecraft_sort);
        } else if (req.xhr) {
            spacecraft_sort = await Spacecraft.findAll({
                order: [
                    ['numeSpace', 'ASC']
                ]
            });
            res.status(200).json(spacecraft_sort);
        }

        //paginare
        var spacecraft_pag;
        if (req.query.limit) {
            if (req.query.skip) {
                spacecraft_pag = spacecraft.slice(req.query.skip * req.query.limit, (req.query.skip + 1) * req.query.limit);
            } else {
                spacecraft_pag = spacecraft.slice(0, req.query.limit);
            }
            res.status(200).json(spacecraft_pag);
        } else {
            res.status(200).json(spacecraft);
        }
    } catch (error) {
        next(error);
    }
})

app.post('/spacecraft', async (req, res, next) => {
    try {
        await Spacecraft.create(req.body);
        res.status(201).json({ message: "Spacecraft creat!" })
    } catch (error) {
        next(error);
    }
})

app.delete('/spacecraft/:idSpace', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.idSpace, { include: Astronaut });
        if (spacecraft) {
            await spacecraft.destroy();
            res.status(202).json({ message: 'Spacecraft sters!' });
        } else {
            res.status(404).json({ message: 'Spacecraft-ul nu a fost gasit!' });
        }
    } catch (err) {
        next(err);
    }
})

//put
app.put('/spacecraft/:idSpace', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.idSpace);
        if (spacecraft) {
            spacecraft.numeSpace = req.body.numeSpace;
            spacecraft.viteza = req.body.viteza;
            spacecraft.masa = req.body.masa;
            await spacecraft.save();
            res.status(204).json({ message: "Spacecraft modificat!" });
        } else {
            res.status(404).json({ message: "Nu s-a gasit spacecraftul!" });
        }
    } catch (error) {
        next(error);
    }
})


///////////////////ASTRONAUT//////////////////////
app.get('/spacecraft/:idSpace/astronaut', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.idSpace, {
            include: [Astronaut]
        });
        if (spacecraft) {
            res.status(200).json(spacecraft.Astronauts);
        } else {
            res.status(404).json({ message: "Nu s-au gasit astronauti pentru spacecraftul selectat!" });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/spacecraft/:idSpace/astronaut', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.idSpace);
        if (spacecraft) {
            const astronaut = new Astronaut(req.body);
            astronaut.SpacecraftIdSpace = spacecraft.idSpace;
            await astronaut.save();
            res.status(201).json({ message: "Astronaut creat!" });
        } else {
            res.status(404).json({ message: "Spacecraftul nu a fost gasit!" });
        }
    } catch (error) {
        next(error);
    }
})


app.put('/spacecraft/:idSpace/astronaut/:idAstronaut', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.idSpace);
        if (spacecraft) {
            const astronauti = await spacecraft.getAstronauts({ where: { idAstronaut: req.params.idAstronaut } });
            const astronaut = astronauti.shift();
            if (astronaut) {
                astronaut.numeAstronaut = req.body.numeAstronaut;
                astronaut.rol = req.body.rol;
                await astronaut.save();
                res.status(203).json({ message: "Astronaut modificat!" });
            } else {
                res.status(404).json({ message: "Astronautul nu a fost gasit!" });
            }
        } else {
            res.status(404).json({ message: "Spacecraftul nu a fost gasit!" });
        }
    } catch (error) {
        next(error);
    }
})

app.delete('/spacecraft/:idSpace/astronaut/:idAstronaut', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.idSpace);
        if (spacecraft) {
            const astronauti = await spacecraft.getAstronauts({ where: { idAstronaut: req.params.idAstronaut } });
            const astronaut = astronauti.shift();
            if (astronaut) {
                spacecraft.removeAstronauts(astronaut);
                await spacecraft.save();
                await astronaut.destroy();
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        next(error);
    }
})


///IMPORT
app.post('/', async (req, res, next) => {
    // dataSpacecraft = fs.createReadStream('Spacecraft.csv').pipe(parse())
    //     .on('data', (rand) => {
    //         const spacecraft = JSON.parse(rand);
    //         Spacecraft.create(spacecraft);
    //     })
    //     .on('end', () => {
    //         console.log('CSV file successfully processed');
    //     });

    dataSpacecraft = await parseCsv().fromFile('Spacecraft.csv');

    try {
        const spaceVector = JSON.parse(JSON.stringify(dataSpacecraft));
        for(let s of spaceVector){
            const spacecraft = await Spacecraft.create(s);
            
        }
    } catch (err) {
        console.error(err)
    }

    res.status(210).json({ message: "Spacecraft-uri adaugate din csv!" })
})

///EXPORT
app.get('/', async (req, res, next) => {
    const spacecraft = await Spacecraft.findAll();
    const toCsv = new objToCsv(spacecraft);
    await toCsv.toDisk('./export.csv');
    res.status(211).json({ message: "Spacecraft-uri exportate in csv!" })
})