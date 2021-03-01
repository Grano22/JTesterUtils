import * as primitivePresets from './presets/index.js';
import fs from 'fs';
//const fs = require('fs');
//const { Module } = require('module');

/**
 * Testing Protos
 */
/*
{
    sampleType?:mixed|es6Class|class|function|functionClass //Default is mixed
    argumentsTypes?:[],
    entry?:{}|entries?:[]
}
*/

/**
 * Jumper Tester Utils
 */
const JTesterUtils = new class {
    primitivePresets = {};
    complexPresets = {};
    /* Reistration */
    registerPrimitivePresets(initialPresets) {
        for(let ppname in initialPresets) {
            this.primitivePresets[ppname.replace("JTUP", "")] = initialPresets[ppname];
        }
        //this.primitivePresets = initialPresets;
    }
    registerComplexPresets(initialPresets, customPrefixes=[]) {
        this.complexPresets = initialPresets;
    }

    /* Presets tools */
    getPresetByName(presetName) {
        for(let ppname in this.primitivePresets) if(ppname==presetName) return this.primitivePresets[ppname];
        for(let cpname in this.complexPresets) if(cpname==presetName) return this.complexPresets[cpname];
    }

    /* String tools */
    basename(fullPath) {
        let outputName = "";
        for(let ch = fullPath.length - 1;ch>=0;ch--) {
            if(fullPath[ch]=="/") return outputName;
            outputName = outputName + fullPath[ch];
        }
        return outputName;
    }

    filename(fullPath) {
        let dotOmitted = false, outputName = "";
        for(let ch = fullPath.length - 1;ch>=0;ch--) {
            if(fullPath[ch]=="/") return outputName;
            if(dotOmitted) outputName = outputName + fullPath[ch]; else if(fullPath[ch]==".") dotOmitted = true;
        }
        return outputName;
    }

    /* Testing Tools */
    expectMultiple(testingProto) {

    }

    expect(testingProto, sample, argsArr) {
        if(typeof testingProto.argumentsList!="undefined") {
            try {
                for(let argNum in testingProto.argumentsList) {
                    let currArg = testingProto.argumentsList[argNum];
                    let presetType = null, presetTg = null, presetInstance = null;
                    if(typeof currArg=="string") presetType = currArg;
                    else if(Array.isArray(currArg)) {
                        if(typeof currArg[0]=="string") presetType = currArg[0]; else throw "Unknown testing proto, preset name required";
                    } else throw "Unknown testing proto, preset name required";
                    presetTg = this.getPresetByName(presetType);
                    if(presetTg==null) throw "Preset "+presetType+" not exist in registered entries";
                    presetInstance = new presetTg();
                    //console.log(presetInstance);
                    if(Array.isArray(currArg) && typeof currArg[1]=="object") {
                        for(let parName in currArg[1]) {
                            presetInstance[parName].set(currArg[1][parName]);
                        }
                    }
                    presetInstance.testAll(argsArr[argNum], (tType)=>console.log(`${tType}: passed`), (tType)=>console.error(`${tType}: not passed`), (mess)=>console.log(`Function ${sample.name}/Argument#${argNum}: ${mess}`));
                }
            } catch (outputTesting) {
                console.error(outputTesting);
            }
        }
        let funcRet = sample.apply(this, argsArr);
        if(typeof testingProto.output!="undefined") {
            try {
                let presetType = null, presetTg = null, presetInstance = null;
                if(typeof testingProto.output=="string") presetType = testingProto.output;
                else if(Array.isArray(testingProto.output)) {
                    if(typeof testingProto.output[0]=="string") presetType = testingProto.output[0]; else throw "Unknown testing proto, preset name required";
                } else throw "Unknown testing proto, preset name required";
                presetTg = this.getPresetByName(presetType);
                if(presetTg==null) throw "Preset "+presetType+" not exist in registered entries";
                presetInstance = new presetTg();
                if(Array.isArray(testingProto.output) && typeof testingProto.output[1]=="object") {
                    for(let parName in testingProto.output[1]) {
                        presetInstance[parName].set(testingProto.output[1][parName]);
                    }
                }
                presetInstance.testAll(funcRet, (tType)=>console.log(`${tType}: passed`), (tType)=>console.error(`${tType}: not passed`), (mess)=>console.log(`Function ${sample.name}/Output: ${mess}`));
            } catch (outputTesting) {
                console.error(outputTesting);
            }
        }
    }

    testLog() {

    }

    pollyfils() {

    }

    test() {

    }

    testEntry() {

    }

    randomizedTest() {

    }

    minifyFile(scriptSrc, options={}) {
        options = Object.assign({
            stripMultiLineComments:true,
            stripInlineComments:true,
            reduceWhitespaces:true
        }, options);
        let self = this;
        fs.readFile(scriptSrc, {encoding: 'utf-8'}, function(err,data){
            if (!err) {
                //console.log('received data: ' + data);
                let prepData = "", betweenStr = "";
                /*for(let ch=0;ch<data.length;ch++) {
                    if(!betweenStr && data[ch]=="'" || data[ch]=='"' || data[ch]=="`") betweenStr = data[ch];
                    else if(betweenStr && betweenStr===data[ch]) betweenStr = "";
                    else if(!betweenStr && (data[ch].trim()=="" && data[ch + 1].trim()=="")) {}
                    else if(!betweenStr && data[ch]!="\t" && data[ch]!="\n") prepData += data[ch];
                }*/
                prepData = data;
                prepData = prepData.replace(/\/\*(.*)?\*\//g, "").replace(/\/\/(.*)$/g, "").replace(/\n/g, "___N___").replace(/\s+/g, " ").replace(/___N___/g, "\n").replace(/^\s*\n/gm, ""); //.replace(/\s+/g, " ").replace(/\t/g, "").replace(/\n/g, "")
                let fileparts = self.basename(scriptSrc).split(".");
                console.log(fileparts);
                fs.writeFile(`./minified/${fileparts[0]}.min.${fileparts[fileparts.length - 1]}`, prepData, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });

                //response.writeHead(200, {'Content-Type': 'text/html'});
                //response.write(data);
                //response.end();
            } else {
                console.log(err);
            }
        }); 
    }
}

class JMTesterEntry {
    output = undefined;
    argumentsList = undefined;

    constructor(testingProto) {
        this.output = testingProto.output;
        this.argumentsList = testingProto.argumentsList;
    }

    expect(sample, argsArr) {
        if(typeof this.argumentsList!="undefined") {
            try {
                for(let argNum in this.argumentsList) {
                    let currArg = this.argumentsList[argNum];
                    let presetType = null, presetTg = null, presetInstance = null;
                    if(typeof currArg=="string") presetType = currArg;
                    else if(Array.isArray(currArg)) {
                        if(typeof currArg[0]=="string") presetType = currArg[0]; else throw "Unknown testing proto, preset name required";
                    } else throw "Unknown testing proto, preset name required";
                    presetTg = JTesterUtils.getPresetByName(presetType);
                    if(presetTg==null) throw "Preset "+presetType+" not exist in registered entries";
                    presetInstance = new presetTg();
                    if(Array.isArray(currArg) && typeof currArg[1]=="object") {
                        for(let parName in currArg[1]) {
                            presetInstance[parName].set(currArg[1][parName]);
                        }
                    }
                    presetInstance.testAll(argsArr[argNum], (tType)=>console.log(`${tType}: passed`), (tType)=>console.error(`${tType}: not passed`), (mess)=>console.log(`Function ${sample.name}/Argument#${argNum}: ${mess}`));
                }
            } catch (outputTesting) {
                console.error(outputTesting);
            }
        }
        let funcRet = sample.apply(this, argsArr);
        if(typeof this.output!="undefined") {
            try {
                let presetType = null, presetTg = null, presetInstance = null;
                if(typeof this.output=="string") presetType = this.output;
                else if(Array.isArray(this.output)) {
                    if(typeof this.output[0]=="string") presetType = this.output[0]; else throw "Unknown testing proto, preset name required";
                } else throw "Unknown testing proto, preset name required";
                presetTg = JTesterUtils.getPresetByName(presetType);
                if(presetTg==null) throw "Preset "+presetType+" not exist in registered entries";
                presetInstance = new presetTg();
                if(Array.isArray(this.output) && typeof this.output[1]=="object") {
                    for(let parName in this.output[1]) {
                        presetInstance[parName].set(this.output[1][parName]);
                    }
                }
                presetInstance.testAll(funcRet, (tType)=>console.log(`${tType}: passed`), (tType)=>console.error(`${tType}: not passed`), (mess)=>console.log(`Function ${sample.name}/Output: ${mess}`));
            } catch (outputTesting) {
                console.error(outputTesting);
            }
        }
    }

    expectMultiple() {

    }
}

JTesterUtils.registerPrimitivePresets(primitivePresets);

//JTesterUtils.minifyFile("./scripts/uploadControl.jsx");

console.log(JTesterUtils.primitivePresets);

function addNumber(one, two) {
    return one + two;
}

const addNumberTester = new JMTesterEntry({
    output:[ "number", {
        max:100,
        min:10
    } ],
    argumentsList:[ "number", "number" ]
});



//console.log(primitivePresets);
/*console.log(JTesterUtils.expect({
    output:[ "number", {
        max:100,
        min:10
    } ],
    argumentsList:[ "number", "number" ]
}, addNumber, [12, 45]));*/

addNumberTester.expect(addNumber, [8, 8]);

/*Module.exports = {
    JTesterUtils:JTesterUtils,
    JMTesterEntry:JMTesterEntry
}*/