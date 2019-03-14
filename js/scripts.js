//global variables
const url = 'https://randomuser.me/api/?results=12&nat=us';

fetch(url)
	.then(res => res.json())
	.then(data => console.log(data.results))