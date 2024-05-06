document.getElementById('addButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'flex';
});

document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var item = {
        image: document.getElementById('imageUpload').files[0],
        color: document.getElementById('color').value,
        material: document.getElementById('material').value,
        piece: document.getElementById('piece').value,
        washTemperature: document.getElementById('washTemperature').value,
        spinSpeed: document.getElementById('spinSpeed').value,
        tumbleDry: document.getElementById('tumbleDry').checked,
        washSeparately: document.getElementById('washSeparately').checked
    };

    var items = JSON.parse(localStorage.getItem('items')) || [];
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));

    document.getElementById('overlay').style.display = 'none';
    displayItems();
});

function displayItems() {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    var grid = document.getElementById('grid');
    grid.innerHTML = '';

    items.forEach(function(item) {
        var div = document.createElement('div');
        div.innerHTML = '<img src="' + URL.createObjectURL(item.image) + '"><p>Color: ' + item.color + '</p><p>Material: ' + item.material + '</p><p>Piece: ' + item.piece + '</p><p>Wash Temperature: ' + item.washTemperature + '</p><p>Spin Speed: ' + item.spinSpeed + '</p><p>Tumble Dry: ' + item.tumbleDry + '</p><p>Wash Separately: ' + item.washSeparately + '</p>';
        grid.appendChild(div);
    });
}

displayItems();
