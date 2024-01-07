var questiondict;
var questionIndex = 0;
var mistakeCounte = 0;
var numOfQuestion;
var gameStart = false;
var minoption;
var difficultyDict = ["Easy", "Medium", "Hard"];
var timeOutValue = 750;
var congratsMsgTimeOut = 200;
var resetImageTimeOut = setTimeout(resetImage, timeOutValue);

function fillOptions(min, max, difficultyLevels, type="none"){
    minoption = min;
    hideQuestoinPanle(true);
    let combobox_numofques = document.getElementById("numOfQuestion");
    let combobox_difficultyLevel = document.getElementById("difficultySelection");
    for(let i = min; i <= max; i++){
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = i;
        combobox_numofques.appendChild(opt);
    }

    for(let i=0; i < difficultyLevels.length; i++){
        let opt = document.createElement("option");
        opt.value = difficultyLevels[i];
        opt.innerHTML = difficultyDict[i];
        combobox_difficultyLevel.appendChild(opt);
    }

    let input = document.getElementById("answerinput");
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            // document.getElementById("ckeckAnswerBtn").click();
            checkAnswer();
        }
    });

    if(type == "add" || type == "sub"){
        input.addEventListener("keyup", function(event) {
            let question = document.getElementById("questionLabel").innerHTML;
            if(input.value.length == questiondict[question].length){
                checkAnswer();
                console.log("in EventListener");
            }
        });

        input.addEventListener("keypress", function(event){
            input.setSelectionRange(0, 0);
        });
    }else{
        input.addEventListener("keyup", function(event) {
            let question = document.getElementById("questionLabel").innerHTML;
            if(input.value.length == questiondict[question].length){
                checkAnswer();
                console.log("in EventListener");
            }
        });

    }
}

function startGame(questionCreatation){
    if (gameStart){
        return;
    }
    gameStart = true;
    questionIndex = 0;
    mistakeCounte = 0;
    document.getElementById("answerinput").disabled = false;
    document.getElementById("resultimg").src = ""
    numOfQuestion = document.getElementById("numOfQuestion").value;
    // console.log(numOfQuestion);
    questiondict = questionCreatation(numOfQuestion, 4);
    // console.log(questiondict)
    hideQuestoinPanle(false);
    setFocusToAnswerInput();
    showNextQuestion();    

}

function getDifficulty(){
    return document.getElementById("difficultySelection").value;;
}

function showNextQuestion(){
    let questionLabel = document.getElementById("questionLabel");
    let questionDone = document.getElementById("questionsDone");
    let list = [];
    for(q in questiondict){
        list.push(q);
    }
    if(questionIndex < list.length){
            questionLabel.innerHTML = list[questionIndex];
            questionIndex++;
            questionDone.innerHTML = `Current Question: ${questionIndex}/ ${numOfQuestion}`;
    }else{
        gameStart = false;
        document.getElementById("answerinput").disabled = true;
        setTimeout(function(){
            hideQuestoinPanle(true);
            alert(`Congratulations \ngood job\nQuestion Count: ${numOfQuestion}\nMistake Count: ${mistakeCounte}`);
            gameStart = false;
            document.getElementById("numOfQuestion").value = minoption;
        }, congratsMsgTimeOut);
        
    }

}

function makeMultiQuestion(num, multipler){
    let counter = 0;
    let max = getDifficulty() * multipler
    let qdict = {}
    while(counter < num){
        let a = randint(max-multipler+1, max+1);
        let b = randint(3, 12+1);
        let c = a * b;
        let questionStr = `${a} x ${b}`; 
        if(!(questionStr in qdict)){
            qdict[questionStr] = `${c}`;
            counter++;
        }
    }
    return qdict;
}

function makeAddQuestion(num, multipler){
    let counter = 0;
    let max = getDifficulty() * multipler
    let qdict = {}
    while(counter < num){
        let a = randint(max/2, max+1);
        let b = randint(max/2, max+1);
        let c = a + b;
        let questionStr = `${a} + ${b}`;
        if(!(questionStr in qdict)){
            qdict[questionStr] = `${c}`;
            counter++;
        }
    }
    return qdict;
}

function makeSubQuestion(num, multipler){
    let counter = 0;
    let max = getDifficulty() * multipler
    let qdict = {}
    while(counter < num){
        let a = randint(max/2, max+1);
        let b = randint(max/2, max+1);
        if (a < b){
            let temp = a;
            a = b;
            b = temp;
        }
        let c = a - b;
        let questionStr = `${a} - ${b}`;
        if(!(questionStr in qdict)){
            qdict[questionStr] = `${c}`;
            counter++;
        }
    }
    return qdict;
}

function makeDividQuestion(num, multipler){
    let counter = 0;
    let max = getDifficulty() * multipler
    let qdict = {}
    let primes = get_prime(max);
    while(counter < num){
        let a = randint(max-multipler+1, max+1);
        let b = randint(3, 13);
        let c = a * b;
        let questionStr = `${c} / ${b}`;
        if(!(questionStr in qdict)){
            qdict[questionStr] = `${a}`;
            counter++;
        }
    }
    return qdict;
}

function get_prime(n){
    let primes = [];
    if (n > 2){
        primes.push(2);
    }
    for(let i=3; i <= n; i += 2){
        if (get_divisors(i).length == 0){
            primes.push(i);
        }
    }
    // console.log(primes);
    return primes;
}

function get_divisors(num){
    let divisors = [];
    for (let i = 2; i < num; i++){
        if (num % i == 0){
            divisors.push(i);
        }
    }
    return divisors;
}

function randint(a, b){
    return Math.floor(Math.random() * (b-a)) + a;
}

function checkAnswer(){
    if(!gameStart){
        return;
    }
    console.log("in check answer");
    let answerinput = document.getElementById("answerinput");
    let resultImage = document.getElementById("resultimg");
    let question = document.getElementById("questionLabel").innerHTML;
    // console.log(question);
    if(questiondict[question] == answerinput.value.trim()){
        playSound(true);
        resultImage.src = "rightMark.png";
        clearTimeout(resetImageTimeOut);
        showNextQuestion();
    }else{
        playSound(false);
        resultImage.src = "wrongMark.png";
        clearTimeout(resetImageTimeOut);
        mistakeCounte++;
    }
    resetImageTimeOut = setTimeout(resetImage, timeOutValue);
    answerinput.value = "";
    setFocusToAnswerInput();
}

function playSound(type){
    if(type){
        document.getElementById("correctaudio").play();
    }else{
        document.getElementById("incorrectaudio").play();
    }
}

function resetImage(){
    document.getElementById("resultimg").src = "";
}

function hideQuestoinPanle(value){
    if(value){
        document.getElementById("questionPanle").style.display = "none";
    }else{
        document.getElementById("questionPanle").style.display = "block";
    }
}

function setFocusToAnswerInput(){
    document.getElementById("answerinput").focus();
    document.getElementById("answerinput").select();
}