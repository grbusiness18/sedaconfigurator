'use strict'
process.env.NODE_ENV = 'test'

var chai = require('chai')
var chaihttp = require('chai-http')
var server = 'http://localhost:3000/api/v1'
var should = chai.should()
var expect = chai.expect

var newapp = {}
var newintent = {}
var newresponse = []
var newentity = []
var newaction = []
var jwttoken = {}

chai.use(chaihttp)

// Apps Parent Block
describe('Apps', () => {
    /**
     * Test for POST Apps
     */
    describe('/POST create new apps', () => {
        it('it should not POST apps without recast config object or app description', (done) => {
            var app = {
                description: "Test app mocha"
            }
            chai.request(server)
                .post('/apps/create')
                .set('content-type', 'application/json')
                .send(app).end((err, res) => {
                    expect(res).to.have.status(405);
                    done()
                })
        })

        it('it should POST apps successfully', (done) => {
            var app = {
                name: "mochaapp",
                description: "Test app mocha",
                recast: {
                    token: "3472987529857892375892",
                    threshold: 75
                }
            }
            chai.request(server)
                .post('/apps/create')
                .set('content-type', 'application/json')
                .send(app).end((err, res) => {
                    expect(res).to.have.status(201)
                    expect(res.body).should.have.a('object')
                    newapp = res.body
                    done()
                })
        })
    })

    /**
     * Test for GET APPS ALL
     */

    describe('/GET/ALL get all apps', () => {
        it('it should GET all apps either empty or filled array', (done) => {
            chai.request(server)
                .get('/apps/all')
                .send().end((err, res) => {
                    expect(res).to.have.status(200)
                    res.body.should.have.a('array')
                    done()
                })
        })
    })


    /**
     * Test for GET APP BY ID
     */

    describe('/GET/APPID get app by ID', () => {
        it('it should GET the app by ID', (done) => {
            chai.request(server)
                .get('/apps/' + newapp._id)
                .send().end((err, res) => {
                    expect(res).to.have.status(200)
                    res.body.should.have.a('object')
                    done()
                })
        })
    })

    /**
     * Test for GET APP BY ID
     */

    describe('/PUT/APPID Update app by ID', () => {
        it('it should UPDATE the app by ID', (done) => {
            var app =   {
                description: "test mocha app by id"
            }
            chai.request(server)
                .put('/apps/' + newapp._id)
                .send(app).end((err, res) => {
                    expect(res).to.have.status(201)
                    res.body.should.have.a('object')
                    expect(res.body.description).to.be.equal(app.description)
                    done()
                })
        })
    })



    // Intents Parent Block
    describe('Intents', () => {
        /**
         * Test for POST Apps
         */
        describe('/POST create new Intents', () => {
            it('it should not POST Intents without intent name or description', (done) => {
                var intent = {
                    description: "Test Intent created by mocha"
                }
                chai.request(server)
                    .post('/apps/' + newapp._id + '/intents/create')
                    .set('content-type', 'application/json')
                    .send(intent).end((err, res) => {
                        expect(res).to.have.status(405);
                        done()
                    })
            })

            it('it should POST apps successfully', (done) => {
                var intent = {
                    intent_name: "mochatestintent",
                    description: "Test Intent created by mocha"
                }
                chai.request(server)
                    .post('/apps/' + newapp._id + '/intents/create')
                    .set('content-type', 'application/json')
                    .send(intent).end((err, res) => {
                        expect(res).to.have.status(201)
                        expect(res.body).should.have.a('object')
                        newintent = res.body
                        done()
                    })
            })
        })


        /**
         * TEST for GET ALL Intents for the APPID
         */
        describe('/GET/INTENT/ALL GET ALL Intents', () => {
            it('it should not GET Intents for invalid APP', (done) => {
                chai.request(server)
                    .get('/apps/2347297492346dhakh393/intents/all')
                    .set('content-type', 'application/json')
                    .send().end((err, res) => {
                        expect(res).to.have.status(405)
                        done()
                    })
            })
            it('it should GET Intents for valid APP if exists or empty array', (done) => {
                chai.request(server)
                    .get('/apps/' + newapp._id + '/intents/all')
                    .set('content-type', 'application/json')
                    .send().end((err, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body[0]._id).to.be.equal(newintent._id)
                        done()
                    })
            })
        })

        /**
         * TEST for GET Intents BY NAME for the APPID
         */
        describe('/GET/INTENT/BYNAME GET Intents by Name', () => {
            it('it should GET Intents for valid APP if exists or empty array', (done) => {
                chai.request(server)
                    .get('/apps/' + newapp._id + '/intents/name/' + newintent.intent_name)
                    .set('content-type', 'application/json')
                    .send().end((err, res) => {
                        expect(res).to.have.status(200)
                        done()
                    })
            })
        })

        /**
         * TEST for GET Intents BY ID for the APPID
         */
        describe('/GET/INTENT/BYID GET Intents by ID', () => {
            it('it should GET Intents for valid APP if exists or empty array', (done) => {
                chai.request(server)
                    .get('/apps/' + newapp._id + '/intents/' + newintent._id)
                    .set('content-type', 'application/json')
                    .send().end((err, res) => {
                        expect(res).to.have.status(200)
                        done()
                    })
            })
        })

        /**
         * TEST for PUT Intents BY ID for the APPID
         */
        describe('/PUT/INTENT/BYID UPDATE Intents by ID', () => {
            it('it should UPDATE Intents for valid APP if exists', (done) => {
                newintent.description = "UPdated new Intent description"
                chai.request(server)
                    .put('/apps/' + newapp._id + '/intents/' + newintent._id)
                    .set('content-type', 'application/json')
                    .send(newintent).end((err, res) => {
                        expect(res).to.have.status(201)
                        var olddata = newintent
                        var newdata = res.body
                        expect(newdata.description).to.be.equal(olddata.description)
                        expect(newdata.entities.length).to.be.equal(olddata.entities.length)
                        expect(newdata.responses.length).to.be.equal(olddata.responses.length)
                        expect(newdata.actions.length).to.be.equal(olddata.actions.length)
                        expect(newdata.fallback).to.be.equal(olddata.fallback)
                        newintent = res.body
                        done()
                    })
            })
        })

        /**
         *  Begin of INTENT RESPONSES BLOCK
         */

        // Intents Parent Block
        describe('Intents-Response', () => {
            /**
             * Test for POST Apps
             */

            describe('/POST create new Responses for the INTENT ID', () => {

                describe('/POST create new Responses for the INTENT ID', () => {
                    it('it should FAIL for invalid APP ID or INTENT ID', (done) => {
                        var response = {
                            text: "Test responses created by mocha"
                        }
                        chai.request(server)
                            .post('/apps/472942942/intents/djadaldjaldj/responses/create')
                            .set('content-type', 'application/json')
                            .send(response).end((err, res) => {
                                expect(res).to.have.status(500);
                                done()
                            })
                    })

                    it('it should not POST RESPONSES without TEXT propery', (done) => {
                        var response = {
                            texts: "Test responses created by mocha"
                        }
                        chai.request(server)
                            .post('/apps/' + newapp._id + '/intents/' + newintent._id + '/responses/create')
                            .set('content-type', 'application/json')
                            .send(response).end((err, res) => {
                                expect(res).to.have.status(500);
                                done()
                            })
                    })

                    it('it should POST RESPONSES successfully', (done) => {
                        var response = {
                            text: "Test responses created by mocha"
                        }
                        chai.request(server)
                            .post('/apps/' + newapp._id + '/intents/' + newintent._id + '/responses/create')
                            .set('content-type', 'application/json')
                            .send(response).end((err, res) => {
                                expect(res).to.have.status(201)
                                expect(res.body).should.have.a('object')
                                newresponse = res.body.responses[0]
                                done()
                            })
                    })
                })


                /**
                 * TEST for GET ALL RESPONSES for the APPID
                 */
                describe('/GET/RESPONSES/ALL GET ALL RESPONSES', () => {
                    it('it should not GET RESPONSES for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .get('/apps/2347297492346dhakh393/intents/734hajdwedjw/responses/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })
                    it('it should GET ALL respones for valid APP if exists or empty array', (done) => {
                        chai.request(server)
                            .get('/apps/' + newapp._id + '/intents/' + newintent._id + '/responses/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(200)
                                res.body.should.be.an('array')
                                done()
                            })
                    })
                })

                /**
                 * TEST for PUT ALL RESPONSES BY ID
                 */
                describe('/PUT/RESPONSES/ALL UPDATE Response BY ID', () => {
                    it('it should not UPDATE RESPONSES for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .put('/apps/2347297492346dhakh393/intents/734hajdwedjw/responses/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })

                    it('it should not UPDATE RESPONSES without data', (done) => {
                        chai.request(server)
                            .put('/apps/' + newapp._id + '/intents/' + newintent._id + '/responses/' + newresponse._id)
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })

                    it('it should UPDATE RESPONSES', (done) => {
                        var response = {
                            text: "test response updated mocha"
                        }
                        chai.request(server)
                            .put('/apps/' + newapp._id + '/intents/' + newintent._id + '/responses/' + newresponse._id)
                            .set('content-type', 'application/json')
                            .send(response).end((err, res) => {
                                expect(res).to.have.status(201)
                                done()
                            })
                    })
                })


                /**
                 * TEST for DELETE ALL RESPONSES 
                 */
                describe('/DELETE/RESPONSES/ALL DELETE ALL RESPONSE', () => {
                    it('it should not DELETE RESPONSES for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .delete('/apps/2347297492346dhakh393/intents/734hajdwedjw/responses/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })


                    it('it should DELETE ALL RESPONSES', (done) => {
                        chai.request(server)
                            .delete('/apps/' + newapp._id + '/intents/' + newintent._id + '/responses/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(201)
                                done()
                            })
                    })

                    it('it should NOT DELETE RESPONSES.,Since its already Deleted', (done) => {
                        chai.request(server)
                            .delete('/apps/' + newapp._id + '/intents/' + newintent._id + '/responses/' + newresponse._id)
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(405)
                                done()
                            })
                    })


                })
            })
        })

        /**
         * End of INTENT RESPONSES BLOCK 
         */

        /**
         *  Begin of INTENT ENTITIES BLOCK
         */

        // Intents Parent Block
        describe('Intents-Entities', () => {
            /**
             * Test for POST Entities
             */

            describe('/POST create new Entities for the INTENT ID', () => {

                describe('/POST create new Entities for the INTENT ID', () => {
                    it('it should FAIL for invalid APP ID or INTENT ID', (done) => {
                        var entity = {
                            name: "get",
                            description: "test mocha entity created",
                            is_required: false
                        }
                        chai.request(server)
                            .post('/apps/472942942/intents/djadaldjaldj/entities/create')
                            .set('content-type', 'application/json')
                            .send(entity).end((err, res) => {
                                expect(res).to.have.status(500);
                                done()
                            })
                    })

                    it('it should not POST ENTITIES without NAME or DESCRIPTION propery', (done) => {
                        var entity = {
                            description: "Test entities created by mocha"
                        }
                        chai.request(server)
                            .post('/apps/' + newapp._id + '/intents/' + newintent._id + '/entities/create')
                            .set('content-type', 'application/json')
                            .send(entity).end((err, res) => {
                                expect(res).to.have.status(500);
                                done()
                            })
                    })

                    it('it should POST ENTITIES successfully', (done) => {
                        var entity = {
                            name: "get",
                            description: "test mocha entity",
                            is_required: false
                        }
                        chai.request(server)
                            .post('/apps/' + newapp._id + '/intents/' + newintent._id + '/entities/create')
                            .set('content-type', 'application/json')
                            .send(entity).end((err, res) => {
                                expect(res).to.have.status(201)
                                expect(res.body).should.have.a('object')
                                newentity = res.body.entities[0]
                                done()
                            })
                    })
                })


                /**
                 * TEST for GET ALL ENTITIES for the APPID
                 */
                describe('/GET/ENTITIES/ALL GET ALL ENTITIES', () => {
                    it('it should not GET ENTITIES for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .get('/apps/2347297492346dhakh393/intents/734hajdwedjw/entities/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })
                    it('it should GET ALL ENTITIES for valid APP if exists or empty array', (done) => {
                        chai.request(server)
                            .get('/apps/' + newapp._id + '/intents/' + newintent._id + '/entities/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(200)
                                res.body.should.be.an('array')
                                done()
                            })
                    })
                })

                /**
                 * TEST for PUT ALL ENTITIES BY ID
                 */
                describe('/PUT/ENTITIES/ALL UPDATE Entities BY ID', () => {
                    it('it should not UPDATE ENTITIES for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .put('/apps/2347297492346dhakh393/intents/734hajdwedjw/entities/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })

                    it('it should not UPDATE ENTITIES without data', (done) => {
                        chai.request(server)
                            .put('/apps/' + newapp._id + '/intents/' + newintent._id + '/entities/' + newresponse._id)
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })

                    it('it should UPDATE ENTITIES', (done) => {
                        var entity = {
                            name: "get",
                            description: "test mocha updated entity",
                            is_required: false
                        }
                        chai.request(server)
                            .put('/apps/' + newapp._id + '/intents/' + newintent._id + '/entities/' + newresponse._id)
                            .set('content-type', 'application/json')
                            .send(entity).end((err, res) => {
                                expect(res).to.have.status(201)
                                done()
                            })
                    })
                })


                /**
                 * TEST for DELETE ALL ENTITIES 
                 */
                describe('/DELETE/ENTITIES/ALL DELETE ALL ENTITIES', () => {
                    it('it should not DELETE ENTITIES for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .delete('/apps/2347297492346dhakh393/intents/734hajdwedjw/entities/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })


                    it('it should DELETE ALL ENTITIES', (done) => {
                        chai.request(server)
                            .delete('/apps/' + newapp._id + '/intents/' + newintent._id + '/entities/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(201)
                                done()
                            })
                    })

                    it('it should NOT DELETE ENTITIES.,Since its already Deleted', (done) => {
                        chai.request(server)
                            .delete('/apps/' + newapp._id + '/intents/' + newintent._id + '/entities/' + newentity._id)
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(405)
                                done()
                            })
                    })


                })
            })
        })

        /**
         * End of INTENT ENTITIES BLOCK 
         */

        /**
         *  Begin of INTENT ACTIONS BLOCK
         */

        // Intents Parent Block
        describe('Intents-Actions', () => {
            /**
             * Test for POST Actions
             */

            describe('/POST create new Actions for the INTENT ID', () => {

                describe('/POST create new Actions for the INTENT ID', () => {
                    it('it should FAIL for invalid APP ID or INTENT ID', (done) => {
                        var action = {
                            destination: "hcp destination",
                            path: "/dhajdakhd",
                            method: "get"
                        }
                        chai.request(server)
                            .post('/apps/472942942/intents/djadaldjaldj/actions/create')
                            .set('content-type', 'application/json')
                            .send(action).end((err, res) => {
                                expect(res).to.have.status(500);
                                done()
                            })
                    })

                    it('it should not POST ACTIONS without NAME or DESCRIPTION propery', (done) => {
                        var action = {
                            description: "Test entities created by mocha"
                        }
                        chai.request(server)
                            .post('/apps/' + newapp._id + '/intents/' + newintent._id + '/actions/create')
                            .set('content-type', 'application/json')
                            .send(action).end((err, res) => {
                                expect(res).to.have.status(500);
                                done()
                            })
                    })

                    it('it should POST ACTIONS successfully', (done) => {
                        var action = {
                            destination: "hcp destination",
                            path: "/dhajdakhd",
                            method: "get"
                                                      
                        }
                        chai.request(server)
                            .post('/apps/' + newapp._id + '/intents/' + newintent._id + '/actions/create')
                            .set('content-type', 'application/json')
                            .send(action).end((err, res) => {
                                expect(res).to.have.status(201)
                                expect(res.body).should.have.a('object')
                                newaction = res.body.actions[0]
                                done()
                            })
                    })
                })


                /**
                 * TEST for GET ALL Action for the APPID
                 */
                describe('/GET/ACTIONS/ALL GET ALL ENTITIES', () => {
                    it('it should not GET ACTIONS for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .get('/apps/2347297492346dhakh393/intents/734hajdwedjw/actions/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })
                    it('it should GET ALL Actions for valid APP if exists or empty array', (done) => {
                        chai.request(server)
                            .get('/apps/' + newapp._id + '/intents/' + newintent._id + '/actions/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(200)
                                res.body.should.be.an('array')
                                done()
                            })
                    })
                })

                /**
                 * TEST for PUT ALL ACTIONS BY ID
                 */
                describe('/PUT/ACTIONS/ALL UPDATE ACtions BY ID', () => {
                    it('it should not UPDATE ACTIONS for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .put('/apps/2347297492346dhakh393/intents/734hajdwedjw/actions/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })

                    it('it should not UPDATE ACTIONS without data', (done) => {
                        chai.request(server)
                            .put('/apps/' + newapp._id + '/intents/' + newintent._id + '/actions/' + newaction._id)
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })

                    it('it should UPDATE ACTIONS', (done) => {
                         var action = {
                            destination: "hcp destination- updated",
                            path: "/dhajdakhd",
                            method: "get"
                        }
                        chai.request(server)
                            .put('/apps/' + newapp._id + '/intents/' + newintent._id + '/actions/' + newaction._id)
                            .set('content-type', 'application/json')
                            .send(action).end((err, res) => {
                                expect(res).to.have.status(201)
                                done()
                            })
                    })
                })


                /**
                 * TEST for DELETE ALL ACTIONS 
                 */
                describe('/DELETE/ACTIONS/ALL DELETE ALL ACTIONS', () => {
                    it('it should not DELETE ACTIONS for invalid APP ID or INTENT ID', (done) => {
                        chai.request(server)
                            .delete('/apps/2347297492346dhakh393/intents/734hajdwedjw/actions/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(500)
                                done()
                            })
                    })


                    it('it should DELETE ALL ACTIONS', (done) => {
                        chai.request(server)
                            .delete('/apps/' + newapp._id + '/intents/' + newintent._id + '/actions/all')
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(201)
                                done()
                            })
                    })

                    it('it should NOT DELETE ACTIONS.,Since its already Deleted', (done) => {
                        chai.request(server)
                            .delete('/apps/' + newapp._id + '/intents/' + newintent._id + '/actions/' + newentity._id)
                            .set('content-type', 'application/json')
                            .send().end((err, res) => {
                                expect(res).to.have.status(405)
                                done()
                            })
                    })


                })
            })
        })

        /**
         * End of INTENT ACTIONS BLOCK 
         */

        /**
         * TEST for DELETE Intents BY ID for the APP ID
         */
        describe('/DELETE/INTENT/BYID DELETE Intents by ID', () => {

            it('it should not DELETE Intents for invalid APP', (done) => {
                chai.request(server)
                    .delete('/apps/2347297492346dhakh393/intents/' + newintent._id)
                    .set('content-type', 'application/json')
                    .send().end((err, res) => {
                        expect(res).to.have.status(500)
                        done()
                    })
            })

            it('it should DELETE intent the app by ID and Intent ID', (done) => {
                chai.request(server)
                    .delete('/apps/' + newapp._id + '/intents/' + newintent._id)
                    .send().end((err, res) => {
                        expect(res).to.have.status(200)
                        done()
                    })
            })

            it('it should not FIND the INTENT in db which is deleted', (done) => {
                chai.request(server)
                    .get('/apps/' + newapp._id + '/intents/' + newintent._id)
                    .send().end((err, res) => {
                        expect(res).to.have.status(405)
                        done()
                    })
            })
        })
    })


    /**
     * TEST FOR GENERAL API
     */

    // GENERAL Parent Block
    describe('GENERAL', () => {

        /**
         *  Test for OAUTH Token 
         */

        describe('/OAUTH/TOKEN Generate JWT TOKEN', () => {
            it('it should NOT GENERATE TOKEN for No Credentials', (done) => {
                chai.request(server)
                    .post('/oauth/token')
                    .send().end((err, res) => {
                        expect(res).to.have.status(405)
                        done()
                    })
            })

            it('it should GENERATE TOKEN Credentials', (done) => {
                var credentials = {
                    clientid: newapp.credentials.clientid,
                    clientsecret: newapp.credentials.clientsecret
                }
                chai.request(server)
                    .post('/oauth/token')
                    .send(credentials).end((err, res) => {
                        expect(res).to.have.status(201)
                        res.body.should.have.a('object')
                        jwttoken = res.body
                        done()
                    })
            })
        })


        /**
         * Test for Parser
         */

        describe('/PARSE Parse Route', () => {
            it('it should FAIL WITHOUT JWTToken', (done) => {
                chai.request(server)
                    .post('/parse')
                    .set('content-type', 'application/json')
                    .send().end((err, res) => {
                        expect(res).to.have.status(401)
                        done()
                    })
            })

            it('it should FAIL WITHOUT Text Property', (done) => {
                chai.request(server)
                    .post('/parse')
                    .set('content-type', 'application/json')
                    .set('Authorization', jwttoken.token)
                    .send().end((err, res) => {
                        expect(res).to.have.status(405)
                        done()
                    })
            })

            it('it should PASS WITH Text Property', (done) => {
                var oinput = {
                    text: "get my deals"
                }
                chai.request(server)
                    .post('/parse')
                    .set('content-type', 'application/json')
                    .set('Authorization', jwttoken.token)
                    .send(oinput).end((err, res) => {
                        expect(res).to.have.status(500)
                        done()
                    })
            })
        })
    })


    /**
     * TEST FOR LOG API
     */

    // LOG Parent Block
    describe('LOG', () => {

        describe('/POST create new logs for the App ID', () => {

            describe('/POST create new logs for the app ID', () => {
                it('it should FAIL for invalid APP ID ', (done) => {
                    var olog = {
                        input: "test logs",
                        output: "test output",
                        logtype: "c"
                    }
                    chai.request(server)
                        .post('/apps/472942942/logs/create')
                        .set('content-type', 'application/json')
                        .send(olog).end((err, res) => {
                            expect(res).to.have.status(405);
                            done()
                        })
                })

                it('it should POST Logs successfully', (done) => {
                    var olog = {
                        input: "test logs",
                        output: "test output",
                        logtype: "c"
                    }
                    chai.request(server)
                        .post('/apps/' + newapp._id + '/logs/create')
                        .set('content-type', 'application/json')
                        .send(olog).end((err, res) => {
                            expect(res).to.have.status(201)
                            done()
                        })
                })
            })
        })

        describe('/GET get alllogs for the App ID', () => {

            describe('/GET all  logs for the app ID', () => {
                it('it should FAIL for invalid APP ID ', (done) => {
                    chai.request(server)
                        .get('/apps/472942942/logs/all')
                        .set('content-type', 'application/json')
                        .send().end((err, res) => {
                            expect(res).to.have.status(405);
                            done()
                        })
                })

                it('it should GET Logs successfully', (done) => {
                    chai.request(server)
                        .get('/apps/' + newapp._id + '/logs/all')
                        .set('content-type', 'application/json')
                        .send().end((err, res) => {
                            expect(res).to.have.status(200)
                            done()
                        })
                })
            })
        })

        describe('/DELETE delete all logs for the App ID', () => {

            describe('/DELETE all  logs for the app ID', () => {
                it('it should FAIL for invalid APP ID ', (done) => {
                    chai.request(server)
                        .delete('/apps/472942942/logs/all')
                        .set('content-type', 'application/json')
                        .send().end((err, res) => {
                            expect(res).to.have.status(405);
                            done()
                        })
                })

                it('it should delete Logs successfully', (done) => {
                    chai.request(server)
                        .delete('/apps/' + newapp._id + '/logs/all')
                        .set('content-type', 'application/json')
                        .send().end((err, res) => {
                            expect(res).to.have.status(201)
                            done()
                        })
                })
            })
        })

    })

    // /**
    //  * Test for DELETE APP BY ID
    //  */

    describe('/DELETE/APPID Delete app by ID', () => {
        it('it should DELETE the app by ID', (done) => {
            chai.request(server)
                .delete('/apps/' + newapp._id)
                .send().end((err, res) => {
                    expect(res).to.have.status(200)
                    done()
                })
        })

        it('it should not find the app in db which is deleted', (done) => {
            chai.request(server)
                .get('/apps/' + newapp._id)
                .send().end((err, res) => {
                    expect(res).to.have.status(500)
                    done()
                })
        })
    })
})