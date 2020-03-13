const fs = require('fs');
const tokenizer = require('./node_modules/node-tokenizer/tokenizer');

class Parser {

    /* 
    Parser class: class that convert input into JSON objects
    Parameters:
        @level: input level
    */
    constructor(level){
        this.level = level;
        this.tokens = [];   // Saves tokenized lines
        this.objects = [];  // Saves final objects
    }

    /*
    Method that converts lines into tokens
     */
    parserTokenizer(){
        let file;
        switch(this.level){
            // Level 1 input
            case '1':
                file = fs.readFileSync('./test_1', 'utf8'); 
                break;
        }
        const lines = file.split(/\r?\n/);
        // tokenize all lines
        tokenizer.debug = true;
        lines.forEach((line) => {
            tokenizer.rule('number', /^\d+(\.\d+)?/);
            tokenizer.rule('word', /[A-Za-z(\s)*]+/);
            this.tokens.push(tokenizer.tokenize(line));
        });
    }
    // METHODS TO CONVERT TOKENS INTO OBJECTS

    /*
    Method that sets parent of every entry
    */
    setParent(){
        const tokensList = [...this.tokens];
        for (const [i,value] of this.tokens.entries()) {
            const childClassifier = value[0];
            const newTokenList = tokensList.slice(0,i).reverse();
            for (const tokens of newTokenList) {
                const parentCandidate = tokens[0];
                if(this.checkIfClassMatch(parentCandidate, childClassifier))
                {
                    value.push(parentCandidate);
                    break;
                }

                }    
        }
    }

    /*
    Method that convert tokens into JSON objects
    */
   convertToObjects(){
    this.tokens.forEach((token) => {
        const object = {
            description: token[1],
            classifier: token[0],
            openingBalance: token[2],
            debit: token[3],
            credit: token[4],
            finalBalance: token[5],
            parent: token[6] ? token[6] : null
        };
        this.objects.push(object);
    })
    }
    
    /*
    Method that returns collection of JSON objectd
    */
    returnCollection(){
        this.parserTokenizer();
        this.setParent();
        this.convertToObjects();
        console.log(this.objects)
    }

    // METHODS FOR CHECKING CLASSIFIER

    /*
    Method that checks if classifiers start with same digits
    */
    checkIfClassMatch(classParent, classChild){
        for (let index = 0; index < classParent.length; index++) {
            if(!this.compareClassifiers(classParent, classChild, index)){
                if(index > 0){
                    return this.checkRestOfClassifier(classParent.substring(index, classParent.length));
                }else{
                    return false;
                }
            }
        }
    }

    /*
    Method that compares classifiers
    */
    compareClassifiers(classifier1, classifier2, index){
        return classifier1[index] == classifier2[index];
    }

    /*
    Method that check rest of classifier after checkIfClassMatch
    */
    checkRestOfClassifier(classifier){
        for (let index = 0; index < classifier.length; index++) {
            if(classifier.charAt(index) !== '0'){
                return false;
            }
        }
        return true;
    }
}
/* Main function */
main = () => {
    const level = process.argv[2];
    if(['1'].includes(level)){
        const parser = new Parser(process.argv[2]);
        parser.returnCollection();
    }

}

main();