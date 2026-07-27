// Build a single Materialize "card" element for one recipe
const buildCard = (item) => {
  return (
    '<div class="col s12 m6 l4">' +
      '<div class="card medium">' +
        '<div class="card-image waves-effect waves-block waves-light">' +
          '<img class="activator" src="' + item.image + '">' +
          '<span class="card-title">' + item.title + '</span>' +
        '</div>' +
        '<div class="card-content">' +
          '<span class="chip category-chip">' + item.category + '</span>' +
          '<p>' + item.description + '</p>' +
        '</div>' +
        '<div class="card-reveal">' +
          '<span class="card-title grey-text text-darken-4">' + item.title +
            '<i class="material-icons right">close</i></span>' +
          '<p class="card-text">' + item.description + '</p>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
};

// Fetch recipes from our simple GET REST endpoint and render them as cards
const loadRecipes = () => {
  $.get('/api/recipes', (recipes) => {
    recipes.forEach((item) => {
      $('#card-section').append(buildCard(item));
    });
  }).fail(() => {
    $('#card-section').append(
      '<div class="col s12 center-align">' +
        '<p>Could not load recipes. Is the server running?</p>' +
      '</div>'
    );
  });
};

// Handle the "Suggest a Recipe" modal submit button
const submitRecipe = () => {
  let formData = {};
  formData.title = $('#recipe_title').val();
  formData.category = $('#recipe_category').val();
  formData.image = $('#recipe_image').val();
  formData.description = $('#recipe_description').val();

  console.log('Suggested recipe submitted: ', formData);

  // Add the newly suggested recipe straight to the page as a new card
  if (formData.title) {
    $('#card-section').append(buildCard(formData));
  }

  $('#modal1').modal('close');
};

$(document).ready(function () {
  $('.modal').modal();
  $('#formSubmit').click(() => {
    submitRecipe();
  });

  loadRecipes();
});
