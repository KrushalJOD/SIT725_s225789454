const addCards = (games) => {
  const grid = $('#gameGrid');
  grid.empty();

  games.forEach((game) => {
    const card = `
      <div class="col s12 m6 l4">
        <div class="card game-card">
          <div class="card-image">
            <img src="${game.coverImage}" onerror="this.src='https://placehold.co/400x250/9e9e9e/ffffff?text=No+Image'">
            <span class="card-title">${game.name}</span>
          </div>
          <div class="card-content">
            <span class="chip category-chip">${game.category}</span>
            <p>${game.summary}</p>
            <p><strong>Players:</strong> ${game.players} &nbsp; <strong>Duration:</strong> ${game.duration} min</p>
          </div>
        </div>
      </div>
    `;
    grid.append(card);
  });
};

const getGames = () => {
  $.get('/api/games', (response) => {
    if (response.statusCode === 200) {
      addCards(response.data);
    }
  });
};

const submitForm = () => {
  const newGame = {
    name: $('#name').val(),
    category: $('#category').val(),
    players: Number($('#players').val()),
    duration: Number($('#duration').val()),
    coverImage: $('#coverImage').val(),
    summary: $('#summary').val()
  };

  $.ajax({
    url: '/api/games',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(newGame),
    success: () => {
      getGames();
    },
    error: (xhr) => {
      alert('Could not save game: ' + xhr.responseJSON.message);
    }
  });
};

$(document).ready(function () {
  $('select').formSelect();
  $('.modal').modal();

  $('#formSubmit').click(() => {
    submitForm();
  });

  getGames();
});
