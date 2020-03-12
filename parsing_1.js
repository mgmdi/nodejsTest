const fs = require('fs');
const tokenizer = require('./node_modules/node-tokenizer/tokenizer');

class Parser {

    constructor(level){
        this.level = level;
        this.tokens = [];
    }

    parserTokenizer(){
        let file;
        switch(this.level){
            case '1':
                file = fs.readFileSync('./test_1', 'utf8'); 
                break;
        }
        const lines = file.split(/\r?\n/);
        // tokenize all lines
        tokenizer.debug = true;
        lines.forEach((line) => {
            console.log('LINES')
            console.log(line)
            tokenizer.rule('number', /^\d+(\.\d+)?/);
            tokenizer.rule('word', /[A-Za-z(\s)*]+/);
            this.tokens.push(tokenizer.tokenize(line));
            console.log('Parsed ' + this.tokens.length + ' tokens');
            console.log('TOKENS');
            console.log(this.tokens);
        });
    }

    setParent(){
        const tokensList = [...this.tokens];
        for (const [i,value] of this.tokens.entries()) {
            const classifier = value[0];
            if(i > 0){
                const newTokenList = tokensList.slice(0,i);
                for (const tokens of newTokenList) {
                    const id = tokens[0];

                }
            }
            else {
                value.push(null);
            }
            
        }
    }

    returnCollection(){
        this.parserTokenizer();
        //this.setParent();
    }

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

    compareClassifiers(classifier1, classifier2, index){
        return classifier1[index] == classifier2[index];
    }

    checkRestOfClassifier(classifier){
        let restIsZero = true;
        classifier.some((c) => {
            if(c !== '0'){
                restIsZero = false;
                break;
            }
        })
        return restIsZero;
    }
}

main = () => {
    const parser = new Parser('1');
    parser.returnCollection();
}

main();