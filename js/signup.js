const singup = async () => {
    const firstName =document.getElementById("firstName").value;
    const lastName =document.getElementById("lastName").value;
    const email =document.getElementById("email").value;
    const password =document.getElementById("password").value;
    const userData ={
        firstName:firstName,
        lastName:lastName,
        email: email,
        password: password 
    };
    const response =
     await fetch("http://localhost:5000/api/users/register", {
      method: "POST", body: JSON.stringify(userData), headers: { "Content-Type": "application/json"},
    });
    if (response.statusText) {
        const container = document.querySelector('div.right');
        const loader = document.createElement('h4');
        loader.appendChild(document.createTextNode( `Welcome To Multi Shop`) );
        loader.style.color="green";
        container.appendChild(loader);
 
    }
    else{
        const container = document.querySelector('div.right');
        const loader = document.createElement('h4');
        loader.appendChild(document.createTextNode( `Sorry, this is invalid Email Or Password`) );
        loader.style.color="red";
        container.appendChild(loader);
    }
    const json =
     await response.json();
    localStorage.setItem
    ("token",json.token)
    localStorage.setItem
    ("name",`${json.first_name} ${json.last_name}`);
    window.location.href =
     "index.html"; 
    
  };
  