const products = localStorage.getItem("products");
const like = localStorage.getItem("likes")
const cartCounter = localStorage.getItem("cart");

document.getElementById("likesCounter").innerHTML = like;
document.getElementById("cartCounter").innerHTML = JSON.parse(cartCounter).length;

class List {
    constructor() {
      this.containerProdect = JSON.parse(products);
      this.shopDataApi();
    }
    shopDataApi = async () => {
        const response = await fetch("http://localhost:5000/api/products");
        const json = await response.json();
        const data = json.data;
        localStorage.setItem("products", JSON.stringify(data));
        this.buildProducts(this.containerProdect);
    };
    buildProducts(prodvalue){
      let productHTML = "";
      for (let i = 0; i < prodvalue.length; i++) {
        const product = prodvalue[i];
        const ratingCount = this.getStar(product.rating);
        productHTML += `
          <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
            <div class="product-item bg-light mb-4">
              <div class="product-img position-relative overflow-hidden">
                <img class="img-fluid w-100" src="${product.image}" alt="${product.name}">
                <div class="product-action">
                  <a class="btn btn-outline-dark btn-square" id="btn-cart" onclick="cart.add('${product._id}')"><i class="fa fa-shopping-cart"></i></a>
                  <a class="btn btn-outline-dark btn-square" id="btn-love" onclick="fav.add('${product._id}')"><i class="far fa-heart"></i></a>
                  <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                  <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                </div>
              </div>
              <div class="text-center py-4">
                <a class="h6 text-decoration-none text-truncate" href="">${product.name}</a>
                <div class="d-flex align-items-center justify-content-center mt-2"><h5>$${product.price}</h5>
                  <h6 class="text-muted ml-2"><del>$${product.price + product.price * product.discount}</del></h6>
                </div>
                <div class="d-flex align-items-center justify-content-center mb-1">${ratingCount}
                  <small>${product.rating_count}</small>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      document.getElementById("products").innerHTML = productHTML;
    };
    getStar = (counting) => {
        let star = "";
        for (let i = 1; i <= 5; i ++){
          star+=`<small class="fa${(counting-i >=-0.6)? '':'r'}
             fa-star${(i-counting==0.5)?'-half-alt':''} text-primary mr-1"></small> ` }
        return star
      };
  }
  const shop = new List();

  class Filters extends List {
    constructor( price, color, size, filterOptions) {
      super();
      this.filters = [];
      this.priceClick = price;
      this.colorClick = color;
      this.sizeClick = size;
      this.filtersClick = filterOptions;
      this.price ={
        pAll: document.getElementById("price-all"),
        p1: document.getElementById("price-1"),
        p2: document.getElementById("price-2"),
        p3: document.getElementById("price-3"),
        p4: document.getElementById("price-4"),
        p5: document.getElementById("price-5"),
      }; this.color = {
        cAll: document.getElementById("color-all"),
        c1: document.getElementById("color-1"),
        c2: document.getElementById("color-2"),
        c3: document.getElementById("color-3"),
        c4: document.getElementById("color-4"),
        c5: document.getElementById("color-5"),
      }; this.size = {
        sAll: document.getElementById("size-all"),
        s1: document.getElementById("size-1"),
        s2: document.getElementById("size-2"),
        s3: document.getElementById("size-3"),
        s4: document.getElementById("size-4"),
        s5: document.getElementById("size-5"),
      };
      this.getFilter();
    }
    getFilter = () => {
      for (let p in this.price) {
        this.price[p].addEventListener("change",this.checkedProducts);}
      for (let c in this.color) {
        this.color[c].addEventListener("change",this.checkedProducts);}
      for (let s in this.size) {
        this.size[s].addEventListener("change",this.checkedProducts);}
    };
  
    checkedProducts = () => {

      let priceClick = [];
      if (this.price.pAll.checked) {priceClick .push([0, 1000]);}else {
        if (this.price.p1.checked) {priceClick.push([0, 100]);}
        if (this.price.p2.checked) {priceClick.push([100, 200]);}
        if (this.price.p3.checked) {priceClick.push([200, 300]);}
        if (this.price.p4.checked) {priceClick.push([300, 400]);}
        if (this.price.p5.checked) {priceClick.push([400, 500]);}
      }

      let colorClick = [];
      if (this.color.cAll.checked) {colorClick.push("black", "white", "red", "green", "blue");}else {
        if (this.color.c1.checked) {colorClick.push("black");}
        if (this.color.c2.checked) {colorClick.push("white");}
        if (this.color.c3.checked) {colorClick.push("red");}
        if (this.color.c4.checked) {selectedColors.push("blue");}
        if (this.color.c5.checked) {colorClick.push("green");}
      }

      let sizeClick = [];
      if (this.size.sAll.checked) {sizeClick.push("xs", "s", "m", "l", "xl");} else {
        if (this.size.s1.checked) {sizeClick.push("xs");}
        if (this.size.s2.checked) { sizeClick.push("s");}
        if (this.size.s3.checked) {sizeClick.push("m");}
        if (this.size.s4.checked) {sizeClick.push("l");}
        if (this.size.s5.checked) {sizeClick.push("xl");}
      }
  
      const filteres = this.containerProdect.filter((product) => {
        const priceFilters= product.price;
        for (let i = 0; i < priceClick.length; i++) {
          const lowerBound = priceClick[i][0];
          const upperBound = priceClick[i][1];
          if (priceFilters >= parseInt(lowerBound) && priceFilters <= parseInt(upperBound)) {
            return true;
          }
        }
      });
     this.filterOptions = [];
      filteres.forEach((product) => {
        colorClick.forEach((color2) => {
          let color = product.color;
          if (color == color2) {
            sizeClick.forEach((size2) => {
              let size = product.size;
              if (size == size2) {this.filterOptions.push(product);}
            });
          }
        });
      });
      if (this.filterOptions !== "undefined" &&
        this.filterOptions.length === 0) {
        console.log("Sorry, We don't have this prodect");
        this.buildProducts(this.containerProdect);}
         else {this.buildProducts(this.filterOptions);}
    };
  }
  const filter = new Filters();
  
