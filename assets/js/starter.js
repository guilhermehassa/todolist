// Importing JavaScript
//
// You have two choices for including Bootstrap's JS files—the whole thing,
// or just the bits that you need.


// Option 1
//
// Import Bootstrap's bundle (all of Bootstrap's JS + Popper.js dependency)

// import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";


// Option 2
//
// Import just what we need

// If you're importing tooltips or popovers, be sure to include our Popper.js dependency
// import "../../node_modules/popper.js/dist/popper.min.js";

import "../../node_modules/bootstrap/js/dist/util.js";
import "../../node_modules/bootstrap/js/dist/modal.js";

// HELP PARA CONTRATAÇÃO 😉
if (!localStorage.getItem('listData')) {
  let defaultItems = [
    {
      id: 1,
      value: 'Localizar um excelente Front End',
      status: 'done'
    },
    {
      id: 2,
      value: 'Solicitar testes',
      status: 'done'
    },
    {
      id: 3,
      value: 'Entrevista ',
      status: 'todo'
    },
    {
      id: 4,
      value: '🎉 Contratar Guilherme Hassã para vaga de Front End na e.Mix ',
      status: 'todo'
    },

  ];

  localStorage.setItem('listData', JSON.stringify(defaultItems));
}

//VARIÁVEIS GERAIS
  const popup = document.querySelector('.popup');
  const coverPage = document.querySelector('.coverPage');
  const form = document.querySelector('#todo_form');
  const inputForm = form.querySelector('#todo_input');
  const buttonForm = form.querySelector('#todo_button');

  let todolist = document.querySelector('#todolist');
  let donelist = document.querySelector('#donelist');


// FUNÇÕES DE POPUP
  function closePopup(){
    popup.classList.remove('active');
    coverPage.classList.remove('active');
  }
  window.closePopup = closePopup;

  function setPopupContent(title,description,button=''){

    let titleContent = popup.querySelector('.title');
    let descriptionContent = popup.querySelector('P');
    let buttonsContent = popup.querySelector('.popup_buttons');

    titleContent.textContent=title;
    descriptionContent.textContent = description;

    buttonsContent.firstElementChild.classList.add('d-none');
    buttonsContent.classList.add('justify-content-end')
    buttonsContent.lastElementChild.textContent = 'OK';
    buttonsContent.lastElementChild.setAttribute('onclick','closePopup()')
    buttonsContent.firstElementChild.classList.add('d-none');

    if(button){
      buttonsContent.classList.remove('justify-content-end')
      buttonsContent.lastElementChild.textContent = 'CONFIRMAR';
      buttonsContent.firstElementChild.classList.remove('d-none');
      buttonsContent.lastElementChild.setAttribute('onclick',button)
    }

    coverPage.classList.add('active')
    popup.classList.add('active')
  }

//FUNÇÕES DE ADIÇÃO DE ITENS
  function addInTodolist(value, id=''){
    if(id==''){
      id = Date.now();
    }
    value = sanitizeInput(value);
    const newItem = `
      <li id="${id}" class="closing">
        <div>
          <label class="custom_checkbox" for="checkbox-${id}">
            <input type="checkbox" id="checkbox-${id}">
            <span class="checkmark"></span>
          </label>
        </div>
        <input type="text" id="value" value="${value}" maxlength="90" disabled>
        <button id="edit">
          <i class="fa-solid fa-pen" id="edit"></i>
        </button>
        <button id="save">
          <i class="fa-sharp fa-solid fa-floppy-disk" id="save"></i>
        </button>
        <button id="delete">
          <i class="fa-solid fa-trash" id="delete"></i>
        </button>
      </li>
    `;
    todolist.innerHTML += newItem;

    //INSERE ITEM NO LOCALSTORAGE
    let listData = JSON.parse(localStorage.getItem('listData')) || [];
    let foundItem = listData.find(listItem => listItem.id == id);
    if (foundItem) {
      foundItem.status = 'todo';
    }
    else{
      listData.push({ id: id, value: value, status:'todo' });
    }
    localStorage.setItem('listData', JSON.stringify(listData));

    let item=document.getElementById(id);
    setTimeout(() => {
      item.classList.remove('closing');
    }, 50);

  }
  function addInDonelist(id,value){
    const newItem = `
      <li id="${id}" class="closing">
        <div>
          <label class="custom_checkbox" for="checkbox-${id}">
            <input type="checkbox" id="checkbox-${id}" checked>
            <span class="checkmark"></span>
          </label>
        </div>
        <input type="text" id="value" value="${value}" disabled>
        <button id="delete">
          <i class="fa-solid fa-trash" id="delete"></i>
        </button>
      </li>
    `;

    donelist.innerHTML += newItem;

    // EDITA O ITEM NO LOCALSTORAGE
    let listData = JSON.parse(localStorage.getItem('listData')) || [];
    let foundItem = listData.find(listItem => listItem.id == id);
    if (foundItem) {
      foundItem.status = 'done';
      localStorage.setItem('listData', JSON.stringify(listData));
    }

    let thisItem = document.querySelectorAll("[id='"+id+"']");
    setTimeout(() => {
      thisItem[1].classList.remove('closing')
    }, 50);
  }

//FUNÇÕES PARA INICIAR INSERÇÃO DE ITEM
  function sanitizeInput(input) {
    let sanitizedInput = input.replace(/<\/?[^>]+(>|$)/g, '');
    sanitizedInput = sanitizedInput.replace(/[&<>"'`=\/]/g, '');

    return sanitizedInput;
  }

  //EVITA A SUBMISSÃO PADRÃO DO FORM COM ENTER E ATIVA A FUNÇÃO PRA INSERÇÃO DO ITEM
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      event.preventDefault();
      startInput();
    }
  });

  function cleanInput(){
    inputForm.value='';
  }
  function startInput(){
    if(inputForm.value!=''){
      addInTodolist(inputForm.value);
      cleanInput();
    }
    else{
      setPopupContent('Campo Vazio','Insira algum conteúdo para adicionar uma tarefa');
    }
  }
  buttonForm.addEventListener('click',function(e){
    startInput()
  })



// AÇÕES DOS ITENS LISTADOS
  function deleteItem(id){
    let deletableItem=document.getElementById(id);

    if(deletableItem){
      deletableItem.classList.add('closing');
      setTimeout(() => {
        deletableItem.remove();

        let listData = JSON.parse(localStorage.getItem('listData')) || [];
        listData = listData.filter(item => item.id !== id);
        localStorage.setItem('listData', JSON.stringify(listData));
      }, 300);

    }
    closePopup();
  }
  window.deleteItem = deleteItem;

  function enableEditItem(id){
    let item=document.getElementById(id);

    item.classList.add('editing');

    item.querySelector('#value').removeAttribute('disabled')
  }

  function saveEditItem(id){
    let item=document.getElementById(id);

    let input = item.querySelector('#value');

    let listData = JSON.parse(localStorage.getItem('listData')) || [];
    let foundItem = listData.find(listItens => listItens.id == id);

    if (foundItem) {
      foundItem.value = sanitizeInput(input.value);
      localStorage.setItem('listData', JSON.stringify(listData));
    }

    input.setAttribute('disabled',true);
    item.classList.remove('editing');
  }

//LISTENER DAS LISTAS
  todolist.addEventListener('click',function(e){
    let liElement = e.target.closest('li');
    let id = liElement.id;
    let value = liElement.querySelector('#value').value;

    let clicked = e.target;

    if(clicked.nodeName == 'BUTTON' || clicked.nodeName == 'I'){
      if(clicked.id=='delete'){
        setPopupContent('Confirma a exclusão do item abaixo?',value,'deleteItem('+id+')')
      }
      else if(clicked.id=='edit'){
        enableEditItem(id);
      }
      else if(clicked.id=='save'){
        saveEditItem(id);
      }
    }

    else if(clicked.id.includes('checkbox')){
      deleteItem(id);
      addInDonelist(id,value);
    }
  });

  donelist.addEventListener('click',function(e){
    let liElement = e.target.closest('li');
    let id = liElement.id;
    let value = liElement.querySelector('#value').value;

    let clicked = e.target;

    if(clicked.nodeName == 'BUTTON' || clicked.nodeName == 'I'){
      if(clicked.id=='delete'){
        setPopupContent('Confirma a exclusão do item abaixo?',value,'deleteItem('+id+')')
      }
    }

    else if(clicked.id.includes('checkbox')){
      deleteItem(id);
      addInTodolist(value,id);
    }
  });

//FUNÇÕES PARA LISTAR OS ITENS AO ABRIR A PÁGINA
  function loadTodoListItems(containerId) {
    const container = document.getElementById(containerId);
    const listData = JSON.parse(localStorage.getItem('listData')) || [];
    listData.forEach(item => {
      if(item.status == 'todo'){
        const newItem = `
          <li id="${item.id}">
            <div>
              <label class="custom_checkbox" for="checkbox-${item.id}">
                <input type="checkbox" id="checkbox-${item.id}">
                <span class="checkmark"></span>
              </label>
            </div>
            <input type="text" id="value" value="${item.value}" maxlength="90" disabled>
            <button id="edit">
              <i class="fa-solid fa-pen" id="edit"></i>
            </button>
            <button id="save">
              <i class="fa-sharp fa-solid fa-floppy-disk" id="save"></i>
            </button>
            <button id="delete">
              <i class="fa-solid fa-trash" id="delete"></i>
            </button>
          </li>
        `;
        container.innerHTML += newItem;
      }
    });
  }

  function loadDoneListItems(containerId) {
    const container = document.getElementById(containerId);
    const listData = JSON.parse(localStorage.getItem('listData')) || [];
    listData.forEach(item => {
      if(item.status == 'done'){
        const newItem = `
          <li id="${item.id}">
            <div>
              <label class="custom_checkbox" for="checkbox-${item.id}">
                <input type="checkbox" id="checkbox-${item.id}" checked>
                <span class="checkmark"></span>
              </label>
            </div>
            <input type="text" id="value" value="${item.value}" disabled>
            <button id="delete">
              <i class="fa-solid fa-trash" id="delete"></i>
            </button>
          </li>
        `;
        container.innerHTML += newItem;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadTodoListItems('todolist');
    loadDoneListItems('donelist');
  });
