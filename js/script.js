const defaultLanguage = "en-US"
const userLanguage =
  navigator.language || navigator.userLanguage || defaultLanguage

const LOCALE = {
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
  LOCALE[language] || LOCALE[defaultLanguage]

const formatDisplayValue = (value, decimalSeparator, thousandSeparator) => {
  const [integerInString, decimal] = value.split(decimalSeparator)
  const integer = integerInString.replaceAll(thousandSeparator, "")
  const formattedNumber = Number(integer).toLocaleString("pt-BR")

  return decimal
    ? `${formattedNumber}${decimalSeparator}${decimal}`
    : formattedNumber
}

document.addEventListener("click", ({ target }) => {
  const display = document.querySelector("#display")
  const { decimalSeparator, thousandSeparator } =
    getLocaleSettings(userLanguage)
  const containsDecimalSeparator = display.value.includes(decimalSeparator)
  const isEmpty = !display.value
  let { action } = target.dataset

  if (action) {
    if (!isNaN(action)) {
      if (!display.getAttribute("placeholder")) return

      if (
        !containsDecimalSeparator &&
        action === "0" &&
        Number(display.value) <= 0
      ) {
        action = ""
      }

      display.value += action
      display.value = formatDisplayValue(
        display.value,
        decimalSeparator,
        thousandSeparator
      )
    } else {
      switch (action) {
        case "on-ce":
          display.setAttribute("placeholder", 0)
          break
        case "off":
          display.value = ""
          display.removeAttribute("placeholder")
          break
        case ".":
          if (!containsDecimalSeparator)
            display.value += isEmpty ? `0${decimalSeparator}` : decimalSeparator
          break
      }
    }
  }
})
