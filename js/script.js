const elForm = document.querySelector('.search__form');
let count = 10;

elForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const elInput = elForm.querySelector('.search__input');

  if (!formValidation(elInput)) return;

  fetch(`https://api.github.com/search/repositories?q=${elInput.value}&per_page=100`)
    .then((response) => {
      if (response.ok !== true) return;
      if (response.status !== 200) {
        alert(`${response.status} : ${response.statusText}`);
      } else {
        return response.json();
      }
    })
    .then(function (data) {
      const elButtonMore = document.querySelector('.repositories__btn');

      removeRepository();
      removeButtonMore(elButtonMore);

      if (data.items.length >= 10) {
        for (let i = 0; i < 10; i++) {
          addRepository(data, i);
        }
        addButtonMore();

        document.querySelector('.repositories__btn').addEventListener('click', function () {
          count += 10;
          if (count <= data.items.length) {
            for (let i = count - 10; i < count; i++) {
              addRepository(data, i);
            }
          } else {
            for (let i = count - 10; i < data.items.length; i++) {
              addRepository(data, i);
            }
            document.querySelector('.repositories__btn').remove();
          }
        });

        count = 10;

      } else if (data.items.length < 10 && data.items.length > 0) {
        for (let i = 0; i < data.items.length; i++) {
          addRepository(data, i);
        }
      } else {
        addNotFound();
      }
    })
});

function formValidation(input) {
  let result = true;

  removeError(input);
  if (input.value.length == 1) {
    removeError(input);
    createError(input, 'Недостаточно символов для поиска!');
    result = false;
  }

  input.oninput = () => {
    if (input.value !== "") {
      removeError(input);
    }
  }

  return result;
}

function createError(input, text) {
  const parent = input.parentNode;
  const errorLabel = document.createElement('label');

  errorLabel.classList.add('error-label');
  errorLabel.textContent = text;

  parent.classList.add('error');
  parent.append(errorLabel);
}

function removeError(input) {
  const parent = input.parentNode;

  if (parent.classList.contains('error')) {
    parent.querySelector('.error-label').remove()
    parent.classList.remove('error')
  }
}

function addRepository(data, index) {
  const ul = document.querySelector('.repositories__list');

  const li = document.createElement('li');
  li.classList.add('repositories__item');
  ul.append(li);

  const h2 = document.createElement('h2');
  h2.classList.add('repositories__heading');
  li.append(h2);

  const divInfo = document.createElement('div');
  divInfo.classList.add('repositories__info');
  li.append(divInfo);

  const linkHeading = document.createElement('a');
  linkHeading.classList.add('repositories__link-heading');
  linkHeading.setAttribute('target', '_blank');
  linkHeading.setAttribute('href', data.items[index].html_url);
  linkHeading.textContent = data.items[index].name;
  h2.append(linkHeading);

  const divFieldAutor = document.createElement('div'),
    divFieldDescription = document.createElement('div'),
    divFieldStars = document.createElement('div'),
    divFieldLanguage = document.createElement('div');
  divFieldAutor.classList.add('repositories__field');
  divFieldDescription.classList.add('repositories__field');
  divFieldStars.classList.add('repositories__field');
  divFieldLanguage.classList.add('repositories__field');
  divFieldAutor.textContent = 'Автор - ';
  divFieldDescription.textContent = 'Описание - ';
  divFieldStars.textContent = 'Количество звезд - ';
  divFieldLanguage.textContent = 'Язык - ';
  divInfo.append(divFieldAutor);
  divInfo.append(divFieldDescription);
  divInfo.append(divFieldStars);
  divInfo.append(divFieldLanguage);

  const linkAutor = document.createElement('a');
  linkAutor.classList.add('repositories__link-autor');
  linkAutor.setAttribute('target', '_blank');
  linkAutor.setAttribute('href', data.items[index].owner.html_url);
  linkAutor.textContent = data.items[index].owner.login;
  divFieldAutor.append(linkAutor);

  const spanDescription = document.createElement('span'),
    spanStars = document.createElement('span'),
    spanLanguage = document.createElement('span');
  spanDescription.style.fontSize = '14px';
  spanDescription.style.fontStyle = 'italic';
  spanDescription.textContent = data.items[index].description ? data.items[index].description : 'нет описания';
  spanStars.textContent = data.items[index].stargazers_count;
  spanLanguage.textContent = data.items[index].language ? data.items[index].language : 'не указан';
  divFieldDescription.append(spanDescription);
  divFieldStars.append(spanStars);
  divFieldLanguage.append(spanLanguage);

  return li;
}

function addButtonMore() {
  const buttonBox = document.querySelector('.repositories__btn-box');

  const buttonMore = document.createElement('button');
  buttonMore.classList.add('repositories__btn', 'btn');
  buttonMore.textContent = 'Показать ещё...';
  buttonBox.append(buttonMore);
}

function removeRepository() {
  const li = document.querySelectorAll('.repositories__item');

  li.forEach(item => {
    item.remove();
  });
}

function removeButtonMore(button) {
  if (button !== null) button.remove();
}

function addNotFound() {
  const ul = document.querySelector('.repositories__list');

  const li = document.createElement('li');
  li.classList.add('repositories__item', 'not-found');
  ul.append(li);

  const divText = document.createElement('div');
  divText.classList.add('not-found__text');
  divText.textContent = 'Ничего не найдено';
  li.append(divText);

}
