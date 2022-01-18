const app = document.getElementById('app');
const statusBox = document.getElementById('statusBox');

const url = "http://localhost:8080/";
const socket = io(url)


let count = 0;
/**
 * The function will render data in a table
 * 
 * @param {object} data The data sent from server 
 * @param {object} status Server status sent from server 
 * @returns {string} html
 */
function render(data, status = null) {
    if(count > 6){
        app.removeChild(app.lastElementChild)
    }
    count++
    statusBox.innerText = status.message;
    statusBox.style.color = "green";

    let row = document.createElement('tr');
    let values = data.body

    let dataItems = ['Temperature', "Sensor1","Sensor2", "Sensor3", "Time"];
    
    let noCell = document.createElement('th');
    noCell.innerText = count;
    row.appendChild(noCell);
    dataItems.forEach(item => {
        let cell = document.createElement('td');
        cell.innerText = values[item];
        row.appendChild(cell);
    });

    
    console.log(row);
    app.prepend(row);
}
// render html

statusBox.innerText = "Not connected";

socket.on("newInfo", (res) => {
    console.log(res);
    render(res.result, {
        message: res.message,
        statusCode: 200
    });
});

socket.on("onConnect", (res) => {
    console.warn( res);
    statusBox.innerText = res.message;
    statusBox.style.color = "blue";
});

fetch(url)
    .then(response => response.json())
    .then(json => {
        console.log(json);
    }).catch(err => {
        console.log(err);
    })

