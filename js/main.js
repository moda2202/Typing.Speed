// Defining the wanted variables
let startButton = document.querySelector(".play-stop");
let textField = document.querySelector("#text-field")
let textInformation = document.querySelector("h2");
let Writer = document.querySelector("h3");
let textSelector = document.querySelector("#text-selector");
let textInput = document.querySelector("#text-input");
let en_language = document.querySelector("#language-eng");
let se_language = document.querySelector("#language-swe");
let casing = document.querySelector("#casing");


// canvas  sitting
let canvas = document.querySelector("#stat-graph");
let c = canvas.getContext("2d");
c.width = canvas.width;
c.height = canvas.height;
c.beginPath();
c.moveTo(0, 100);
c.lineWidth = 3
c.strokeStyle = "white";
let verticalHeight = 100

let spanIndex = 0
let charIndex = misstike = 0;


let startTime
let gWpm
let nWPM
let accuracyN
let gameCounter = 0
let myInterval




const START_VALUE = "start";
const STOP_VALUE = "stop";

const SELECTED_TEXT_NONE_VALUE = "none";

// Toggle the start/stop state of the game
function handleStartButtonClick() {
    textInput.value = "";

    if (startButton.value === START_VALUE) {
        // Clear the interval and reset the character index
        clearInterval(startTime)
        charIndex = 0;
        startButton.setAttribute("id", "img_green");
        startButton.setAttribute("value", STOP_VALUE);
    } else if (startButton.value === STOP_VALUE) {
        if (textSelector.value === SELECTED_TEXT_NONE_VALUE) {
            alert("please pick text");
        } else {
            // Clear the game data and start the game
            clearGame();
            startTime = new Date();
            main();
            // Increment the game counter and update the start button attributes
            gameCounter += 1;
            startButton.setAttribute("id", "img_red");
            startButton.setAttribute("value", START_VALUE);
            // Set the focus to the text input
            textInput.focus();
        }
    }
}

// Add an event listener to the start button for the click event

startButton.addEventListener("click", handleStartButtonClick);





// download data from xml file
function downloadData() {
    const TEXT_FILE = "https://studenter.miun.se/~moda2202/dt146g/project/text.xml";
    let xml = new XMLHttpRequest();
    xml.open("GET", TEXT_FILE, false);
    xml.send();
    let objects = new Array();
    let data = xml.responseXML
    // Extract info about each text
    let titles = data.getElementsByTagName("title");
    let authors = data.getElementsByTagName("author");
    let languages = data.getElementsByTagName("language");
    let texts = data.getElementsByTagName("text");
    for (let i = 0; i < titles.length; i++) {
        objects[i] = {
            title: titles[i].innerHTML,
            author: authors[i].innerHTML,
            language: languages[i].innerHTML,
            text: texts[i].innerHTML
        }
    }
    return objects
}



en_language.addEventListener("click", selectLanguage);
se_language.addEventListener("click", selectLanguage);


function selectLanguage() {
    const titles = downloadData();
    const options = document.querySelectorAll(".option");

    // Remove any existing options from the text selector
    if (options) {
        options.forEach(option => option.remove());
    }

    // Clear the text input value
    textInput.value = "";

    // Select the language to display in the text selector
    const selectedLanguage = en_language.checked ? "english" : "swedish";
    for (let i = 0; i < titles.length; i++) {
        if (titles[i].language === selectedLanguage) {
            textSelector.innerHTML += `<option class="option" value="${titles[i].title}">${titles[i].title}</option>`;
        }
    }
}



// fillContent()
function fillContent() {
    // Get the text data from the XML file
    let objects = downloadData();

    // Bind an event listener to the text selector
    textSelector.addEventListener("change", function () {
        // Clear the text input value
        textInput.value = "";

        // Get the selected text option
        let selectedOption = textSelector.value;

        // Get the related text from the data
        let selectedText;
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].title === selectedOption) {
                selectedText = objects[i];
                break;
            }
        }

        // Update the text field and information elements
        textField.innerHTML = selectedText.text;
        textInformation.innerHTML = selectedText.title;
        let words = textField.innerHTML.split(" ");
        let letters = words.join(" ").length;
        Writer.innerHTML = `${selectedText.author} (${words.length} words, ${letters} chars).`;

        // Split the text into individual characters and create span elements for each character
        let text = textField.innerHTML.split("");
        textField.innerHTML = "";
        text.forEach((char) => {
            const charSpan = document.createElement("span");
            charSpan.innerText = char;
            textField.appendChild(charSpan);
        });
    });
}

fillContent()



let mistakeTag = document.querySelector(".mistake p span");
let grossWpm = document.querySelector(".gross-wpm p span");
let NetWPM = document.querySelector(".Net-WPM p span");
let accuracy = document.querySelector(".Accuracy p span");





function main() {
    // Add an input event listener to the text input element
    textInput.addEventListener("input", () => {
        // Select all span elements within the text field element
        const arrayChar = textField.querySelectorAll("span");
        // Split the value of the text input element into an array of characters and select
        // the character at the current index
        const arrayValue = textInput.value.split("")[charIndex];
        if (arrayValue==null ) {
            return;
            
        }else {
            switch (casing.checked) {
                case true:
                    // If the lowercase version of arrayChar[spanIndex].innerText is equal to the
                    // lowercase version of arrayValue, add the "correct" class to arrayChar[spanIndex],
                    // increment spanIndex and charIndex, and reset the text input value and charIndex if arrayValue is a space character
                    if (arrayChar[spanIndex].innerText.toLowerCase() == arrayValue.toLowerCase()) {
                        arrayChar[spanIndex].classList.add("correct");
                        writingSound()
                        spanIndex++;
                        charIndex++;
                        if (arrayValue == " ") {
                            textInput.value = "";
                            charIndex = 0;
                        }
                    } else if (arrayChar[spanIndex].innerText.toLowerCase() !== arrayValue.toLowerCase()) {
                        arrayChar[spanIndex].classList.add("incorrect");
                        playErrorSound();
                        misstike++;
                        spanIndex++;
                        charIndex++;
                    }
                    break;
                case false:
                    if (arrayChar[spanIndex].innerText == arrayValue) {
                        arrayChar[spanIndex].classList.add("correct");
                        writingSound()
                        spanIndex++;
                        charIndex++;
                        if (arrayValue == " ") {
                            textInput.value = "";
                            charIndex = 0;
                        }
                    } else if (arrayChar[spanIndex].innerText !== arrayValue) {
                        arrayChar[spanIndex].classList.add("incorrect");
                        playErrorSound();
                        misstike++;
                        spanIndex++;
                        charIndex++;
                    }
                    break;
            }
            mistakeTag.innerText = misstike;

            if (arrayChar.length === spanIndex) {
                startButton.setAttribute("id", "img_green");
                startButton.setAttribute("value", STOP_VALUE);
            }else{
                arrayChar.forEach(span => span.classList.remove("active"));
                arrayChar[spanIndex].classList.add("active");
            }
        }
    });
    myInterval = setInterval(startTimer, 1000);
}



function startTimer() {
    if (startButton.value === "start") {
        // Calculate elapsed time in seconds
        let elapsedTime = (Date.now() - startTime) / 1000;

        // Calculate WPM and nWPM
        gWpm = Math.round((spanIndex / 5) / elapsedTime * 60);
        nWPM = Math.round(gWpm - (misstike / elapsedTime * 60));

        // Calculate accuracy
        accuracyN = Math.round(100 * (spanIndex - misstike) / spanIndex);

        // Update the accuracy, nWPM, and gross WPM elements
        if(spanIndex > 0){
            accuracy.innerText = `${accuracyN}%`;
        }
        NetWPM.innerText = nWPM;
        grossWpm.innerText = gWpm;

        // Calculate the vertical and horizontal positions for the next line on the graph
        verticalLine = verticalHeight - gWpm;
        horizontalLine = horizontalLine + 3;

        // Draw the line on the graph
        c.lineTo(horizontalLine, verticalLine);
        c.stroke();
    } else {
        return;
    }
}



// Get the sound effect for typing with error
function playErrorSound() {
    let errorSound = new Audio("./soundEffect/wrong.mp3")
    errorSound.volume = 0.20;
    errorSound.play()
}

// Get the sound effect for typing without error
function writingSound() {
    let errorSound = new Audio("./soundEffect/click.mp3")
    errorSound.volume = 0.20;
    errorSound.play()
}

// clear the game
function clearGame() {

    // let objects = downloadData();
    textField.querySelectorAll("span").forEach(span => span.classList.remove("correct", "incorrect", "active"));

    clearInterval(myInterval)
    horizontalLine = 0
    gWpm = 0
    nWPM = 0
    accuracyN = 0
    misstike = 0
    mistakeTag.innerText = 0
    accuracy.innerText = 0
    NetWPM.innerText = 0
    grossWpm.innerText = 0
    charIndex = 0
    spanIndex = 0
    c.beginPath();
    c.clearRect(0, 0, canvas.width, canvas.height)
}

