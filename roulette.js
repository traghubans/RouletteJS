/****
 * Travis Raghubans
 * Problem: Create a program that simulates a roulette wheel. You have 60 minutes.
 * Time Started: 12:00pm October 2nd, 2019
 * Time Ended:   1:44pm October 2nd, 2019
 */


//Packages , Dependencies , or Global Variables
const {stdin, stdout} = process;

//Main function to async get user input and do calculations
async function main()
{
    //declared variables
    var bankroll = 100, bet = 0;
    var keepPlaying = 'y';
    var result = {};

        //ask questions on how much money they have and what bet they can play
        //Get the object of game results

        bankroll = await prompt(`How much money do you have in your bankroll today? `)

        while(keepPlaying = 'y' && bankroll > 0)
        {
            moneyDown = await prompt('How much money are you playing with today? ');
            bet = await prompt(`To determine what to place your bets on, enter one of the following commands: \n Enter 'odd' or 'even' to bet on the number \n Enter 'red' or 'black' to bet on the color of the number landed on. \n Enter a single number to bet on that number specifically \n Enter 'first', 'second', or 'third' to bet on the 1st, 2nd, or 3rd set of twelve numbers \n Enter 'low' or 'high' to bet on either half of the numbers: ` );
            
            //run the roulette wheel
            result = runRoulette();

            //Check statements to see if logically the bet money makes sense
            if(bankroll === '0')
                bankroll = await prompt(`Sorry, you can't play with that amount. Please enter a value that is more than 1`);
            
            while(moneyDown > bankroll)
            {
                moneyDown = await prompt(`Your bet cannot be more than your bankroll. Please enter an amount less than your total bankroll: `);
            }


            //stop the input
            stdin.pause();
            
       

        //Made another promise to deal with the async function, display if user has won or lost
        var winnings = await checkWinnings(result, bet, moneyDown);
        
        //set the variables to integers so we can use the mathematically
        if(Math.sign(winnings) == -1)
        {
            bankroll = parseInt(bankroll,10);
            console.log(`Aw shucks, you lost ${winnings*(-1)} dollars. Better luck next time!`);
            bankroll += (winnings*1);
        }
        else
        {
            bankroll = parseInt(bankroll,10);
            console.log(`Congrats! You have won ${winnings} dollars`);
            bankroll += (winnings*1);
        }
        
        
        //ask user if they would like to see the results
        var button = await prompt(`To see results of the play, press 'o': `)
        
        if(button.toString().toLowerCase().trim() == 'o')
        {
        //display the winning parameters
        console.log(`Winning parameters: `);
        console.log(`Number: ${result.num}`);
        console.log(`Status: ${result.status}`);
        console.log(`Color: ${result.color}`);
        console.log(`Updated Balance: ${bankroll}`);
        }

        //Ask if user wants to keep playing
        keepPlaying = await prompt(`If you would like to keep playing, please select 'y': `);
        if(keepPlaying.toString().toLowerCase().trim() != 'y')
            break;
    }

    //Tell user if they've lost because of money or they quit on their own
    if(bankroll == 0)
        console.log(`You've run out of credits! Come back when you've got more!`);
    else
        console.log(`Thanks for playing! You've walked out with ${bankroll} dollars`);

    process.exit();
        
}

main();

//--------------------- Helper functions ---------------------------------------------------

//This function will obtain the user input
function prompt(questString)
{
    //Declared Promise to deal with standard input
    return new Promise((resolve, reject) =>
    {
        //start standard input and write question
        stdin.resume();
        stdout.write(questString);

        //get the response
        stdin.on('data', response => resolve(response.toString()));
        stdin.on('error', err => reject(err));
    });
}

//This function will return the winnings or losses based on the bet the player makes
function checkWinnings(result, bet, moneyDown)
{
    return new Promise((resolve, reject) =>
    {
        var switchVar = bet.toString().toLowerCase().trim();
        switch(switchVar)
        {
            case "odd": 
            case "even":
                if(switchVar == result.status)
                    resolve(calcPrice(2,moneyDown));
                else
                    resolve(-Math.abs(calcPrice(1,moneyDown)));
            case "red":
            case "black":
                if(switchVar == result.color)
                    resolve(calcPrice(2,moneyDown));
                else
                    resolve(-Math.abs(calcPrice(1,moneyDown)));
            case "low":
            case "high":
                if(inBetween(result.num, switchVar))
                    resolve(calcPrice(2,moneyDown));
                else
                    resolve(-Math.abs(calcPrice(1,moneyDown)));
            case "first":
            case "second":
            case "third":
                if(inBetween(result.num, switchVar))
                    resolve(calcPrice(3,moneyDown))
                else
                    resolve(calcPrice(1, moneyDown));
            default:
                if(result.num == switchVar)
                    resolve(calcPrice(35,moneyDown));
                else
                    resolve(-Math.abs(calcPrice(1, moneyDown)));
        }

        
        // if(bet.toString().toLowerCase().trim() == 'odd')
        //     resolve(calcPrice(1,moneyDown));
        // else
        //     resolve(-Math.abs(calcPrice(1,moneyDown)));
    
    })


}
 

//check if number is in between the range
function inBetween(num, checkRange)
{
    if(checkRange == 'first')
    {
        if(num >= 1 && num <= 12)
            return true;
        else
            return false;
    }
    else if(checkRange == 'second')
    {
        if(num >= 13 && num <= 24)
            return true;
        else
            return false;
    }
    else if(checkRange === 'third')
    {
        if(num >= 25 && num <= 36)
            return true;
        else
            return false;
    }
    else if(checkRange === 'low')
    {
        if(num >= 1 && num <= 18)
            return true;
        else
            return false;
    }
    else if(checkRange === 'high')
    {
        if(num >= 19 && num <= 36)
            return true;
        else
            return false;
    }
}

//Calculate winnings or losses
function calcPrice(multiplier,bet)
{
    //console.log(`Bet Winnings or Losses: $${multiplier * bet} dollars!`);
    return multiplier*bet;
}

//Quick function to determine if the number is odd or even
function isOddorEven(num)
{
    var newNum = num % 2;
    if(newNum === 1)
        return 'odd';
    else
        return 'even';
}



//This will run the roulette, and return an object with the color & number
function runRoulette()
{
    //Declared Variables
    var negNum = -1;
    var max = 37;
    var final;
    var numStatus;
    var color;
    var resultObj = {};

    //get a random number 
    final = Math.floor(Math.random() * max) + negNum;
    //console.log(final);

    //get the status of the number
    numStatus = isOddorEven(final);
    numStatus = numStatus.toString().toLowerCase().trim();
    
    //return final object with colors
    if(final === 0 || final === -1)
    {
        //convert number to 00 and return object
        if(final === -1)
        {
            resultObj = 
            {
                'num'    : 00,
                'color'  : 'green',
                'status' : 'none'
            }

            return resultObj;
        }
        resultObj = 
        {
            'num'    : 0,
            'color'  : 'green',
            'status' : 'none'
        }

        return resultObj;

    }
    else if(numStatus == 'odd')
    {
        resultObj = 
        {
            'num'    : final,
            'color'  : 'black',
            'status' : numStatus
        }

        return resultObj;
    }
    else if(numStatus == 'even')
    {
        resultObj = 
        {
            'num'    : final,
            'color'  : 'red',
            'status' : numStatus
        }

        return resultObj;

    }
}
