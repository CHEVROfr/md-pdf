document.getElementById("button-open-file").onclick = (event) => {
    document.getElementById("file-opener").click()
}

document.getElementById("file-opener").onchange = (e) => {
    var file = e.target.files[0];
    
    let fr = new FileReader()
    fr.onload = x=> document.getElementById("markdown_content").value = fr.result
    fr.readAsText(file)
}