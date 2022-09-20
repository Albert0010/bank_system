function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const generateCardNumber = () => {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, _ => String(getRandomInt(9)));
};

// EXERCISE starts from here

/*

Card class creates a card, In the Card class you will
need to create a way so that we can get the card number

*/

function generateCVV() {
    let res = "";
    for (let i = 0; i < 3; i++) {
        res = res + Math.floor(Math.random()*10);
    }
    return +res;
}

class Card{
    #cardNumber = generateCardNumber();

    constructor({ name, surname, pinCode}) {
        try {
            if(!name.length){
                throw  "Wrong name,please write correct name";
            }else if(!surname.length){
                throw  "Wrong surname,please write correct surname";
            }else if((pinCode + '').length > 4){
                throw  "Wrong pin,please write correct pin";
            }else {
                this.name = name;
                this.surname = surname;
                this.numbers = this.#cardNumber;
                this.pinCode = pinCode;
                this.CVV = generateCVV();
                this.amount = 0;
            }
        }catch (e) {
            console.log(e);
        }
        /*
         you will also need to do some logical checks so the name is not empty
         or the pin only consists of numbers
         and throw an error if  the condition is not met,
         you will also need to handle the error in the place where we use the Card constructor

          */
    }
}

const card = new Card({
    name: 'John',
    surname: 'Smith',
    pinCode: 8952
});

console.log(card) // has the following signature { name: 'John', surname: 'Smith',pinCode: 12345 }

// getCardNumber obviously need to be implemented
console.log(card.numbers) // '1234-1234-1234-1234';

/*

In Card Service you will need to create an easy and logical way of adding cards

All the methods and properties need to be static

When doing some operations ->

You will need to somehow keep the card records and check if the card is valid or not

*/



class CardService{
    static cardsList = [];

    static addCard({name,surname,pinCode,numbers,CVV}){
        if(!name || !surname || (pinCode + '').length > 4 || numbers.split("-").join("").length > 16 || (CVV +'').length > 3){
            return "something went wrong";
        }else {
            CardService.cardsList.push(card);
        }
    }


    static removeCard(card){
        CardService.cardsList = CardService.cardsList.filter((val)=>{
            return val["CVV"] !== card["CVV"];
        })
    }

    static  async checkCardExistence(numbers){
        for (let i = 0; i < CardService.cardsList.length; i++) {
            if(CardService.cardsList[i]["numbers"] === numbers){
                return true;
            }
        }
        // return true if the card exists
        // this will help you avoid duplicate card codes numbers
    }

    static async addMoney(cardNumber, moneyAmount){
        for (let i = 0; i < CardService.cardsList.length; i++) {
            (CardService.cardsList[i]["numbers"] === cardNumber) && (CardService.cardsList[i]["amount"] +=  moneyAmount);
        }
    }


    static async removeMoney(card, amount){
        card["amount"] = card["amount"] - amount;
    }

    static async transferFromTo(card, toCardNumber, amount){
        CardService.removeMoney(card,amount);
        for (let i = 0; i < CardService.cardsList.length; i++) {
            (CardService.cardsList[i]["numbers"] === toCardNumber) && CardService.addMoney(toCardNumber,amount);
        }

        // the transactions need to be safe

        // calls removeMoney and addMoney methods accordingly

    }

}

CardService.addCard(card);
CardService.addMoney('1852-6333-5351-1606',1000);
console.log(CardService.cardsList);

//  ATM class is simple
// All methods are static

class ATM {

    static totalMoney = 1_000_000;
    static refill(){
        (ATM.totalMoney < 1_000_000) && (ATM.totalMoney = 1_000_000);
    }

    static async getMoney(card, amount,pin){
        if(ATM.totalMoney < amount || card["amount"] < amount || card["pinCode"] !== pin){
            throw new Error("There aren't any money you need");
        }else {
            CardService.removeMoney(card,amount);
        }
        // you will need to call Card service appropriate method in order to get the money
        // if there is not enough money in the ATM you will need to throw error
    }

}

// All methods are static

class Terminal{
    static async transferToCard(cardNumber, amount,pin){
        for (let i = 0; i < CardService.cardsList.length; i++) {
            CardService.cardsList[i]["numbers"] === cardNumber && CardService.cardsList[i]["pinCode"] === pin && (CardService.addMoney(cardNumber,amount));
        }
        // need to also be validated
    }

}