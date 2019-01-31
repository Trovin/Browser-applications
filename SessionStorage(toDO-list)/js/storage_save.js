function Form(form) {
    //on init
    function init() {
      settingForm();
    };
    init();


    //init variables
    var currentForm, field, currentValue, currentObj, currentTasks, performedTasks;
    var i = 0; //init increment


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
      viewService.createCurrentTaskBlock();
      viewService.newTaskAction();
      viewService.performedTaskAction();
      viewService.deleteTaskAction();
      viewService.appendCreatedData();
    };


    function ViewService() {
      currentTasks = document.getElementById('current-tasks');
      performedTasks = document.getElementById('performed-tasks');

      this.createData = function() {
        field = currentForm.querySelector('textarea[name="task"]');
        currentValue = currentForm.querySelector('textarea[name="task"]').value;
        field.value = '';

        //create obj
        currentObj = {
          data: currentValue,
          key: i //catch submit increment
        };
      };

      this.saveData = function() {
        var currentKey = currentObj.key;
        var savedObj = JSON.stringify(currentObj);
        sessionStorage.setItem(currentKey, savedObj);
      };

      this.createTaskWrapper = function() {
        taskWrapper = document.createElement('div');
        taskWrapper.className = 'task-wrapp';
        taskWrapper.setAttribute('key' , currentObj.key);
        taskWrapper.innerHTML = currentValue;
      }

      this.createCurrentTaskBlock = function() {
        currentTaskBlock = document.createElement('div');
        currentTaskBlock.className = 'task-actions';
        currentTaskBlock.setAttribute('key' , currentObj.key);
      }

      //add eventListener to current block
      this.newTaskAction = function() {
        actionNew = document.createElement('div');
        actionNew.className = 'actions__item actions__item_to-new';
        actionNew.setAttribute('newKey' , currentObj.key);
        actionNew.innerHTML = 'Remove to new';
        actionNew.addEventListener('click', function(e) {
          var parent = this.parentElement.parentElement;
          currentTasks.append(parent);
        });
      }

      this.performedTaskAction = function() {
        actionPerformed = document.createElement('div');
        actionPerformed.className = 'actions__item actions__item_to-performed';
        actionPerformed.setAttribute('performedKey' , currentObj.key);
        actionPerformed.innerHTML = 'Remove to performed';
        actionPerformed.addEventListener('click', function(e) {
          var parent = this.parentElement.parentElement;
          performedTasks.append(parent);
        });
      }

      this.deleteTaskAction = function() {
        actionDelete = document.createElement('div');
        actionDelete.className = 'actions__item actions__item_delete';
        actionDelete.setAttribute('deleteKey' , currentObj.key);
        actionDelete.innerHTML = 'Delete';
        actionDelete.addEventListener('click', function(e) {
          var parent = this.parentElement.parentElement;
          parent.remove();

          var parentKey = parent.getAttribute('key');

          var localValue = JSON.parse(sessionStorage.getItem(parentKey));
          sessionStorage.removeItem(localValue);
        });
      }

      this.appendCreatedData = function() {
        currentTaskBlock.append(actionNew, actionPerformed, actionDelete);
        taskWrapper.append(currentTaskBlock);
        currentTasks.append(taskWrapper);
      }

    }
} 


//example of plugin init
var newForm = new Form({
  id: 'task-form',
});


