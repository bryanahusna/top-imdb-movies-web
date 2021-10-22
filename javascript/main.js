var detailFormat =
`<td id="{film-id}">
<div class="imageThumbnail">
    <img src="{thumbnail-link}" alt="{film-title}">
</div>
<div class="filmDetail">
    <h4>{film-title}</h4>
    <p>{rating} star ({rating-count} ratings)</p>
</div>
</td>`

var top250;
var currentPage = 0;
var moviesPerPage = 6;
$(document).ready(function(){
    var settings = {
        "url": "https://imdb-api.com/API/Top250Movies/k_6m7bcvdi",
        "method": "GET",
        "timeout": 0,
      };
       
      $.ajax(settings).done(function (response) {
        top250 = response;
        initPopulateData();
        $('.navbutton').click(navigateTo);
        $('.navbutton-active').click(navigateTo);
      });
})

function initPopulateData(){
    $('#contentPage h3').remove();
    for(var i=0; i<6; i += 2){
        var pageData = `<tr class="contentRow">`;
        for(var j=0; j<2; j++){
            var film = top250.items[i+j];
            var thumbnailLink = film.image.replace("original", "200x300");
            pageData += detailFormat.replace("{film-id}", film.id)
                                .replaceAll("{film-title}", film.fullTitle)
                                .replace("{rating}", film.imDbRating)
                                .replace("{rating-count}", film.imDbRatingCount)
                                .replace("{thumbnail-link}", thumbnailLink);
        }
        pageData += `</tr>`;
        $('#contentTable').append(pageData);
    }
}

function navigateTo(){
    if($(this).hasClass('navbutton-active')) return;

    $('.navbutton-active').addClass('navbutton');
    $('.navbutton-active').removeClass('navbutton-active');
    $(this).removeClass('navbutton');
    $(this).addClass('navbutton-active');
    
    currentPage = parseInt($(this).text()) - 1;
    updatePage(currentPage);
}

function updatePage(newPageNumber){
    $('#contentTable').empty();
    for(var i=0; i<6; i += 2){
        var pageData = `<tr class="contentRow">`;
        for(var j=0; j<2; j++){
            var film = top250.items[i + j + newPageNumber*moviesPerPage];
            var thumbnailLink = film.image.replace("original", "200x300");
            pageData += detailFormat.replace("{film-id}", film.id)
                                .replaceAll("{film-title}", film.fullTitle)
                                .replace("{rating}", film.imDbRating)
                                .replace("{rating-count}", film.imDbRatingCount)
                                .replace("{thumbnail-link}", thumbnailLink);
        }
        pageData += `</tr>`;
        $('#contentTable').append(pageData);
    }
}