const mentionRegex = /^[@#§]\w+/g;
const variableRegex = /^[$]\w+/g;
const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\/\S*)?/g;

function handleSquealTextChange(characterCountFunc, isSquealTemporized, setVariablesListFunc, variablesList) {

    let target = document.getElementById("outlined-multiline-flexible");

    //check if last char is invalid
    if (target.value.endsWith(">") || target.value.endsWith("<")) {
        //remove last character from text
        target.value = target.value.slice(0, -1);
        alert("Invalid character.");
        return;
    }



    //update char count
    characterCountFunc(target.value.length);

    //split text into array
    const segments = target.value.split(" ");

    //iterate over segments
    for (let i = 0; i < segments.length; i++) {
        if (segments[i] === '\n') {
            continue;
        }
        //check if segment contains \n
        if (segments[i].includes("\n")) {

            //split segment into array
            const lines = segments[i].split("\n");
            let tmp_seg = [];
            //iterate over lines
            for (let j = 0; j < lines.length; j++) {
                //push line to tmp array
                tmp_seg.push(lines[j]);
                //push \n
                tmp_seg.push("\n");
            }
            //remove last char, if segment ends with \n is empty while if it does not ends with \n is \n
            tmp_seg.pop();
            //insert tmp array into segments at index i
            segments.splice(i, 1, ...tmp_seg);
        }
    }

    //check if last segment's last char is \n
    if (segments[segments.length - 1].endsWith("\n")) {
        if (segments[segments.length - 1] !== "\n") {
            //remove last char
            segments[segments.length - 1] = segments[segments.length - 1].slice(0, -1);
            //push \n to new segment
            segments.push("\n");
        }
    }

    //clear variables and store them for later check
    let variables = variablesList;
    let tmpVariables = [];

    //generate HTML & update masked content
    document.getElementById("masked-content").innerHTML = segments.map((segment, index) => {

        if (segment.match(urlRegex)) {
            //check if segment starts with http
            let href = segment;
            if (!segment.startsWith("http")) {
                //add http
                href = "https://" + segment;
            }
            return `<a href="${href}" target="_blank" class="highlight">${segment}</a>`
        }
        else if (segment.match(mentionRegex)) {
            return `<span class="highlight">${segment}</span>`
        }
        else if ( isSquealTemporized && segment.match(variableRegex)) {
            //push variable to tmp variables list
            tmpVariables.push({name: segment, type: "unset"});
            return `<span class="variable">${segment}</span>`
        } else if (segment.includes("\n")) {
            //check if next segment exists
            if (segments[index + 1] !== undefined && segments[index + 1] !== "") {
                return `<br>`
            } else {
                //put whitespace to trigger new line on div
                return `<br><span style="color: transparent">*</span>`
            }
        } else if (segment === "") {
            return ``;
        } else {
            return `<span>${segment}</span>`
        }
    }).join(' ');



    if (isSquealTemporized) {
        for (let i = 0; i < tmpVariables.length; i++) {
            //check if variables[i] still exists
            if (variables[i] !== undefined) {
                if (tmpVariables[i].name === variables[i].name) {
                    //set type
                    tmpVariables[i].type = variables[i].type;
                }
            }
        }
        //update variables list
        setVariablesListFunc(tmpVariables);
    }
}