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

    returnCollection(){
        this.parserTokenizer();
    }
}

main = () => {
    const parser = new Parser('1');
    parser.returnCollection();
}

main();