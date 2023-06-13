class Category {
  _id;
  name;
  image;
  productCount;
  constructor(obj) {
    this._id = obj._id;
    this.name = obj.name;
    this.image = obj.name;
    this.productCount = obj.productCount;
  }
}
let categories = [];
(function () {
  const response = fetch("http://localhost:5000/api/categories/");
  response.then((data) => {
    data.json().then((d) => {
      let list = "";
      d.data.forEach((element) => {
        let catObj = new Category(element);
        categories.push(catObj);
        list =
          list +
          `<a data-id="${element._id}" onclick="getCities(${element._id})" href="products.php?cat_id=${element._id}" class="nav-item nav-link">${element.name}</a>`;
      });
      document.getElementById("categories-menu").innerHTML = list;
      categories.sort((a, b) => b.productCount - a.productCount);
      showCategories(categories);
    });
  });
})();

const showCategories = function (array) {
  let category = "";
  for (let i = 0; i < 4; i++) {
    category += `
  <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
      <a class="text-decoration-none" href="">
        <div class="cat-item d-flex align-items-center mb-4">
          <div class="overflow-hidden" style="width: 100px; height: 100px">
          <img class="img-fluid" src="./img/cat-${i + 1}.jpg" alt="${
      array[i].image
    }" />
          </div>
          <div class="flex-fill pl-3">
            <h6>${array[i].name}</h6>
            <small class="text-body">${array[i].productCount}</small>
          </div>
        </div>
      </a>
    </div>
  `;
  }
  document.getElementById("categories-container").innerHTML = category;
};

class Product {
  id;
  name;
  price;
  discount;
  image;
  rating;
  rating_count;
  constructor(obj) {
    this.id = obj._id;
    this.name = obj.name;
    this.price = obj.price;
    this.image = obj.image;
    this.discount = obj.discount;
    this.rating = obj.rating;
    this.rating_count = obj.rating_count;
  }

  getPriceAfterDiscount() {
    return this.price - this.price * this.discount;
  }

  getRatingHTML() {
    return `<div class="d-flex align-items-center justify-content-center mb-1">
    <small class="fa fa-star text-primary mr-1"></small>
    <small class="fa fa-star text-primary mr-1"></small>
    <small class="fa fa-star text-primary mr-1"></small>
    <small class="fa fa-star text-primary mr-1"></small>
    <small class="fa fa-star text-primary mr-1"></small>
    <small>(99)</small>
  </div>`;
  }

  getHomeHTML() {
    return `<div class="col-lg-3 col-md-4 col-sm-6 pb-1">
      <div class="product-item bg-light mb-4">
        <div class="product-img position-relative overflow-hidden">
          <img class="img-fluid w-100" src="${this.image}" alt="">
          <div class="product-action">
            <a class="btn btn-outline-dark btn-square" onclick="addToCart('${this.id}')"><i class="fa fa-shopping-cart"></i></a>
            <a class="btn btn-outline-dark btn-square" onclick="handleHeartedCounter('${this.id}')" id="${this.id}"><i class="far fa-heart"></i></a>
            <a class="btn btn-outline-dark btn-square" href="#"><i class="fa fa-sync-alt"></i></a>
            <a class="btn btn-outline-dark btn-square" href="#"><i class="fa fa-search"></i></a>
          </div>
        </div>
        <div class="text-center py-4">
          <a class="h6 text-decoration-none text-truncate" href="">${
            this.name
          }</a>
          <div class="d-flex align-items-center justify-content-center mt-2">
            <h5>$${this.getPriceAfterDiscount()}</h5>
            <h6 class="text-muted ml-2"><del>$${this.price}</del></h6>
          </div>
          <div class="d-flex align-items-center justify-content-center mb-1">
            ${this.getRatingHTML()}
          </div>
        </div>
      </div>
    </div>`;
  }
  

  getWholeProduct() {
    return this;
  }
}
let products = [];
let featuredProducts = [];
(function () {
  response = fetch("http://localhost:5000/api/products/getFeatured");
  response.then((data) => {
    data.json().then((d) => {
      d.data.forEach((element) => {
        let pro = new Product(element);
        featuredProducts.push(pro);
      });
      let proList = "";

      for (let i = 0; i < 8; i++) {
        proList = proList + featuredProducts[i].getHomeHTML();
      }
      document.getElementById("products-container").innerHTML = proList;
    });
  });
})();

let recentProducts = [];
(function () {
  response = fetch("http://localhost:5000/api/products/getRecent");
  response.then((data) => {
    data.json().then((d) => {
      d.data.forEach((element) => {
        let pro = new Product(element);
        recentProducts.push(pro);
      });
      let proList = "";

      for (let i = 0; i < 8; i++) {
        proList = proList + recentProducts[i].getHomeHTML();
      }
      document.getElementById("products").innerHTML = proList;
      products = [...featuredProducts, ...recentProducts];
    });
  });
})();

let counter = 0;
let likeSet = new Set();

function handleHeartedCounter(id) {
  likeSet.add(id);
  document.getElementById("heartCounterButton").innerHTML = likeSet.size;
  document.getElementById(id).style.backgroundColor = "#ffc107";
  localStorage.setItem("likes", likeSet.size);
}


class CartLine {
  product;
  quantity;
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  getTotalPrice() {
    return this.product.getPriceAfterDiscount() * this.quantity;
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }
}

class Cart {
  cartlines;
  constructor(productsArray) {
    this.cartlines = [];
    for (let product of productsArray) {
      this.cartlines.push(new CartLine(product));
    }
  }

  remove(index) {
    this.cartlines.splice(index, 1);
  }

  getTotal(){
    let total = 0;
    for(let i = 0; i < this.cartlines.length; i++){
      total += this.cartlines[i].getTotalPrice();
    }
    return total;
  }

  getSubTotal() {
  }
}

let cartArray = [];
function addToCart(id) {
  const inCart = cartArray.find(line => line.product.id == id);
  if (inCart) {
    inCart.increment();
  } else {
    const product = products.find(obj => obj.id == id);
    const newCartLine = new CartLine(product);
    cartArray.push(newCartLine);
  }

  console.log(cartArray);
  document.getElementById("cartButton").innerHTML = cartArray.length;
  localStorage.setItem("cartSize", cartArray.length);
  localStorage.setItem("cart", JSON.stringify(cartArray));
}
const cart = new Cart(cartArray);
