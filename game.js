/** @type {NodeListOf<HTMLImageElement>} */
const moles = document.querySelectorAll(".mole")
/** @type {HTMLDivElement} */
const worm = document.querySelector(".worm")
/** @type {HTMLElement} */
const playground = document.querySelector(".playground")
let score = 0

/**
 * Makes a mole leave
 * @param {HTMLImageElement} mole The mole that will leave
 * @param {boolean} king Whether the mole is a king or not
 * @param {number} nextTime The time the mole will leave
 */
function leaveMole(mole, king, nextTime) {
	if (Date.now() > nextTime) {
		// Make mole leave
		mole.classList.remove("show")
	}
	else requestAnimationFrame(() => leaveMole(mole, king, nextTime))
}

/**
 * Makes a mole turn around
 * @param {HTMLImageElement} mole The mole that will turn around
 * @param {boolean} king Whether the mole is a king or not
 * @param {number} nextTime The time the mole will turn around
 */
function turnAroundMole(mole, king, nextTime) {
	if (Date.now() > nextTime) {
		// Make mole turn around
		mole.src = king ? "./images/king-mole-leaving.png" : "./images/mole-leaving.png"

		// Remove fed class
		mole.classList.remove("fed")

		// Make mole leave after .5s
		requestAnimationFrame(() => leaveMole(mole, king, Date.now() + 500))
	}
	else requestAnimationFrame(() => turnAroundMole(mole, king, nextTime))
}

/**
 * Makes a mole sad
 * @param {HTMLImageElement} mole The mole that will be sad
 * @param {boolean} king Whether the mole is a king or not
 * @param {number} nextTime The time the mole will be sad
 * @param {() => any} onClick Event listener that is applied to the mole
 */
function sadMole(mole, king, nextTime, onClick) {
	if (Date.now() > nextTime) {
		// Make mole sad
		mole.src = king ? "./images/king-mole-sad.png" : "./images/mole-sad.png"

		// Remove event listener
		mole.removeEventListener("click", onClick)

		// Not hungry anymore
		mole.classList.remove("hungry")

		// Make mole turn around after .5s
		requestAnimationFrame(() => turnAroundMole(mole, king, Date.now() + 500))
	}
	else if (!mole.classList.contains("fed")) requestAnimationFrame(() => sadMole(mole, king, nextTime, onClick))
}

/**
 * Execute when a mole is clicked on
 * @param {HTMLImageElement} mole The mole that has been clicked
 * @param {boolean} king Whether the mole is a king or not
 * @param {() => any} onClick Event listener that is applied to the mole
 */
function clickMole(mole, king, onClick) {
	// Make mole fed
	mole.src = king ? "./images/king-mole-fed.png" : "./images/mole-fed.png"

	// Add score
	score += king ? 2 : 1
	worm.style.width = score * 10 + "%"

	// Win
	if (score >= 10) {
		playground.innerHTML = "<img src='./images/win.png' alt='win'>"
		playground.style.width = "1080px"
	}

	// Remove event
	mole.removeEventListener("click", onClick)

	// Cancel sad animation
	mole.classList.add("fed")

	// Not hungry anymore
	mole.classList.remove("hungry")

	// Make mole turn around after .5s
	requestAnimationFrame(() => turnAroundMole(mole, king, Date.now() + 500))
}

let nextTime = Date.now()
function selectMole() {
	// Do action
	if (Date.now() > nextTime) {
		// A random time from 0.2s to 3s
		nextTime = Date.now() + (Math.random() * 3000) + 200

		// Select a random mole
		const mole = moles[Math.floor(Math.random() * 10)]

		// 5% chance for it to be a king
		const king = Math.random() > .95

		// Show mole
		mole.src = king ? "./images/king-mole-hungry.png" : "./images/mole-hungry.png"
		mole.classList.add("show")

		// Mole is hungry
		mole.classList.add("hungry")

		// Add event on mole
		const onClick = () => clickMole(mole, king, onClick)
		mole.addEventListener("click", onClick)
		// Make mole sad after 1s to 3s
		requestAnimationFrame(() => sadMole(mole, king, Date.now() + (Math.random() * 2000) + 1000, onClick))
	}
	// Select next mole
	if (score < 10) requestAnimationFrame(selectMole)
}

// Select first mole
selectMole()