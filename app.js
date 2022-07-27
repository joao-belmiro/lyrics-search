const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const prevAndNextContainer = document.querySelector("#prev-and-next-container");
const permissionInfo = document.getElementById("permission-info");

const baseUrl = `https://api.lyrics.ovh`;

const fetchData = async url => {
  let data = await fetch(`https://cors-anywhere.herokuapp.com/${url}`).then((response) => response.json());
  return data;
}
 
const getMoreSongs = async (url) => {
  let data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
  insertSongsIntoPage(data);
};

const insertSongsIntoPage = (songs) => {
  songsContainer.innerHTML = songs.data
    .map(
      (song) =>
        `<li class="song">
          <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
          <button class="btn" data-artist-link="${song.artist.link}" data-album-title="${song.album.title}"  data-album-image="${song.album.cover_medium}" data-preview="${song.preview}" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
        </li>`
    )
    .join("");

  if (songs.prev || songs.next) {
    prevAndNextContainer.innerHTML = `${
      songs.prev
        ? `<button class="btn" onclick="getMoreSongs('${songs.prev}')">Anteriores</button>`
        : ``
    }
        ${
          songs.next
            ? `<button class="btn" onclick="getMoreSongs('${songs.next}')">Próximas</button>`
            : ``
        }`;
    return;
  }

  prevAndNextContainer.innerHTML = "";
};
const fetchSongs = async (term) => {
  let data = await fetchData(`${baseUrl}/suggest/${term}`);
  insertSongsIntoPage(data);
  permissionInfo.style.display= 'none';

};
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido </li>`;
    return;
  }

  fetchSongs(searchTerm);
});
const fetchLyrics = async (artist, songTitle, albumImage, albumTitle, previewMusic,artistLink) => {
  let data = await fetchData(`${baseUrl}/v1/${artist}/${songTitle}`);
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>');
  songsContainer.innerHTML = `
    <li class="song-header">
      <img src="${albumImage}" alt="capa do album"/>
      <div class="song-title">
        <h1>${artist}</h1>
        <br>
        <h2>${albumTitle}</h2>
        <br>
        <h2><strong>${songTitle}</strong></h2>
        <br>
        <br>
        <br>
        <br>
        <br>
        <a class="artist-link" href="${artistLink}" target="_blank">ver artista</a>
      </div>
    </li>
    <video class="music-preview" controls name="media">
      <source src="${previewMusic}" type="audio/mpeg">
    </video>
    <li class="lyrics-container">
      <p class="lyrics">${lyrics}</p>
    </li>`
}

songsContainer.addEventListener('click', event => {
  const clickedElement = event.target;
  if (clickedElement.tagName === 'BUTTON') {
    const artist = clickedElement.getAttribute('data-artist');
    const songTitle = clickedElement.getAttribute('data-song-title');
    const albumTitle = clickedElement.getAttribute('data-album-title');
    const albumImage = clickedElement.getAttribute('data-album-image');
    const preveiew = clickedElement.getAttribute('data-preview');
    const artistLink = clickedElement.getAttribute('data-artist-link');

    prevAndNextContainer.innerHTML = ''

    fetchLyrics(artist, songTitle, albumImage, albumTitle, preveiew, artistLink);
  }
});

