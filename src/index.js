import './styles.css';
import axios from 'axios';
import template from './templates/imageCard.hbs';
import errorNotification from './pnotify.js';


const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal`;
const key = `&key=15900106-2c235e732bb321ca7ec900d93`;
let page = 1;
const perPage = `&per_page=12`;

const searchForm = document.querySelector( `.search-form` )
const input = document.querySelector( `input` );
const ul = document.querySelector( `.gallery` );
const modalDiv = document.querySelector( `.lightbox` );
const modalDivButton = document.querySelector( `button[data-action="close-lightbox"]` );
const modalImg = document.querySelector( `.modal-img` );
const nextPicture = document.querySelector( `.add-more` );
let query = ``;

searchForm.addEventListener( `submit`, onSearch )

const targets = document.getElementsByClassName( 'modal-img' );

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
}

var loadImage = function ( entries, observer ) {
    if( page > 1 ) {
        page += 1;
        axios.get( `${url}${query}&page=${page}${perPage}${key}` )
            .then( ( resp ) => {
          
                const data = resp.data.hits;
                const mark = data.reduce( ( acc, el ) => acc + `<li class="image-card">${template( el )}</li>`, `` );
                ul.insertAdjacentHTML( `beforeend`, mark );
            } );
    }
};

const observer = new IntersectionObserver( loadImage, options );

targets.forEach( target => {
    observer.observe( target )
} )

nextPicture.addEventListener( `click`, addNewPictures );

//запрос картинок
function onSearch (event) {
    event.preventDefault();
    //очищаем при новом запросе
    ul.innerHTML = ``;
    //получаем картинки
    query = `&q=${input.value}`;
    nextPicture.style.visibility = `hidden`;
    axios.get( `${url}${query}&page=${page}${perPage}${key}` )
        .then( response => {
            const data = response.data.hits;
            if( data.length >= 1 ) {
                nextPicture.style.visibility = `visible`;
            }
            if( data.length < 11 ) {
                nextPicture.disabled = true;
            }
            if( data.length === 0 ) {
              errorNotification('No matches found. Try again.');
            }
            const markup = data.reduce( ( acc, el ) => acc + `<li class="image-card">${template( el )}</li>`, `` );
            ul.insertAdjacentHTML( `beforeend`, markup );
        } )
}

function addNewPictures () {
    page += 1;
    axios.get( `${url}${query}&page=${page}${perPage}${key}` )
        .then( ( resp ) => {
            const data = resp.data.hits;
            const mark = data.reduce( ( acc, el ) => acc + `<li class="image-card">${template( el )}</li>`, `` );
            ul.insertAdjacentHTML( `beforeend`, mark );
        } );
    nextPicture.removeAttribute( 'style' );
}

ul.addEventListener( `click`, event => {
    if( event.target.className === `gallery__image` ) {
        modalDiv.setAttribute( `class`, `lightbox__overlay` );
        modalDivButton.setAttribute( `class`, `lightbox__button` );
        modalImg.setAttribute( `src`, `${event.target.src}` );
    }
} )

modalDivButton.addEventListener( `click`, closeModalWindow );

document.addEventListener( `keyup`, event => {
    if( event.key === `Escape` ) {
        closeModalWindow();
    }
} );

modalDiv.addEventListener( `click`, ( event ) => {
    if( event.target != modalImg ) {
        closeModalWindow();
    }
} );

function closeModalWindow () {
    modalDiv.setAttribute( `class`, `` );
    modalDivButton.setAttribute( `class`, `invisible` );
    modalImg.setAttribute( `src`, `` );
};
