import axios from 'axios'
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import "simplelightbox/dist/simple-lightbox.min.css"
import SimpleLightbox from "simplelightbox"

var lightbox = new SimpleLightbox('.gallery a');

const API_KEY = '32077204-5e26fe343192f5bf28aa1a8c1'
const itemsPerPage = 150
let totalHits = null
let numberOfPages = null
let query = null
let currentPage = 1
const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    btn: document.querySelector('.load-more')
}

const formHeight = refs.form.getBoundingClientRect().height
//console.log(formHeight);
refs.gallery.style.paddingTop = `${formHeight}px`

refs.form.addEventListener('submit', onFormSubmit)
refs.btn.addEventListener('click', onBtnClick)

function onBtnClick() {
    currentPage += 1

    console.log(currentPage);
    getImg(query)

    numberOfPages = Math.floor(totalHits / itemsPerPage)

    if (currentPage === numberOfPages + 1) {
         Notify.failure("We're sorry, but you've reached the end of search results.")
        refs.btn.classList. add('is-hidden')
    }
    console.log(numberOfPages);
}

function onFormSubmit(e) {
    e.preventDefault()
    query = e.currentTarget.elements.searchQuery.value
    currentPage = 1
    //console.log(currentPage);
    getImg(query)
    e.target.reset()
    refs.gallery.innerHTML = ''
    refs.btn.classList.remove('is-hidden')
}

async function getImg (query) {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${itemsPerPage}` 
    
   await axios.get(url)
        .then(function (response) {
            if (response.data.total === 0) {
             return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            }
            console.log(response.data );
            totalHits = response.data.totalHits
            return response.data
        })
        .then(({ hits }) => {
            makeRender(hits)
            lightbox.refresh()
            console.log(hits);
            
        })
            .catch(function (error) {
            console.log(error);
    })
}

function makeRender(arr) {
     arr.forEach(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
     {
    const renderEl = 
        `<a href="${largeImageURL}">
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
        <b>Likes: <br> ${likes}</b>
        </p>
        <p class="info-item">
        <b>Views: <br> ${views}</b>
        </p>
        <p class="info-item">
        <b>Comments: <br> ${comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads: <br> ${downloads}</b>
        </p>
        </div>
        </div>
         </a>`
         refs.gallery.insertAdjacentHTML('beforeend', renderEl)
     })
            
}


