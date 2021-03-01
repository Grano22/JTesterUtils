import { JTUPrimitivePreset, JTUValidator } from './jtu_presets.js';

export class JTUPstring extends JTUPrimitivePreset {
    name = "string";
    maxLength = new JTUValidator(function(sam) {
        return sam.length>=this.value;
    }, {
        strictType:"int",
        sampleProps:{ length:"c" },
        failtDescription:"Exceeded the length of string %s to %c letters, expected: %v"
    });
    minLength = new JTUValidator(function(sam) {
        return sam.length<=this.value;
    }, {
        strictType:"int"
    });
    length = new JTUValidator(function(sam) {
        return sam.length==this.value;
    }, {
        strictType:"int"
    });

    rand() {
        let charout = "", numOfSets = 10;
        for(let i = 0;i<numOfSets;i++) {
            charout += String.fromCharCode(Math.floor(Math.random() * 100) + 1);
        }
        return charout;
    }

    testType(sampleval) {return typeof sampleval=="string";}
}

export class JTUPint extends JTUPrimitivePreset {
    name = "int";
    max = new JTUValidator((sam, com)=>sam<=com);
    min = new JTUValidator(sam=>sam>=this.value);
    positive = new JTUValidator(sam=>this.value>0);

    testType(sampleval) {return Number(sampleval) === sampleval && sampleval % sampleval === 0;}
}

export class JTUPfloat extends JTUPrimitivePreset {
    name = "float";
    max = new JTUValidator((sam, com)=>sam<=com);
    min = new JTUValidator((sam, com)=>sam>=com);
    positive = new JTUValidator((sam, com)=>(sam && com>0) || (!sam && com<0));
    roundingTo = new JTUValidator(sam=>(this.value - parseInt(this.value)).toString().length<=sam);
    roundingFrom = new JTUValidator(sam=>(this.value - parseInt(this.value)).toString().length>=sam);
    roundingTo = new JTUValidator(sam=>(this.value - parseInt(this.value)).toString().length==sam);

    testType(sampleval) {return Number(sampleval) === sampleval && sampleval % 1 !== 0;}
}

export class JTUPnumber extends JTUPfloat {
    name = "number";

    testType(sampleval) {return typeof sampleval=="number";}
}

export class JTUPboolean extends JTUPrimitivePreset {
    name = "boolean";
}

