//global variables
const url = 'https://randomuser.me/api/?results=12&nat=us';



//fetch functions
fetch(url)
	.then(res => res.json())
	.then(data => {
		createGallery(data.results);
		displayModals(data.results);
	})


//create functions
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

function createModal(clicked, data) {
	const HTMLBody = $('body');
	if($('.modal-container'))
		$('.modal-container').remove();

	var modalHTML = `<div class="modal-container">
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
	</div>
   `

	$(modalHTML).insertAfter('#gallery');
	closeModal();
}


//helper functions
function displayModals(results) {
	const cards = $('.card');

	$.each(cards, (index, currentCard) => {
		currentCard.addEventListener('click', () => {
			const clicked = results[index];
			createModal(clicked, results);
		});
	});
}

function closeModal() {
	var openModal = $('.modal-container');
	var closeButton = $('.modal-close-btn');

	closeButton.click(e => {
			openModal.hide();
	});
}

function formatBDay(data) {
	var dob = data;
	var formattedDob;
	var birthYear;
	var birthMonth;
	var birthDay;

	dob = dob.replace(/T.*/, "")
	console.log(dob);
	birthYear = dob.match(/[0-9]{4}/);
	birthMonth = dob.match(/[0-9]{2}/g)[2];
	birthDay = dob.match(/[0-9]{2}/g)[3];

	formattedDob = birthMonth + "/" + birthDay + "/" + birthYear;

	return formattedDob;
}
