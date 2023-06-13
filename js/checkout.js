



/* When the checkout page is loaded you have to get the products from the
    localstorage and 
    display them as cart lines (product name and quantity) and display the subtotal 
    and 
    the tax and the total price





    The tax should be 
- 10% when you select pay by paypal, 
- 15% on the cheque 
- 5% with the bank transfer option




You have to implement the common validations on the billing address form

When you click place order button you have 
    to post a request to [http://localhost:5000/api/orders/] API, 
    remember thar add order API required a token first (you have to be logged in first)
*/


document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    if (!token) {
        location.href = "./login.html"
    };
    const user = parseJwt(token);
    // getting cart items from local storage
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]" );
    let subTotal = 0;
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i] ; 
        console.log(item)
        const productsCont = document.getElementById("products");
        const prod = document.createElement("div");
        const name = document.createElement("p");
        const price = document.createElement("p");
        prod.className = "d-flex justify-content-between";
        prod.appendChild(name);
        prod.appendChild(price);
        name.textContent = `${item.product.name} x (${item.quantity})`
        price.innerText = `$${item.product.price * item.quantity}`
        productsCont.appendChild(prod);

        subTotal += item.product.price * item.quantity;
    }
    const subT = document.getElementById("subTotal").innerHTML =  `$${subTotal}`;
    console.log(subTotal);

    const tax = document.querySelectorAll("input[name='payment']");
    // calculate tax
    for (let i = 0; i < tax.length; i++) {
        tax[i].addEventListener("click", function() {
            const value = tax[i].value;
            document.querySelector("#tax").innerHTML = `${value}%`;
            let taxRate = value / 100;
            let total = Number(subTotal) * Number(taxRate) + Number(subTotal);           
            document.querySelector("#totalSum").innerHTML = `$${total.toFixed(2)}`;
        });
    }
    document.getElementById("billingForm").addEventListener("submit" , function (event) {
        event.preventDefault();
        
        const data =  {
            "shipping_info": {
                "first_name": document.getElementById("first_name").value,
                "last_name": document.getElementById("last_name").value,
                "email": document.getElementById("email").value || user.email,
                "mobile_number": document.getElementById("mobile_number").value,
                "address1": document.getElementById("address1").value,
                "address2": document.getElementById("address2").value,
                "country": document.getElementById("country").value,
                "city": document.getElementById("city").value,
                "state": document.getElementById("state").value,
                "zip_code": document.getElementById("zip_code").value
            },
            "sub_total_price": subTotal,
            "shipping": 10,
            "total_price": subTotal + 10,
            "user_id": user.user_id ,
            "order_date": new Date(),
            "order_details": cartItems.map( (itm) => {
                return {
                    "product_id": itm.product.id,
                    "price": itm.product.price,
                    "qty": itm.quantity
                }
            })
        };
        console.log(data)
        fetch ("http://localhost:5000/api/orders/",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{"Content-Type":"application/json","x-access-token":token}
        }).then((res)=>{
            alert("Order Placed Successfully");
        })
    })
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}





