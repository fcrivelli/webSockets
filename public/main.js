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
  render(data);
});

function render (data) { 
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