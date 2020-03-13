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
            case '2':
                file = fs.readFileSync('./test_2', 'utf8'); 
                break;
        }
        const lines = file.split(/\r?\n/);
        // tokenize all lines
        tokenizer.debug = true;
        lines.forEach((line) => {
            if(/\S/.test(line)){
                tokenizer.rule('number', /^[\d\.,\-]+D?/);
                tokenizer.rule('word', /^[A-Za-z\u00C0-\u00ff\s\.\-]+:?/);
                const tokList = tokenizer.tokenize(line);
                this.tokens.push(this.convertTokensToTypes(tokList));
                console.log('TOKENS')
                console.log(this.tokens)
            }
        });
    }

    convertTokensToTypes(tokList){
        const descriptionHasNumber = tokList.length > 6;
        const classifier = tokList[0].replace(/\./g,'');
        const description = descriptionHasNumber ? tokList[1] + ' ' + tokList[2] : tokList[1];
        const openingBalance = descriptionHasNumber ? tokList[3].replace(/\./g,'').replace(',','.') : tokList[2].replace(/\./g,'').replace(',','.');
        const debit = descriptionHasNumber ? tokList[4].replace(/\./g,'').replace(',','.') : tokList[3].replace(/\./g,'').replace(',','.');
        const credit = descriptionHasNumber ? tokList[5].replace(/\./g,'').replace(',','.') : tokList[4].replace(/\./g,'').replace(',','.');
        const finalBalance = descriptionHasNumber ? tokList[6].replace(/\./g,'').replace(',','.') : tokList[5].replace(/\./g,'').replace(',','.'); 
        const list = [classifier, description, parseFloat(openingBalance), parseFloat(debit), parseFloat(credit), parseFloat(finalBalance)];
        return list;
    }
    // METHODS TO CONVERT TOKENS INTO OBJECTS

    /*
    Method that sets parent of every entry
    */
    setParent(){
        const tokensList = [...this.tokens];
        for (const [i,value] of this.tokens.entries()) {
            const childClassifier = value[0];
            console.log('CHILD CLASSIFIER -----------------')
            console.log(childClassifier)
            console.log('TOKEN LIST')
            const newTokenList = tokensList.slice(0,i).reverse();
            console.log('TOKEN LIST')
            console.log(newTokenList)
            for (const tokens of newTokenList) {
                const parentCandidate = tokens[0];
                console.log('CONSIDERING TOKEN!!!!!!!!!!!!!!!!!!!')
                console.log(tokens)
                if(this.checkIfClassMatch(parentCandidate, childClassifier))
                {
                    value.push(parentCandidate);
                    console.log('PARENT')
                    console.log(parentCandidate)
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
        return this.objects
    }

    // METHODS FOR CHECKING CLASSIFIER

    /*
    Method that checks if classifiers start with same digits
    */
    checkIfClassMatch(classParent, classChild){
        for (let index = 0; index < classChild.length; index++) {
            if(!this.compareClassifiers(classParent, classChild, index)){
                const parentClassLessTChild = this.level === '2' ? classParent.length < classChild.length : true;
                if(index > 0 && parentClassLessTChild){
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
        console.log('CLASSIFIER')
        console.log(classifier)
        for (let index = 0; classifier && index < classifier.length; index++) {
            if(classifier.charAt(index) !== '0'){
                return false;
            }
        }
        return true;
    }

    getConvertedObjects(){
        return this.objects;
    }
}
/* Main function */
main = () => {
    const level = process.argv[2];
    if(['1', '2'].includes(level)){
        const parser = new Parser(process.argv[2]);
        parser.returnCollection();
    }

}

main();

module.exports = Parser;