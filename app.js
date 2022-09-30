const languageSelect = document.querySelectorAll(".languages");
const leftLanguage = document.getElementById("leftLanguage");
const rightLanguage = document.getElementById("rightLanguage");
const tranlateBtn = document.getElementById("translateBtn");
const leftTextArea = document.getElementById("leftTextArea");
const rightTextArea = document.getElementById("rightTextArea");
const errorBox = document.querySelector(".error-box");
const replaceBtn = document.getElementById("replaceBtn");
const copyBtn = document.querySelectorAll(".copyBtn");
const copiedInfo = document.querySelector(".copy-box");
const speakBtn = document.querySelectorAll(".speak");


// load languages
window.addEventListener('load', () => {
    let html = "";
    for (let lang in languages) {
        let option = `
            <option value="${lang}">${languages[lang]}</option>
        `;
        html += option;
    }

    languageSelect.forEach(item => {
        item.innerHTML = html;
    });
})

// translate text
tranlateBtn.addEventListener('click', () => {
    fetch(`https://api.mymemory.translated.net/get?q=${leftTextArea.value}!&langpair=${leftLanguage.value}|${rightLanguage.value}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.responseStatus == "403") {
                throw new Error('* Please select two distinct languages');
            }
            const translatedText = data.responseData.translatedText;
            translate(translatedText);
        })
        .catch(err => {
            errorShow(err.message);
        });

});

function translate(text) {
    if (text == "!") {
        rightTextArea.value = "";
        errorShow("* Please write something in text area");
        return;
    }
    rightTextArea.value = text;
}

// replace languages and text
replaceBtn.addEventListener('click', () => {
    const leftLan = leftLanguage.value;
    const leftTxt = leftTextArea.value;

    leftLanguage.value = rightLanguage.value;
    leftTextArea.value = rightTextArea.value;
    rightLanguage.value = leftLan;
    rightTextArea.value = leftTxt;
});

// show error
function errorShow(msg) {
    errorBox.innerHTML = msg;
    errorBox.classList.add("active");

    setTimeout(() => {
        errorBox.classList.remove("active");
    }, 3000)
}

// copy text areas
copyBtn.forEach(item => {
    item.addEventListener('click', () => {
        if (item.id == "left") navigator.clipboard.writeText(leftTextArea.value);
        if (item.id == "right") navigator.clipboard.writeText(rightTextArea.value);

        if (leftTextArea.value == "" && rightTextArea.value == "") return;
        // show copied info
        copiedInfo.classList.add("active");

        setTimeout(() => {
            copiedInfo.classList.remove("active");
        }, 3000)
    });
});

// vocalization translate text
const synth = window.speechSynthesis;

speakBtn.forEach(item => {
    item.addEventListener('click', () => {
        if (item.id == "left") {
            const utterThis = new SpeechSynthesisUtterance(leftTextArea.value);
            utterThis.lang = leftLanguage.value;
            synth.speak(utterThis);
        }

        if (item.id == "right") {
            const utterThis = new SpeechSynthesisUtterance(rightTextArea.value);
            utterThis.lang = rightLanguage.value;
            synth.speak(utterThis);
        }
    });
});