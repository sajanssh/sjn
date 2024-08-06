document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productForm');
    const editForm = document.getElementById('editForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const isEditing = form.dataset.isEditing === 'true';
            const productName = document.getElementById('productName').value;
            const sellingPrice = document.getElementById('sellingPrice').value;
            const costPrice = document.getElementById('costPrice').value;
            const wholesalePrice = document.getElementById('wholesalePrice').value;
            const quantity = document.getElementById('quantity').value;
            const productImage = document.getElementById('productImage').files[0];

            const reader = new FileReader();
            reader.onloadend = function() {
                const productImageData = reader.result;
                const product = {
                    name: productName,
                    sellingPrice: sellingPrice,
                    costPrice: costPrice,
                    wholesalePrice: wholesalePrice,
                    quantity: quantity,
                    image: productImageData
                };

                if (isEditing) {
                    const index = form.dataset.editIndex;
                    updateProduct(index, product);
                } else {
                    saveProduct(product);
                    showSuccessPopup();
                }

                form.reset();
                form.dataset.isEditing = 'false';
                document.getElementById('formButton').innerText = 'Add Product';
            };

            if (productImage) {
                reader.readAsDataURL(productImage);
            } else {
                const index = form.dataset.editIndex;
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const existingProduct = products[index];

                const product = {
                    name: productName,
                    sellingPrice: sellingPrice,
                    costPrice: costPrice,
                    wholesalePrice: wholesalePrice,
                    quantity: quantity,
                    image: existingProduct.image
                };

                if (isEditing) {
                    updateProduct(index, product);
                } else {
                    saveProduct(product);
                    showSuccessPopup();
                }

                form.reset();
                form.dataset.isEditing = 'false';
                document.getElementById('formButton').innerText = 'Add Product';
            }
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const index = editForm.dataset.editIndex;
            const productName = document.getElementById('editProductName').value;
            const sellingPrice = document.getElementById('editSellingPrice').value;
            const costPrice = document.getElementById('editCostPrice').value;
            const wholesalePrice = document.getElementById('editWholesalePrice').value;
            const quantity = document.getElementById('editQuantity').value;
            const productImage = document.getElementById('editProductImage').files[0];

            const reader = new FileReader();
            reader.onloadend = function() {
                const productImageData = reader.result;
                const product = {
                    name: productName,
                    sellingPrice: sellingPrice,
                    costPrice: costPrice,
                    wholesalePrice: wholesalePrice,
                    quantity: quantity,
                    image: productImageData
                };

                updateProduct(index, product);
                closeEditPopup();
            };

            if (productImage) {
                reader.readAsDataURL(productImage);
            } else {
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const existingProduct = products[index];

                const product = {
                    name: productName,
                    sellingPrice: sellingPrice,
                    costPrice: costPrice,
                    wholesalePrice: wholesalePrice,
                    quantity: quantity,
                    image: existingProduct.image
                };

                updateProduct(index, product);
                closeEditPopup();
            }
        });
    }

    if (document.getElementById('searchInput')) {
        document.getElementById('searchInput').addEventListener('input', function() {
            searchProducts();
        });
    }

    displayProducts(JSON.parse(localStorage.getItem('products')) || []);
});

function showSuccessPopup() {
    document.getElementById('successPopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('successPopup').style.display = 'none';
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput));

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    if (productList) {
        productList.innerHTML = '';
        products.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <h2>${product.name}</h2>
                    <p>Selling Price: Rs ${product.sellingPrice}</p>
                    <p>Cost Price: Rs ${product.costPrice}</p>
                    <p>Wholesale Price: Rs ${product.wholesalePrice}</p>
                    <p>Quantity: ${product.quantity}</p>
                    <button onclick="openEditPopup(${index})">Edit</button>
                    <button onclick="deleteProduct(${index})">Delete</button>
                </div>
            `;
            productList.appendChild(productItem);
        });
    }
}

function openEditPopup(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];

    document.getElementById('editProductName').value = product.name;
    document.getElementById('editSellingPrice').value = product.sellingPrice;
    document.getElementById('editCostPrice').value = product.costPrice;
    document.getElementById('editWholesalePrice').value = product.wholesalePrice;
    document.getElementById('editQuantity').value = product.quantity;

    const editForm = document.getElementById('editForm');
    editForm.dataset.editIndex = index;

    document.getElementById('editPopup').style.display = 'flex';
}

function closeEditPopup() {
    document.getElementById('editPopup').style.display = 'none';
}

function updateProduct(index, updatedProduct) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products[index] = updatedProduct;
    localStorage.setItem('products', JSON.stringify(products));

    displayProducts(products);
}

function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));

    displayProducts(products);
}

function saveProduct(product) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    displayProducts(products);
}
