let backupText = `The sun peeked over the quiet hills, painting the sky gold.
A small bird chirped, waking the sleepy village below.
Mia laced her boots, ready for her first adventure.
She tiptoed past her snoring dog, careful not to wake him.
Outside, the morning air was crisp and full of promise.
She followed a winding path into the whispering woods.
Suddenly, a squirrel darted across her path, making her laugh.
Deeper in the forest, she found a sparkling stream.
Mia skipped stones, watching ripples dance in the sunlight.
As the day ended, she returned home, heart full of wonder.`;

let testText = getStoryText();

const textArea = document.querySelector(".text-area");
const checkbox = document.querySelector("#checkbox");
const resetButton = document.querySelector("#reset");

let index = 0;
let delay = 0;
let lastIndex = 0;
let timeoutIds = [];
let animationIds = [];
let isRunning = false;
let text = "";
let speed = 0; // Default speed

document.addEventListener("keydown", (event) => {
	if (checkbox.checked) {
		return;
	}
	if (event.key === "Backspace") {
		if (text.length > 0) {
			text = text.slice(0, -1); // Remove last character
			textArea.innerHTML = text;
			textArea.scrollTop = textArea.scrollHeight; // Scroll to the bottom
		}
		index--;
		return;
	}
	showText(index);
	index++;
});

resetButton.addEventListener("click", async () => {
	text = ""; // Clear the text
	index = 0; // Reset index
	delay = 0; // Reset delay
	textArea.innerHTML = text;
	textArea.scrollTop = textArea.scrollHeight;
	getStoryText();
});

textArea.addEventListener("click", () => {
	if (!checkbox.checked) {
		return;
	}
	if (!isRunning) {
		requestAnimationFrame(generateText);
		isRunning = true;
	} else {
		isRunning = false;
		timeoutIds.forEach((id) => window.clearTimeout(id));
		timeoutIds = [];
		animationIds.forEach((id) => window.cancelAnimationFrame(id));
		animationIds = [];
		index = lastIndex + 1;
		lastIndex = null;
		delay = 0;
	}
});

function getCharacterToRender(textIndex) {
	if (typeof testText != "string") {
		return "";
	} // Fallback if testText is not available
	let char = testText.charAt(textIndex);
	return char;
}

function generateText() {
	index = index >= testText.length ? 0 : index; // Reset index if it exceeds text length
	timeoutIds.push(
		setTimeout(
			(testIndex) => {
				showText(testIndex);
			},
			delay * speed, // Adjust speed with multiplier
			index
		)
	);
	index++;
	delay++;
	animationIds.push(requestAnimationFrame(generateText));
}

function showText(testIndex) {
	if (!testText) {
		testText = backupText;
	} // Fallback if testText is not available
	testIndex = testIndex >= testText.length ? 0 : testIndex; // Reset index if it exceeds text length
	let char = getCharacterToRender(testIndex);
	let addLineBreak = Math.random() < 0.1; // 10% chance to add a line break
	if (addLineBreak && text.length > 0 && char == " ") {
		text += "<br>";
	}
	text += char;
	textArea.innerHTML = text;
	textArea.scrollTop = textArea.scrollHeight; // Scroll to the bottom
	lastIndex = testIndex;
}

async function getStoryText() {
	try {
		testText = await fetch("https://shortstories-api.onrender.com/");
	} catch (error) {
		console.error("Error fetching story text:", error);
		testText = backupText; // Fallback to backup text if fetch fails;
	}

	let json = await testText.json();

	testText = json.story;
	console.log(testText);
}
