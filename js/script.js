const defaultLanguage = "en-US"
const userLanguage =
  navigator.language || navigator.userLanguage || defaultLanguage

const LOCALE_SETTINGS = {
  "en-US": {
    decimalSeparator: ".",
    thousandSeparator: ","
  },
  "pt-BR": {
    decimalSeparator: ",",
    thousandSeparator: "."
  }
}

const getLocaleSettings = (language) =>
  LOCALE_SETTINGS[language] || LOCALE_SETTINGS[defaultLanguage]

const formatDisplayValue = (value, decimalSeparator, thousandSeparator) => {
  const [integerPart, decimalPart] = value.split(decimalSeparator)
  const integer = integerPart.replaceAll(thousandSeparator, "")
  const formattedNumber = Number(integer).toLocaleString("pt-BR")

  return decimalPart
    ? `${formattedNumber}${decimalSeparator}${decimalPart}`
    : formattedNumber
}

const convertToNumericValue = (
  value = "",
  decimalSeparator,
  thousandSeparator
) => {
  let numericValue = value
    .replaceAll(thousandSeparator, "")
    .replace(decimalSeparator, ".")
  if (numericValue.endsWith(".")) numericValue = numericValue.slice(0, -1)

  return numericValue
}

const display = document.querySelector("#display")
const { decimalSeparator, thousandSeparator } = getLocaleSettings(userLanguage)

display.addEventListener("animationend", () =>
  display.classList.remove("calc__display--blink")
)

let history = []
let isTyping = false

const executeOperation = (action) => {
  const lastEntry = history.at(-1)
  const isOperation = isNaN(
    convertToNumericValue(lastEntry, decimalSeparator, thousandSeparator)
  )

  if (isTyping) {
    history.push(
      convertToNumericValue(display.value, decimalSeparator, thousandSeparator)
    )
    display.value = eval(history.join(""))
      .toString()
      .replace(".", decimalSeparator)

    if (action !== "=") history.push(action)

    isTyping = false
  } else if (isOperation && history.length > 0) {
    if (action !== "=") {
      history.pop()
      history.push(action)
    }
  }

  console.log(history)

  display.classList.add("calc__display--blink")
}

const handleNumericInput = (input) => {
  const containsDecimalSeparator = display.value.includes(decimalSeparator)

  if (!display.getAttribute("placeholder")) return
  if (!isTyping) display.value = ""

  if (
    !containsDecimalSeparator &&
    input === "0" &&
    Number(display.value) <= 0
  ) {
    input = ""
  }

  display.value += input
  display.value = formatDisplayValue(
    display.value,
    decimalSeparator,
    thousandSeparator
  )
  isTyping = true
  display.classList.add("calc__display--blink")
}

const handleActionInput = (action) => {
  const containsDecimalSeparator = display.value.includes(decimalSeparator)
  const isEmpty = !display.value

  switch (action) {
    case "on-ce":
      display.setAttribute("placeholder", 0)
      history = []
      display.value = ""
      break
    case "off":
      display.removeAttribute("placeholder")
      history = []
      display.value = ""
      break
    case ".":
      if (isEmpty || !isTyping) {
        display.value = `0${decimalSeparator}`
      } else if (!containsDecimalSeparator) {
        display.value += decimalSeparator
      }
      isTyping = true
      display.classList.add("calc__display--blink")
      break
    case "+":
    case "-":
    case "*":
    case "/":
      executeOperation(action)
      break
  }
}

document.addEventListener("click", ({ target }) => {
  const { action } = target.dataset

  if (action) {
    if (!isNaN(action)) {
      handleNumericInput(action)
    } else {
      handleActionInput(action)
    }
  }
})
