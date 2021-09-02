var TABLE_ID = '#ProductsTable';
var CONTAINER = '#Container';
var table;

$(document).ready(function() {
    initTable();
});


var socket = io.connect('http://localhost:8080', { 
  'forceNew': true
}); 
socket.on('products', function(data) { 
  console.log(data);
  renderProducts(data);
});
socket.on('messages', function(data) { 
  console.log(data);
  renderMessages(data);
});

function renderMessages (data) { 
  var html = data.map(function(elem, index) { 
    return(`<div>
            <strong style="color: blue;">${elem.author}</strong>
            <strong style="color: brown;">${elem.time}</strong> : 
            <em style="color: green;">${elem.text}</em> </div>`);
  }).join(" "); 
  document.getElementById('messages').innerHTML = html; 
}

function showTime(){
    myDate = new Date();
    day = myDate.getDate();
    month = myDate.getMonth();
    year = myDate.getFullYear();
    hours = myDate.getHours();
    minutes = myDate.getMinutes();
    seconds = myDate.getSeconds();
    if (hours < 10) hours = 0 + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return (day + "/" + month + "/" + year + " " + hours+ ":" +minutes+ ":" +seconds);
}

function addMessage(e) { 
  var message = { 
    author: document.getElementById('username').value, 
    text: document.getElementById('texto').value,
    time: showTime()
  }; 
  socket.emit('new-message', message); return false; 
}

function renderProducts (data) { 
  loadTable(data);
}

function addProduct(e) { 
  var product = { 
    title: document.getElementById('title').value, 
    price: document.getElementById('price').value,
    thumbnail: document.getElementById('thumbnail').value 
  }; 
  socket.emit('new-product', product); return false; 
}

function loadTable (products) {
    $(TABLE_ID).dataTable().fnClearTable();
    if (products.length > 0) {
        $(TABLE_ID).dataTable().fnAddData(products);
    }
    $(TABLE_ID).dataTable().fnDraw();
}

function initTable () {
    table = $(TABLE_ID).DataTable({
        "aoColumns": [{
                "sTitle": "Titulo",
                "mData": "title",
                "bSearchable": true
            },
            {
                "sTitle": "Precio",
                "mData": "price",
                "bSearchable": true
            },
            {
                "sTitle": "Icono",
                "mData": "thumbnail",
                "render": function(data, type, full, meta) {
                    var image =`<img src="${full.id}" height="40"/>`;
                    return image;
                },
                "bSearchable": true
            },
        ],
        "scrollY": "300px",
        "scrollX": true,
        "scrollCollapse": true,
        "paging": false,
        "columnDefs": [
            { width: '20%', targets: 0 }
        ],
        "ajax": {
        },
        "fixedColumns": true,
        "serverSide": false,
        "deferLoading": 0,
        "order": [
            [1, "asc"]
        ]
    });
    $(CONTAINER).css('display', 'block');
    table.columns.adjust().draw();
}