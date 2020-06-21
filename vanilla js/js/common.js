/* ---------------------------- View ----------------------------- */
var View = function() {
	var _this = this;
	var dashboard = document.getElementById('dashboard');

	var createTaskTemplate = function(task) {
    	var item = document.createElement('div');
    	item.className = 'task-item ' + 'task-item_' + task.status;	
    	item.setAttribute('id', task.id);
    	item.setAttribute('status', task.status);
    	item.setAttribute('date', task.date);
    	item.innerHTML =    '<div class="task-title">' + task.title + '</div>' +
    						    '<div class="task-description">' + task.description + '</div>' +
    						    '<div class="task-date">' + task.userDate + '</div>' +
    						    '<select class="select-action">' + 
    						  	    '<option class="default-value" disabled="disabled" selected>' + task.status + '</option>' +
    						  	    '<option>active</option>' +
    						  	    '<option>completed</option>' +
    						  	    '<option>remove</option>' +
    						    '</select>';
    	dashboard.append(item);
	};

    this.render = function(tasks) {
    	tasks.forEach(function(task) {
    		createTaskTemplate(task)
    	});
    };

    this.renderItem = function(task) {
    	createTaskTemplate(task);
    }

    this.removeItems = function(task) {
    	var elements = document.getElementsByClassName('task-item');
		Object.values(elements).forEach(function(item) {
			item.remove();
		});
    }
};


/* ---------------------------- Task ----------------------------- */
var Task = function(title, description, date, userDate, id, status) {
	this.title = title;
	this.description = description;
	this.date = date;
	this.userDate = userDate;
	this.id = id;
	this.status = status;
}


/* ---------------------------- Modal ----------------------------- */
var Model = function(View) {
	var _this = this;
	this.view = View;
	this.storage = [];
	this.id = 0;

	this.setStorage = function() {
		var existingStorage = JSON.parse(localStorage.getItem('list'));
		if(existingStorage) {
			_this.storage = existingStorage;
		} 
	}

	this.setId = function() {
		if(_this.storage.length > 0) {
			_this.id = JSON.parse(localStorage.getItem('id'));
		} else {
			localStorage.setItem('id', 0);
			_this.id = JSON.parse(localStorage.getItem('id'));
		}
	}

	this.loadView = function() {
		_this.view.render(_this.storage);
	}

	function getDate() {
		var today = new Date();
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var date = today.getFullYear() + ', ' + monthNames[today.getMonth()] + ', ' + today.getDate();
		return date;
	};

	this.createNewTask = function(taskData) {
		_this.id++; //increment id key
		localStorage.setItem('id', JSON.stringify(_this.id));

		var newTask = new Task(taskData.title, taskData.description, taskData.date = new Date().getTime(), taskData.userDate = getDate(), taskData.id = _this.id, taskData.status = 'active');
		_this.storage.push(newTask);
     	localStorage.setItem('list', JSON.stringify(_this.storage));

		_this.view.renderItem(newTask);
	}

	this.removeCurrentTask = function(el) {
		console.log('status change');
		var id = el.parentElement.getAttribute('id'); 
		_this.storage.forEach(function(item, index) {
    		if(item.id == id ) {
    			_this.storage.splice(index, 1);
    		}
    	});
		localStorage.setItem('list', JSON.stringify(this.storage));
		el.parentElement.remove(); //remove from DOM
	}

	this.completeCurrentTask = function(el) {
		console.log('status change');
		var id = el.parentElement.getAttribute('id'); 
		_this.storage.forEach(function(item, index) {
    		if(item.id == id ) {
    			item.status = 'completed';
    			_this.storage[index, item];
    		}
    	});
    	localStorage.setItem('list', JSON.stringify(_this.storage));
    	el.parentElement.classList.remove('task-item_active');
		el.parentElement.classList.add('task-item_completed'); //change class
	}

	this.activateCurrentTask = function(el) {
		console.log('status change');
		var id = el.parentElement.getAttribute('id'); 
		_this.storage.forEach(function(item, index) {
    		if(item.id == id ) {
    			item.status = 'active';
    			_this.storage[index, item];
    		}
    	});
    	localStorage.setItem('list', JSON.stringify(_this.storage));
    	el.parentElement.classList.remove('task-item_completed');
		el.parentElement.classList.add('task-item_active'); //change class
	}

	this.removeAll = function(taskData) {
		localStorage.setItem('id', 0);
		_this.storage = [];
     	localStorage.clear();

		_this.view.removeItems();
	}

	this.sortingTasks = function() {
		_this.storage.sort(function(a, b) {
		  return b.date - a.date;
		});

		localStorage.setItem('list', JSON.stringify(_this.storage));

		_this.view.removeItems();
		_this.view.render(_this.storage);
	}
}    


/* ---------------------------- Event ----------------------------- */
var Event = function(element, event, handler) {
	element.addEventListener(event, handler, false);
} 


/* ---------------------------- Controller ----------------------------- */
var Controller = function(Model) {
	var _this = this;
	this.form = document.getElementById('task');
	this.removeBtn = document.getElementById('remove-all');
	this.filterBtn = document.getElementById('filter-all');

	this.model = Model;
    this.model.setStorage();
    this.model.setId();
    this.model.loadView();

    this.handleEvents = function() {
    	new Event(_this.form, 'submit', addNew);
    	new Event(_this.removeBtn, 'click', removeAll);
    	new Event(_this.filterBtn, 'click', filterByDate);
    	selectHandler();
    }

    function addNew(evt) {
    	evt.preventDefault();
    	var title = evt.target.querySelector('[name="task-title"]'),
    		description = evt.target.querySelector('[name="task-description"]');

    	var taskData = {
    		title: title.value,
    		description: description.value
    	}

    	evt.target.reset(); //reset form
    	_this.model.createNewTask(taskData);
    	selectHandler();
    };

    function removeAll() {
    	_this.model.removeAll();
    };

    function filterByDate() {
    	_this.model.sortingTasks();
    	selectHandler();
    };


    function selectHandler() {
    	var select = document.getElementsByClassName('select-action');
    	Object.values(select).forEach(function(item) {
			new Event(item, 'change', selectStatus);
		});
    }

    function selectStatus(evt) {
    	evt.preventDefault();
    	if(evt.target.value === 'remove') {
    		_this.model.removeCurrentTask(evt.target);	
    	} 
    	if(evt.target.value === 'completed') {
    		_this.model.completeCurrentTask(evt.target);	
    	} else {
    		_this.model.activateCurrentTask(evt.target);	
    	}
    };
 };


/* ---------------------------- init app ----------------------------- */
var app = {
	controller: new Controller(new Model(new View())),
	init: function() {
		this.loader();
		this.controller.handleEvents();
	},
	loader: function() {
		//add libs
	}
}
app.init();