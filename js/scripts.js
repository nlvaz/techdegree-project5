//FETCH FUNCTION
const url = 'https://randomuser.me/api/?results=12&nat=us';
fetch(url)
	.then(res => res.json())
	.then(data => {
		createGallery(data.results);
		displayModals(data.results);
		addSearchBar(data.results);
	})


//CREATE FUNCTIONS

//function to dynamically add cards to #gallery div
function createGallery(data) {
	const $gallery = $('#gallery');

	$.each(data, function (e){
		var itemHTML = `
		<div class="card">
			<div class="card-img-container">
				<img class="card-img" src=${this.picture.large} alt="profile picture">
			</div>
			<div class="card-info-container">
				<h3 id="name" class="card-name cap">${this.name.first} ${this.name.last}</h3>
				<p class="card-text">${this.email}</p>
				<p class="card-text cap">${this.location.city}, ${this.location.state}</p>
			</div>
		</div>
		`

		$gallery.append(itemHTML);
	});

}

//function to dynamically create modal of user passed to function
function createModal(clicked, prev, next, data) {
	const $HTMLBody = $('body');
	if($('.modal-container'))
		$('.modal-container').remove();

	const modalHTML = `<div class="modal-container">
		<div class="modal">
			<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
			<div class="modal-info-container">
				<img class="modal-img" src=${clicked.picture.large} alt="profile picture">
				<h3 id="name" class="modal-name cap">${clicked.name.first} ${clicked.name.last}</h3>
				<p class="modal-text">${clicked.email}</p>
				<p class="modal-text cap">${clicked.location.city}</p>
				<hr>
				<p class="modal-text">${clicked.phone}</p>
				<p class="modal-text cap">${clicked.location.street}, ${clicked.location.city}, ${clicked.location.state} ${clicked.location.postcode}</p>
				<p class="modal-text">Birthday: ${formatBDay(clicked.dob.date)}</p>
			</div>
		</div>

		<div class="modal-btn-container">
			<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
			<button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
	</div>
   `

	$(modalHTML).insertAfter('#gallery');
	closeModal();
	toggleModals(clicked, prev, next, data);
}


//SEARCH FUNCTIONS

//appends search html to search-container div and adds functionality through calling other functions
function addSearchBar(data) {
	const $searchDiv = $('.search-container');
	const $cards = $('#gallery').children();

	const searchHTML = `<form action="#" method="get">
    	<input type="search" id="search-input" class="search-input" placeholder="Search...">
		<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`

    $searchDiv.append(searchHTML);
    const $searchSubmit = $('#search-submit');
    const $searchInput = $('.search-input');

    $searchSubmit.on('click', (e) => {
		searchUsers($searchInput.val(), $cards, data);
	});

	$searchInput.on('input', (e) => {
		$.each($cards, (index, card) => {
			card.style.display = "flex";
		});

		if($('#gallery .error'))
			$('#gallery .error').remove();
	});
}

//receives a reference based on what is typed in search box and loops through data to obtain matchess, then loops through cards to hide what does not match
function searchUsers(ref, cards, data) {
	let matches = [];
	let count = 0;

	$.each(data, (index, user) => {
		if(user.name.first.includes(ref) || user.name.last.includes(ref))
			matches.push(cards[index]);
	});


	$.each(cards, (index, card) => {
		if(card !== matches[count] && count <= matches.length) {
			card.style.display = "none";
		} else if(card === matches[count]) {
			count++;
		}
	});

	if(matches.length === 0)
		$('#gallery').append('<h1 class="error font-effect-destruction">No Matches Found</h1>');
}


//HELPER FUNCTIONS

//function to display the modal clicked by the user by adding eventListeners to each
function displayModals(results) {
	const $cards = $('.card');

	$.each($cards, (index, currentCard) => {
		currentCard.addEventListener('click', () => {
			const clicked = results[index];
			let prev;
			let next;

			if(index != 0)
				prev = index-1;

			if(index < $cards.length - 1)
				next = index+1;

			createModal(clicked, prev, next, results);
		});
	});
}

//function to toggle between users
function toggleModals(clicked, prevIndex, nextIndex, data) {
	const prev = data[prevIndex];
	const next = data[nextIndex];
	const $prevButton = $('#modal-prev');
	const $nextButton = $('#modal-next');
	const $modalContainer = $('.modal-container');

	if(nextIndex === undefined || nextIndex === 12) {
		nextIndex = 12;
		$nextButton.prop('disabled', true);
		$nextButton.addClass('disabled');
	}

	if(prevIndex === undefined || prevIndex === -1) {
		prevIndex = -1;
		$prevButton.prop('disabled', true);
		$prevButton.addClass('disabled');
	}

	if(prev !== undefined){
		$prevButton.on('click', () => {
			$modalContainer.hide();
			createModal(prev, prevIndex-1, nextIndex-1, data);
		});
	}
	if(next !== undefined){
		$nextButton.on('click', () => {
			$modalContainer.hide();
			createModal(next, prevIndex+1, nextIndex+1, data);
		});
	}
}

//gives functionality to 'X' button on modal displayed
function closeModal() {
	const $openModal = $('.modal-container');
	const $closeButton = $('.modal-close-btn');

	$closeButton.click(e => {
		$openModal.hide();
	});
}

//function to format birthday of user passed and return it
function formatBDay(data) {
	let dob = data;
	let formattedDob;
	let birthYear;
	let birthMonth;
	let birthDay;

	dob = dob.replace(/T.*/, "")
	birthYear = dob.match(/[0-9]{4}/);
	birthMonth = dob.match(/[0-9]{2}/g)[2];
	birthDay = dob.match(/[0-9]{2}/g)[3];

	formattedDob = birthMonth + "/" + birthDay + "/" + birthYear;

	return formattedDob;
}

//some style changes
const titleH1 = $('.header-text-container').children()[0];

titleH1.classList.add('font-effect-fire-animation');