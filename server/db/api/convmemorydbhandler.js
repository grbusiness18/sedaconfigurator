'use strict'

const model = require('../../db/models/model.js')
const DBHandler = require('./db.js')
const syncEach = require('sync-each')
const CONVMEMDB = model.conversememdb


class ConvMemDBHandler extends DBHandler {

    /**
     * [constructor Pass the DB Model to parent constructor.]
     */
    constructor() {
        super(CONVMEMDB)
    }

    createNewConvMem(oConvMem = {}) {
        var self = this
        return new Promise((resolve, reject) => {
            self.create(oConvMem).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    getConvMemById(sconvid = "") {
        var self = this
        var query = {
            conversation_id: sconvid
        }
        return new Promise((resolve, reject) => {
            self.getData(query).then((oConvMemData) => {
                resolve(oConvMemData)
            }).catch((err) => {
                reject(new Error("Invalid Conversation :" + sconvid))
            })
        })
    }

    getConvForAppId(sappid = "") {
        var self = this
        var query = {
            app_id: sconvid
        }
        return new Promise((resolve, reject) => {
            self.getAllData(query).then((oConvMemData) => {
                resolve(oConvMemData)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    getStepFromConversation(sconvid = "", sstepname = "", bnext = false) {
        var self = this
        return new Promise((resolve, reject) => {
            self.getConvMemById(sconvid).then((oconvdata) => {

                if (oconvdata.conv_end == false) {
                    if (oconvdata.conv_steps.length > 0) {
                        if (bnext) {

                            var aFilterNext = oconvdata.conv_steps.filter((ele) => {
                                return ele.step_name != sstepname
                            })

                            var oNewValues = {
                                conv_steps: aFilterNext
                            }

                            if (aFilterNext.length == 1) {
                                oNewValues["conv_end"] = true
                            }

                            self.updateConvMem(sconvid, oNewValues).then((oUpdateData) => {

                                if (aFilterNext.length > 1) {
                                    resolve([aFilterNext[0]])
                                } else if (aFilterNext.length > 0 && aFilterNext.length < 2) {
                                    resolve(aFilterNext)
                                } else {
                                    resolve([])
                                }

                            }).catch((err) => {
                                reject(err)
                            })

                        } else {

                            var aFilterCurr = oconvdata.conv_steps.filter((ele) => {
                                return ele.step_name != sstepname
                            })

                            if (aFilterCurr.length > 0) {
                                resolve(aFilterCurr)
                            } else {
                                reject(new Error("couldnt find step " + sstepname + "in conv"))
                            }
                        }

                    } else {
                        reject(new Error("Conv Steps are empty"))
                    }

                } else {
                    reject(new Error("conversation ended already.."))
                }

            }).catch((err) => {
                reject(err)
            })
        })
    }

    updateConvMem(sconvid = "", oNewValues) {
        var self = this
        var query = {
            conversation_id: sconvid
        }       

        return new Promise((resolve, reject) => {
            self.getConvMemById(sconvid).then((oDBData) => {
                var oUpdateData = new prepareUpdateData(oDBData, oNewValues).oData                
                self.updateData(query, oUpdateData).then((data) => {
                    resolve(data)
                }).catch((err) => {
                    console.log("Update Error", data)
                    reject(err)
                })

            }).catch((err) => {
                reject(err)
            })
        })
    }


    deleteConvMemById(sconvid = "") {
        var self = this
        var query = {
            conversation_id: sconvid
        }
        return new Promise((resolve, reject) => {
            self.deleteByQuery(query).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    deleteConvStepByStepName(sconvid = "", sstepname = "") {
        var self = this
        return new Promise((resolve, reject) => {
            self.getConvMemById(sconvid).then((oconvdata) => {
                if (oconvdata.length > 0) {
                    var afilter = oconvdata.conv_steps.filter((ele) => {
                        return ele.step_name != sstepname
                    })
                    var oNewValues = {
                        conv_steps: afilter
                    }
                    self.updateData(sconvid, oNewValues).then((data) => {
                        resolve(data)
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    resolve()
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }
}



function prepareUpdateData(oUpdateData, oNewValues) {
    this.oData = oUpdateData
    this.oData.changed_on = Date.now()
    if ("conv_steps" in oNewValues && oNewValues.conv_steps.length > 0) {       
        this.oData["conv_steps"] = new conv_steps_mapper(oNewValues.conv_steps, oUpdateData.conv_steps).aResult        
    }

    if ("current_step" in oNewValues)  {
        this.oData["current_step"] = oNewValues.current_step
    }

    if ("conv_end" in oNewValues) {
        this.oData["conv_end"] = oNewValues.conv_end
    }


    if ("conv_error" in oNewValues) {
        this.oData["conv_error"] = oNewValues.conv_error
    }    
}

function conv_steps_mapper(aSource, aTarget) {
    this.aResult = []
    syncEach(aSource, (oSrc, next) => {
        var aFilter = aTarget.filter((ele) => {
            return ele.step_name == oSrc.step_name
        })

        if (aFilter.length > 0) {
            aFilter[0]["step_name"] = oSrc.step_name
            aFilter[0]["step_type"] = oSrc.step_type
            aFilter[0]["ok_param"] = oSrc.ok_param
            aFilter[0]["belongstoentity"] = oSrc.belongstoentity
            aFilter[0]["execonnullentity"] = oSrc.execonnullentity
            aFilter[0]["actions"] = oSrc.actions
            aFilter[0]["dropdowns"] = oSrc.dropdowns
            aFilter[0]["texts"] = oSrc.texts
            aFilter[0]["step_complete"] = oSrc.step_complete
            this.aResult.push(...aFilter)
        } else {
            this.aResult.push(oSrc)
        }
        next()
    }, () => {        
    })
}

module.exports = ConvMemDBHandler