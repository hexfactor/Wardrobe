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

// Add event listener for ESC press, then close the overlay
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.getElementById('overlay').style.display = 'none';
    }
});

document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
});

// Get all SVG elements
var svgs = document.querySelectorAll('#color-picker circle');
svgs.forEach(function(svg) {
    svg.addEventListener('click', function() {
        console.log('clicked');
        // Remove 'selected' class from all SVGs
        svgs.forEach(function(otherSvg) {
            otherSvg.classList.remove('selected');
        });

        // Add 'selected' class to clicked SVG
        this.classList.add('selected');

        // Store selected color
        var selectedColor = this.id;
    });
});

document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault();

    resizeImage(document.getElementById('imageUpload').files[0], 128, 128, function(resizedImage) {
        var item = {
            image: resizedImage,
            name: document.getElementById('name').value,
            color: document.querySelectorAll('#color-picker circle.selected')[0].id,
            material: document.getElementById('material').value,
            category: document.getElementById('category').value,
            washType: document.getElementById('washType').value,
            dryType: document.getElementById('dryType').value,
            uses: 0
        };

        var items = JSON.parse(localStorage.getItem('items')) || [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));

        document.getElementById('overlay').style.display = 'none';
        applyFiltersAndRender(JSON.parse(localStorage.getItem('items')) || []);
    });
});



const items = JSON.parse(localStorage.getItem('items')) || [];
const filters = {
    color: new Set(),
    material: new Set(),
    category: new Set(),
    washtype: new Set(),
};

function applyFiltersAndRender(unfilteredItems) {
    let filteredItems = unfilteredItems;

    if (filters.color.size > 0) {
        filteredItems = filteredItems.filter(item => filters.color.has(item.color));
    }
    if (filters.material.size > 0) {
        filteredItems = filteredItems.filter(item => filters.material.has(item.material));
    }
    if (filters.category.size > 0) {
        filteredItems = filteredItems.filter(item => filters.category.has(item.category));
    }
    if (filters.washtype.size > 0) {
        filteredItems = filteredItems.filter(item => filters.washtype.has(item.washType));
    }

    renderItems(filteredItems);
    console.log(filters);
    console.log(filteredItems);
}

function setupFilters() {
    document.querySelectorAll('#sidebar input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const filterType = this.closest('.filter-section').querySelector('h3').textContent.toLowerCase().replace(' ', '');
            console.log(filterType + ': ' + this.value);
            if (this.checked) {
                filters[filterType].add(this.value);
            } else {
                filters[filterType].delete(this.value);
            }
            applyFiltersAndRender(JSON.parse(localStorage.getItem('items')) || []);
        });
    });
}

setupFilters();
renderItems(items); // Initial render



function deleteItem(index) {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    applyFiltersAndRender(JSON.parse(localStorage.getItem('items')) || []);
}

function incrementItemUses(index) {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    items[index].uses++;
    localStorage.setItem('items', JSON.stringify(items));
    applyFiltersAndRender(JSON.parse(localStorage.getItem('items')) || []);
}

function decrementItemUses(index) {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    if (items[index].uses > 0) {
        items[index].uses--;
        localStorage.setItem('items', JSON.stringify(items));
        applyFiltersAndRender(JSON.parse(localStorage.getItem('items')) || []);
    }
}

function resetItemUses(index) {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    items[index].uses = 0;
    localStorage.setItem('items', JSON.stringify(items));
    applyFiltersAndRender(JSON.parse(localStorage.getItem('items')) || []);
}

function renderItems(items) {
    var grid = document.getElementById('grid');
    grid.innerHTML = '';

    items.forEach(function(item) {
        var div = document.createElement('div');
        div.id = 'gridItem';
        div.innerHTML = `
            <img src="${item.image}">
            <div id="itemDetails">
                <h2>${item.name}</h2>
                <p>${item.color} ${item.material} ${item.category}</p>
                <p>${item.washType}</p>
                <p>${item.dryType}</p>
            </div>
        `;
        div.innerHTML += `
            <div id="itemButtons">
                <button id="decrementItemUsesBtn" onclick="decrementItemUses(${items.indexOf(item)})">−</button>
                <button id="itemUseCount" onclick="resetItemUses(${items.indexOf(item)})">${item.uses}</button>
                <button id="incrementItemUsesBtn" onclick="incrementItemUses(${items.indexOf(item)})">+</button>
                <button id="editItemBtn" onclick="editItem(${items.indexOf(item)})">&#9998;</button>
                <button id="deleteItemBtn" onclick="deleteItem(${items.indexOf(item)})">×</button>
            </div>
        `;
        grid.appendChild(div);
    });
}