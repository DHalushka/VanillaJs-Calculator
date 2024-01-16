import "./styles.css";
let displayValue = "";
const maxLength = 8;

function appendToDisplay(value) {
	if (value.type === "click") {
		value = value.target.value;
	}
	if (displayValue.length < maxLength) {
		displayValue += value;
		document.getElementById("display").value = displayValue;
	}
}

function clearDisplay() {
	displayValue = "";
	document.getElementById("display").value = "0";
}

function calculate() {
	try {
		displayValue = roundNumber(evaluateExpression(displayValue), 8).toString();
		document.getElementById("display").value = displayValue;
	} catch (error) {
		document.getElementById("display").value = "Error";
	}
}

function negate() {
	if (displayValue !== "" && displayValue !== "Error") {
		displayValue = roundNumber(parseFloat(displayValue) * -1, 8).toString();
		document.getElementById("display").value = displayValue;
	}
}

function percentage() {
	if (displayValue !== "" && displayValue !== "Error") {
		try {
			const lastNumberIndex = displayValue.search(/[0-9]+[^0-9]*$/);
			const lastNumber = displayValue.substring(lastNumberIndex);
			const percentageValue = roundNumber(parseFloat(lastNumber) / 100, 8);

			displayValue =
				displayValue.substring(0, lastNumberIndex) + percentageValue;

			document.getElementById("display").value = displayValue;
		} catch (error) {
			document.getElementById("display").value = "Error";
		}
	}
	calculate();
}

function roundNumber(number, precision) {
	const multiplier = 10 ** precision;
	return Math.round(number * multiplier) / multiplier;
}
//event listeners
document.getElementById("clearDisplay").addEventListener("click", clearDisplay);
document.getElementById("calculate").addEventListener("click", calculate);
document.getElementById("negate").addEventListener("click", negate);
document.getElementById("percentage").addEventListener("click", percentage);

document.querySelectorAll(".operate").forEach((element) => {
	element.addEventListener("click", appendToDisplay);
});

function evaluateExpression(expression) {
	// Ensure the expression starts with '0'
	if (!expression.startsWith("0")) {
		expression = "0" + expression;
	}

	const operators = ["+", "-", "*", "/"];
	const parts = expression.match(/(\d+(\.\d+)?|[+\-*/.])/g) || [];

	// Handle unary minus
	for (let i = 0; i < parts.length; i++) {
		if (parts[i] === "-") {
			// Check if the minus is unary or binary
			const prevToken = i === 0 ? null : parts[i - 1];
			if (prevToken === null || operators.includes(prevToken)) {
				// Unary minus
				parts.splice(i, 2, (-parseFloat(parts[i + 1])).toString());
			}
		}
	}

	// Handle multiplication and division first
	for (let i = 0; i < parts.length; i++) {
		if (parts[i] === "*" || parts[i] === "/") {
			const operand1 = parseFloat(parts[i - 1]);
			const operand2 = parseFloat(parts[i + 1]);

			if (isNaN(operand1) || isNaN(operand2)) {
				throw new Error("Invalid operand");
			}

			switch (parts[i]) {
				case "*":
					parts.splice(i - 1, 3, (operand1 * operand2).toString());
					i = 0; // Reset the outer loop
					break;
				case "/":
					if (operand2 === 0) {
						throw new Error("Division by zero");
					}
					parts.splice(i - 1, 3, (operand1 / operand2).toString());
					i = 0; // Reset the outer loop
					break;
			}
		}
	}

	// Handle addition and subtraction
	for (let i = 0; i < parts.length; i++) {
		if (parts[i] === "+" || parts[i] === "-") {
			const operand1 = parseFloat(parts[i - 1]);
			const operand2 = parseFloat(parts[i + 1]);

			if (isNaN(operand1) || isNaN(operand2)) {
				throw new Error("Invalid operand");
			}

			switch (parts[i]) {
				case "+":
					parts.splice(i - 1, 3, (operand1 + operand2).toString());
					i = 0; // Reset the outer loop
					break;
				case "-":
					parts.splice(i - 1, 3, (operand1 - operand2).toString());
					i = 0; // Reset the outer loop
					break;
			}
		}
	}

	return parts[0];
}

// Handle keyboard input
document.addEventListener("keydown", function (event) {
	const key = event.key;

	// Allow certain keys without preventing the default behavior
	if (/[0-9+\-*/.%]/.test(key)) {
		handleKey(key);
	} else {
		// Prevent default for all other keys to avoid unwanted behavior
		event.preventDefault();

		// Handle specific keys
		if (key === "Enter") {
			handleKey("=");
		} else if (key === "c" || key === "Escape") {
			clearDisplay();
		}
	}
});

function handleKey(key) {
	if (key === "=") {
		calculate();
	} else if (key === "+/-") {
		negate();
	} else if (key === "%") {
		percentage();
	} else {
		appendToDisplay(key);
	}
}

// THEME
const theme = document.querySelector("#theme");
const themeModal = document.querySelector(".customise-theme");
const root = document.querySelector(":root");
const colorPalete = document.querySelectorAll(".choose-color span");
const bg1 = document.querySelector(".bg-1");
const bg2 = document.querySelector(".bg-2");
const bg3 = document.querySelector(".bg-3");

const openThemeModal = () => {
	themeModal.style.display = "grid";
};
const closeThemeModal = (e) => {
	if (e.target.classList.contains("customise-theme")) {
		themeModal.style.display = "none";
	}
};

theme.addEventListener("click", openThemeModal);
themeModal.addEventListener("click", closeThemeModal);

/** -------------------- ACCENT COLOR ------------------- */

//remove active class from colors
const changeActiveColorClass = () => {
	colorPalete.forEach((colorPicker) => {
		colorPicker.classList.remove("active");
	});
};

colorPalete.forEach((color) => {
	color.addEventListener("click", () => {
		let accentColor;
		//remove active class from all colors
		changeActiveColorClass();

		if (color.classList.contains("color-1")) {
			accentColor = "rgb(255, 55, 10)";
		} else if (color.classList.contains("color-2")) {
			accentColor = "rgb(255, 155, 10)";
		} else if (color.classList.contains("color-3")) {
			accentColor = " rgb(55, 100, 155)";
		}
		color.classList.add("active");

		root.style.setProperty("--accent-color", accentColor);
	});
});

/** --------------------- BACKGROUND -------------------- */

let numbersColor;
let operationsdColor;
let backgroundColor;
let fontColor;

const changeBg = () => {
	root.style.setProperty("--numbers-color", numbersColor);
	root.style.setProperty("--operations-color", operationsdColor);
	root.style.setProperty("--background-color", backgroundColor);
	root.style.setProperty("--font-color", fontColor);
};

bg2.addEventListener("click", () => {
	// add active class
	bg2.classList.add("active");
	// remove active class from others
	bg1.classList.remove("active");
	bg3.classList.remove("active");
	//remove customized changes from local storage
	window.location.reload();
});
bg1.addEventListener("click", () => {
	numbersColor = "rgb(255, 255, 255)";
	operationsdColor = "rgb(218, 218, 218)";
	backgroundColor = "rgb(180, 180, 180)";
	fontColor = "#000";
	// add active class
	bg1.classList.add("active");
	// remove active class from others
	bg2.classList.remove("active");
	bg3.classList.remove("active");
	changeBg();
});
bg3.addEventListener("click", () => {
	numbersColor = "rgb(40, 40, 40)";
	operationsdColor = "rgb(36, 36, 36)";
	backgroundColor = "rgb(25, 25, 25)";
	fontColor = "#fff";
	// add active class
	bg3.classList.add("active");
	// remove active class from others
	bg1.classList.remove("active");
	bg2.classList.remove("active");
	changeBg();
});
