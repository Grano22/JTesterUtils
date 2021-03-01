export function getType(anyVal, numberTypes=true) {
    if(numberTypes) { if(Number(anyVal) === anyVal && anyVal % 1 !== 0) return "float";
    if(Number(anyVal) === anyVal && anyVal % 1 === 0) return "int"; }
    if(Array.isArray(anyVal)) return "array";
    if(typeof anyVal=="object") return anyVal.toString().match(/ (\w+)/)[1];
    return typeof anyVal; // || typeof anyVal=="function"
}

export function checkType(anyVal, targetType, objectProtoMap=null) {
    if(targetType=="mixed") return true;
    if(typeof anyVal=="object" && objectProtoMap!=null) {

    } else return getType(anyVal, (typeof numberTypes=="boolean" ? numberTypes : true));
}

export class JTUValidator {
    typeProto = "mixed";
    defaultValue = null;
    assignedValue = null;
    failDescription = "";
    sampleProps = {};
    
    get value() { return this.assignedValue!=null ? this.assignedValue : this.defaultValue; }

    constructor(testReq, rest={}) {
        rest = Object.assign({
            strictType:null,
            defaultVal:null,
            failDescription:"",
            sampleProps:[]
        }, rest);
        if(rest.strictType!=null) this.typeProto = rest.strictType;
        this.defaultValue = rest.defaultVal;
        this.testSample = testReq.bind(this);
        this.failDescription = rest.failDescription;
        if(Array.isArray(rest.sampleProps)) this.sampleProps = rest.sampleProps;
    }

    get() {return this.value;}

    set(newVal) {
        if(checkType(newVal, this.typeProto, this.typeProto!="number")) this.assignedValue = newVal; else console.error("Invaild type of "+newVal+", it must be a "+this.typeProto);
    }

    logError(sample) {
        for(let smp in this.sampleProps) this.failDescription = this.failDescription.replace("%"+this.sampleProps[smp], sample[smp]); 
        return this.failDescription.replace("%s", sample).replace("%v", this.value);
    }

    testSample(sample, compval=this.value) {return true;}
    test(sample) {return this.testSample(sample, this.value);}
}

export class JTUPrimitivePreset {
    testSpecified(slist, onSuccess=null, onFail=null, exlcude=false) {
        try {
            for(let testValidator in this) if(((!exlcude && slist.includes(testValidator)) || !slist.includes(testValidator)) && this[testValidator] instanceof JTUValidator && this[testValidator].get()!=null) if(!this[testValidator].test()) { if(typeof onFail=="function") onFail(testValidator, this[testValidator]); return false; } 
            if(typeof onSuccess=="function") onSuccess(testValidator, this[testValidator]);
            return true;
        } catch(testException) {
            console.error(testException);
            return false;
        }
    }

    testShort() {
        try {
            if(!this.testType(sample)) return false;
            for(let testValidator in this) if(this[testValidator] instanceof JTUValidator && this[testValidator].get()!=null) if(!this[testValidator].test()) return false; 
            return true;
        } catch(testException) {
            console.error(testException);
            return false;
        }
    }
    
    test(sample, onSuccess=null, onFail=null) {
        try {
            if(!this.testType(sample)) { onFail("Type"); return false; }
            for(let testValidator in this) if(this[testValidator] instanceof JTUValidator && this[testValidator].get()!=null) if(!this[testValidator].test(sample)) { if(typeof onFail=="function") onFail(testValidator, this[testValidator]); return false; }
            if(typeof onSuccess=="function") onSuccess("all");
            return true;
        } catch(testException) {
            console.error(testException);
            return false;
        }
    }

    testAll(sample, onSuccess=null, onFail=null, onLog=null) {
        try {
            let passState = true;
            if(typeof onLog=="function") onLog("is near testing...");
            if(!this.testType(sample)) { onFail("Type"); passState = false }
            for(let testValidator in this) if(this[testValidator] instanceof JTUValidator && this[testValidator].get()!=null) { if(!this[testValidator].test(sample)) { if(typeof onFail=="function") onFail("Validator", testValidator, this[testValidator]); passState = false } }
            if(passState) if(typeof onSuccess=="function") onSuccess("all");
            return passState;
        } catch(testException) {
            console.error(testException);
            return false;
        }
    }
}

export class JTUComplexPreset {
    type = "mixed";

    constructor() {
        
    }
}