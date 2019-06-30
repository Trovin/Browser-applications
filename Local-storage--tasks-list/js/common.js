/* ---------------------------- View ----------------------------- */
var View = function() {
	var _this = this;
	var dashboard = document.getElementById('dashboard');

	var createTaskTemplate = function(task) {
    	var item = document.createElement('div');
    	item.className = 'task-item ' + 'task-item_' + task.status;	
    	item.setAttribute('id', task.id);
    	item.setAttribute('status', task.status);
    	item.innerHTML = '<div class="task-title">' + task.title + '</div>' +
    						  '<div class="task-description">' + task.description + '</div>' +
    						  '<div class="task-data">' + task.date + '</div>' +
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
var Task = function(title, description, date, id, status) {
	this.title = title;
	this.description = description;
	this.date = date;
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
		if(this.storage.length > 0) {
			var id = JSON.parse(localStorage.getItem('id'));
		} else {
			localStorage.setItem('id', 0);
			var id = JSON.parse(localStorage.getItem('id'));
		}
		this.id = id;
	}

	this.loadView = function() {
		this.view.render(this.storage);
	}

	function getDate() {
		var today  = new Date();
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var date = today.getFullYear() + ', ' + monthNames[today.getMonth()] + ', ' + today.getDate();
		return date;
	};

	this.createNewTask = function(taskData) {
		this.id++; //increment id key
		localStorage.setItem('id', JSON.stringify(this.id));

		var newTask = new Task(taskData.title, taskData.description, taskData.date = getDate(), taskData.id = this.id, taskData.status = 'active');
		this.storage.push(newTask);
     	localStorage.setItem('list', JSON.stringify(this.storage));

		_this.view.renderItem(newTask);
	}

	this.removeCurrentTask = function(el) {
		var id = el.parentElement.getAttribute('id'); 
		console.log(id);
		_this.storage.forEach(function(item, index) {
    		if(item.id == id ) {
    			_this.storage.splice(index, 1);
    		}
    	});
		localStorage.setItem('list', JSON.stringify(_this.storage));
		el.parentElement.remove(); //remove from DOM
	}

	this.completeCurrentTask = function(el) {
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
		this.storage = [];
     	localStorage.clear();

		_this.view.removeItems();
	}
}    



/* ---------------------------- Controller ----------------------------- */
var Controller = function(Model) {
	var _this = this;
	this.model = Model;

    this.model.setStorage();
    this.model.setId();
    this.model.loadView();

    this.handleSubmit = function(event) {
    	event.preventDefault();
    	var taskData = {
    		title: event.target.querySelector('[name="task-title"]').value,
    		description: event.target.querySelector('[name="task-description"]').value
    	}
    	_this.model.createNewTask(taskData);
    };

    this.handleSelect = function(event) {
    	event.preventDefault();
    	var selectValue = event.target.value;

    	if(selectValue === 'remove') {
    		console.log('Remove task');
    		_this.model.removeCurrentTask(event.target);	
    	} 
    	if(selectValue === 'completed') {
    		console.log('Completed task');
    		_this.model.completeCurrentTask(event.target);	
    	} else {
    		console.log('Activated task');
    		_this.model.activateCurrentTask(event.target);	
    	}
    };


    this.handleClick = function(event) {
    	_this.model.removeAll();
    };
 };


/* ---------------------------- init app ----------------------------- */
var app = {
	controller: new Controller(new Model(new View())),
	init: function() {
		this.main(),
		this.event.selectStatus();
		this.event.addNew();
		this.event.removeAll();
	},
	main: function() {
		//add libs
	},
	event: {
		selectStatus: function() {
			var taskAction = document.getElementsByClassName('select-action');
			Object.values(taskAction).forEach(function(item) {
			    item.onchange = function(event) {
					app.controller.handleSelect(event);
				}
			});
		},
		addNew: function() {
			var form = document.getElementById('task');
			form.onsubmit = function(event) {
				app.controller.handleSubmit(event);
				app.event.selectStatus();
			};
		},
		removeAll: function() {
			var form = document.getElementById('remove-all');
			form.onclick = function() {
				app.controller.handleClick(event);
			};
		}
	}

}
app.init();

