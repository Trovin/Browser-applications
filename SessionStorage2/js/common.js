function Form(form) {
    //on init
    function init() {
      settingForm();
    };
    init();


    //init variables
    var currentForm, field, currentValue, currentObj, currentsWrapper, performedsWrapper, getStorage, currentParent;
    var i = 0; //init increment
    currentTasks = [];
    performedTasks = [];

    //setting form
    function settingForm() {
      setForm();
      onSubmit();
    };


    function setForm() {
      if( !document.getElementById(form.id) && document.getElementById(form.id) == null ) {
        throw new Error('Error form id');
      } else currentForm = document.getElementById(form.id);
    };


    function onSubmit() {
      currentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        i++; //submit increment
        Service(); 
      }, false);  
    };


    //init service
    function Service() {
      viewService = new ViewService();
      //call service methods
      viewService.createData();
      viewService.saveData();
      viewService.createTaskWrapper();
      
      viewService.currentTaskAction();
      viewService.performedTaskAction();
      viewService.deleteTaskAction();

      viewService.createCurrentBlock();
      viewService.appendCreatedData();
    };


    function ViewService() {
      currentsWrapper = document.getElementById('current-tasks');
      performedsWrapper = document.getElementById('performed-tasks');

      this.createData = function() {
        field = currentForm.querySelector('textarea[name="task"]');
        currentValue = field.value;
        field.value = '';

        //create obj
        currentObj = {
          data: currentValue,
          id: i, //catch submit increment
          currentKey: true,
          performedKey: false,

          destroy: function() {
            console.log('delete this node');
          }
        };
      };

      this.saveData = function() {
        currentTasks.push(currentObj);

        tasksArray = 'tasksArray';
        sessionStorage.setItem(tasksArray, JSON.stringify(currentTasks));
        getStorage = JSON.parse(sessionStorage.getItem(tasksArray));
      };


      //add eventListener to current block
      this.currentTaskAction = function() {
        actionCurrent = document.createElement('div');
        actionCurrent.className = 'actions__item actions__item_current';
        actionCurrent.innerHTML = 'To current';

        actionCurrent.addEventListener('click', function(e) {
          currentParent = this.parentElement.parentElement;
          currentParent.setAttribute('currentKey' , true);
          currentParent.setAttribute('performedKey' , false);

          renderDOM(currentParent, 1);
        });
      }

      this.performedTaskAction = function() {
        actionPerformed = document.createElement('div');
        actionPerformed.className = 'actions__item actions__item_performed';
        actionPerformed.innerHTML = 'To performed';

        actionPerformed.addEventListener('click', function(e) {
          performedParent = this.parentElement.parentElement;
          performedParent.setAttribute('currentKey' , false);
          performedParent.setAttribute('performedKey' , true);

          renderDOM(performedParent, 2);
        });
      }

      this.deleteTaskAction = function() {
        actionDelete = document.createElement('div');
        actionDelete.className = 'actions__item actions__item_delete';
        actionDelete.innerHTML = 'Delete';
        actionDelete.addEventListener('click', function(e) {
          var parent = this.parentElement.parentElement;
          parent.remove();

          var parentId = parent.getAttribute('id');
          var localValue = sessionStorage.getItem(parentId);
          sessionStorage.removeItem(localValue);
        });
      }




      this.createCurrentBlock = function() {
        currentBlock = document.createElement('div');
        currentBlock.className = 'actions';
      }

      this.createTaskWrapper = function() {
        taskWrapper = document.createElement('div');
        taskWrapper.className = 'wrapper';
      }

      this.appendCreatedData = function() {
        currentBlock.append(actionCurrent, actionPerformed, actionDelete);
        taskWrapper.append(currentBlock);

        
        getStorage.forEach(function(item, i ,array) {
          taskWrapper.setAttribute('id' , item.id);
          taskWrapper.setAttribute('currentKey' , item.currentKey);
          taskWrapper.setAttribute('performedKey' , item.performedKey);

          taskWrapper.innerHTML = item.data;
          taskWrapper.append(currentBlock);

          console.log(item.currentKey);
          currentsWrapper.append(taskWrapper);
        });

      }

      function renderDOM(parent, num) {
          var parent = parent;
          var num = num;

          var attr = parent.getAttribute('currentKey');
          console.log(num);
          console.log(attr);

          if(num == 1) {
            console.log('attr currentKey is true: ' + attr);
            currentsWrapper.append(parent);
          } 
          else {
            console.log('attr currentKey is true: ' + attr);
            performedsWrapper.append(parent);
          }

      };
    }
} 


//example of plugin init
var newForm = new Form({
  id: 'task-form',
});


