import React, { useEffect, useState } from 'react'
import * as yup from "yup"

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const schema = yup.object().shape({

  fullName: yup
    .string()
    .test('character-count', 'Full name must be between 3 and 20 characters', value => {
      // Filter whitespace and count characters
      const nonWhiteSpaceLength = value.replace(/\s/g, '').length;
      // Counts whitout whitespace
      return nonWhiteSpaceLength > 2 && nonWhiteSpaceLength < 21;
    }),

  size: yup
    .string()
    .oneOf(['S', 'M', 'L'])
    .required('Size is required'),

  pizzaToppings: yup
  .number()
  .positive()
  .min(0)
  .max(5)
})

let name = '';
let pizzaSize = '';
let numberOfToppingsin = 0;

let errorMesage = '';



// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]


export default function Form() {
  const [submitButtonStatus1, setSubmitButtonStatus1] = useState(true)
  const [submitButtonStatus2, setSubmitButtonStatus2] = useState(true)
  const [mainSubmitButtonStatus, setMainSubmitButtonStatus] = useState(true)
  const [errorForShortName, setErrorForShortName] = useState(false);
  const [errorForLongName, setErrorForLongName] = useState(false)
  const [errorForSize, setErrorForSize] = useState(false)
  const [validData, setValidData] = useState({
    inputsAreValid: false,
    inputsAreInvalid: false
  })
  const [chekedBoxes, setChekedBoxes] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  })
  let counter = 0;



  // EVENT for INPUT FULLNAME -----------------------
  const inputChangeFunction = (e) => {
    const inputName = e.target.value
    const numberOfSpaces = inputName.split('').filter(char => char === ' ').length;
    const result = inputName.length - numberOfSpaces

    if (result > 2 && result < 21) {
      setErrorForLongName(false)
      setErrorForShortName(false)
      setSubmitButtonStatus1(false)
    }else {
      if (result < 3) {
        setErrorForShortName(true)
      }else if (result > 20) {
        setErrorForLongName(true)
      }
      setSubmitButtonStatus1(true)
    }
    if(submitButtonStatus1 === false && submitButtonStatus2 === false) {
      setMainSubmitButtonStatus(false)
    }
  }

  // EVENT for SIZE ---------------------------------
  const selectSize = (e) => {
    const selectedSize = e.target.value
    if (selectedSize == 'S' || selectedSize == 'M' || selectedSize == 'L') {
      setErrorForSize(false)
      setSubmitButtonStatus2(false)
    }else {
      setErrorForSize(true)
      setSubmitButtonStatus2(true)
    }
  }

  // EVENT for TOPPINGS -----------------------------
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setChekedBoxes(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };


  // To save data from checkbox ---------------------
  useEffect(() => {
    for (let i = 0; i < 6; i++) {
      if(chekedBoxes[i] === true){
        counter++
      }
    }
  }, [chekedBoxes])


  // To activate submit button -----------------------
  useEffect(() => {
    if(submitButtonStatus1 === false && submitButtonStatus2 === false) {
      setMainSubmitButtonStatus(false)
    }else {
      setMainSubmitButtonStatus(true)
    }
  }, [!submitButtonStatus1 && !submitButtonStatus2])


  // Submit button ----------------------------
  const submitForm = (e) => {

    e.preventDefault()
    // Validate the customer input against schema

    const inputfullName = e.target[0].value
    const selectSize = e.target[1].value

    const objectForValidation = {
      fullName: inputfullName,
      size: selectSize,
      pizzaToppings: counter
    }
    console.log(objectForValidation.fullName)

    schema
      .validate(objectForValidation)
      .then((valid) => {
        console.log('Validation successful:', valid);
        setValidData({
          inputsAreValid: true
        })
        
        name = valid.fullName
        if (valid.size == 'S') {
          pizzaSize = 'small'
        } else if(valid.size == 'M') {
          pizzaSize = 'medium'
        } else if(valid.size == 'L') {
          pizzaSize = 'large'
        }
        

        if (valid.pizzaToppings == 0) {
          numberOfToppingsin = 'no'
        } else {
          numberOfToppingsin = valid.pizzaToppings
        }
        e.target[0].value = '';
        e.target[1].value = '';
        setSubmitButtonStatus1(true)
        setSubmitButtonStatus2(true)

        const initialCheckedState = {};
        toppings.forEach(topping => {
          initialCheckedState[topping.topping_id] = false;
        });
        setChekedBoxes(initialCheckedState);
      })
      .catch((error) => {
        console.error('Validation failed:', error);
        console.log('objectForValidation', objectForValidation.fullName.length)
        const numberOfSpaces = objectForValidation.fullName.split('').filter(char => char === ' ').length;
        const result = objectForValidation.fullName.length - numberOfSpaces
        if(result == 0) {
          errorMesage = 'fullName is required'
        } else if (result < 3) {
          errorMesage = validationErrors.fullNameTooShort
        } else if (result > 20) {
          errorMesage = 'fullName cannot exceed 20 characters'
        } else {
          errorMesage = 'size must be one of the following values: S, M, L'
        }
        setValidData({
          inputsAreInvalid: true
        })
        
      });
  }

  return (
    <form onSubmit={submitForm}>
      <h2>Order Your Pizza</h2>
      {validData.inputsAreValid && <div className='success'>{`Thank you for your order, ${name}! Your ${pizzaSize} pizza with ${numberOfToppingsin} toppings is on the way.`}</div>}
      {validData.inputsAreInvalid && <div className='failure'>{errorMesage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input 
            placeholder="Type full name" 
            id="fullName" 
            type="text"
            onChange={inputChangeFunction} />
        </div>
        {errorForShortName && <div className='error'>{validationErrors.fullNameTooShort}</div>}
        {errorForLongName && <div className='error'>{validationErrors.fullNameTooLong}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select 
            id="size"
            onChange={selectSize}>
              
            <option value="">----Choose Size----</option>
            {/* Missing options already filled */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errorForSize && <div className='error'>{validationErrors.sizeIncorrect}</div>}
      </div>

      <div className="input-group">
      {/* 👇 checkboxes generated dynamically */}
      {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name={topping.topping_id}
              onChange={handleCheckboxChange}
              checked={chekedBoxes[topping.topping_id]}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>

      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={mainSubmitButtonStatus} />
    </form>
  )
}