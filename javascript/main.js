var detailFormat =
`<td id="{film-id}" class="filmDetailPanel">
<div class="imageThumbnail">
    <img src="{thumbnail-link}" alt="{film-title}">
</div>
<div class="filmDetail">
    <h4>{film-title}</h4>
    <p>{rating} score ({rating-count} ratings)</p>
</div>
</td>`

var ps = {
    top250: null,
    currentPage : 0,
    moviesPerPage : 6,
    columnsPerPage : 2,
    selectedMoviesIdx : 0
}

$(document).ready(function(){
    var settings = {
        "url": "https://imdb-api.com/API/Top250Movies/k_6m7bcvdi",
        "method": "GET",
        "timeout": 0,
      };

      $('#gotoImdbPage').click(function(){
        window.open('https://www.imdb.com/title/' + ps.top250[ps.selectedMoviesIdx].id, '_blank');
      });

      $('.overlayDetail').click(function(){
          $(this).css({'display': 'none'});
      })
      $('#overlayDetailContent').click(function(event){
          event.stopPropagation();
      })
       
      $.ajax(settings).done(function (response) {
        ps.top250 = response.items;
        $('#contentPage h3').remove();
        updatePage(0);
        $('.navbutton').click(navigateTo);
        $('.navbutton-active').click(navigateTo);
      });
})

function parseFilmDetailid(filmDetailId){
    return parseInt(filmDetailId.replace("film", ""));
}

function filmDetailClick(){
    filmDetailId = $(this).attr('id');
    ps.selectedMoviesIdx = parseFilmDetailid(filmDetailId);
    film = ps.top250[ps.selectedMoviesIdx];

    var thumbnailLink = film.image.split('/');
    var posisiAt = thumbnailLink[thumbnailLink.length-1].lastIndexOf('@');
    thumbnailLink = 'https://www.imdb-api.com/images/384x528/' + thumbnailLink[thumbnailLink.length-1].substring(0, posisiAt) + '@._V1_Ratio0.6716_AL_.jpg';
    $('#overlayFilmImg img').attr({'src': thumbnailLink});

    $('#overlayFilmDetail h3').html(film.fullTitle);
    $('#overlayFilmDetail p').html('Rank: ' + film.rank + '<br>' + 
                                    film.crew + '<br><br>'
                                    + film.imDbRating + ' score from ' + film.imDbRatingCount + ' ratings');
    $('.overlayDetail').css({'display': 'block'});
}

function navigateTo(){
    if($(this).hasClass('navbutton-active')) return;

    $('.navbutton-active').addClass('navbutton');
    $('.navbutton-active').removeClass('navbutton-active');
    $(this).removeClass('navbutton');
    $(this).addClass('navbutton-active');
    
    ps.currentPage = parseInt($(this).text()) - 1;
    updatePage(ps.currentPage);
}

function updatePage(newPageNumber){
    $('#contentTable').empty();
    for(var i=0; i < ps.moviesPerPage; i += ps.columnsPerPage){
        var pageData = `<tr class="contentRow">`;
        for(var j=0; j < ps.columnsPerPage; j++){
            filmNumber = i + j + newPageNumber * ps.moviesPerPage;
            var film = ps.top250[filmNumber];
            //var thumbnailLink = film.image.replace("original", "384x528");
            var thumbnailLink = film.image.split('/');
            var posisiAt = thumbnailLink[thumbnailLink.length-1].lastIndexOf('@');
            thumbnailLink = 'https://www.imdb-api.com/images/192x264/' + thumbnailLink[thumbnailLink.length-1].substring(0, posisiAt) + '@._V1_Ratio0.6716_AL_.jpg';
            console.log(thumbnailLink);
            pageData += detailFormat.replace("{film-id}", "film" + filmNumber)
                                .replaceAll("{film-title}", film.fullTitle)
                                .replace("{rating}", film.imDbRating)
                                .replace("{rating-count}", film.imDbRatingCount)
                                .replace("{thumbnail-link}", thumbnailLink);
        }
        pageData += `</tr>`;
        $('#contentTable').append(pageData);
    }
    $('.filmDetailPanel').click(filmDetailClick)
}