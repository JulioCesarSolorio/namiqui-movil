/* eslint-disable no-useless-escape */
const regExNumbersAndSpaces = /^[ \d]+$/i;
const regExUsername = /^[a-z_-\d]+$/i;
const regExSpacesAndLetters = /^[a-z ,.'-]+$/i;
const regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regExPhone = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const regExPassword = /^[a-z!?._-\d]+$/i;
const regExDigit = /[\d]/;
const regExCP = /\b\d{5}\b/;
export {
  regExSpacesAndLetters,
  regExEmail,
  regExPhone,
  regExUsername,
  regExNumbersAndSpaces,
  regExPassword,
  regExDigit,
  regExCP
};
