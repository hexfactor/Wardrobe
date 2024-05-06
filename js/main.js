function resizeImage(file, maxWidth, maxHeight, callback) {
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var width = img.width;
        var height = img.height;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height * maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width * maxHeight / height);
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;

        // draw the image on the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // get the data URL
        var dataUrl = canvas.toDataURL('image/jpeg');

        callback(dataUrl);
    };

    img.src = URL.createObjectURL(file);
}

document.getElementById('addButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'flex';
});

document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault();

    resizeImage(document.getElementById('imageUpload').files[0], 128, 128, function(resizedImage) {
        var item = {
            image: resizedImage,
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
});

function displayItems() {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    var grid = document.getElementById('grid');
    grid.innerHTML = '';

    items.forEach(function(item) {
        var div = document.createElement('div');
        div.innerHTML = '<img src="' + item.image + '"><p>Color: ' + item.color + '</p><p>Material: ' + item.material + '</p><p>Piece: ' + item.piece + '</p><p>Wash Temperature: ' + item.washTemperature + '</p><p>Spin Speed: ' + item.spinSpeed + '</p><p>Tumble Dry: ' + item.tumbleDry + '</p><p>Wash Separately: ' + item.washSeparately + '</p>';
        grid.appendChild(div);
    });
}

displayItems();