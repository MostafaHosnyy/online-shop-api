const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById('myForm');

function validatefirstName(){
    if (checkIfEmpty(firstName))return;
    if (!checkIfOnlyLetters(firstName)) return;
    return true;
}
function validatelastName(){
  if (checkIfEmpty(lastName))return;
  if (!checkIfOnlyLetters(lastName)) return;
  return true;
}
function validateEmail() {
    if (checkIfEmpty(email)) return;
    return true;
  }

function validatePassword() {
    if (checkIfEmpty(password)) return;
    if (!meetLength(password, 4, 100)) return;

    return true;
  }

function checkIfEmpty(field){
    if (isEmpty(field.value)){
        setInvalid(field, `${field.name} Must Not Be Empty`)
        return true;
    } else{
        setValid(field);
        return false;
    }
}
function isEmpty(value){
    if(value === '')return true;
    return false;
}
function setInvalid(field, message) {
    field.className = 'invalid';
    field.nextElementSibling.innerHTML = message;
    field.nextElementSibling.style.color = "red";

  }
  function setValid(field) {
    field.className = 'valid';
    field.nextElementSibling.innerHTML = '';
  }
  function checkIfOnlyLetters(field) {
    if (/^[a-zA-Z ]+$/.test(field.value)) {
      setValid(field);
      return true;
    } else {
      setInvalid(field, `${field.name} must contain only letters`);
      return false;
    }
  }

  function meetLength(field, minLength, maxLength) {
    if (field.value.length >= minLength && field.value.length < maxLength) {
      setValid(field);
      return true;
    } else if (field.value.length < minLength) {
      setInvalid(
        field,
        `${field.name} must be at least ${minLength} characters long`
      );
      return false;
    } else {
      setInvalid(
        field,
        `${field.name} must be shorter than ${maxLength} characters`
      );
      return false;
    }
  }