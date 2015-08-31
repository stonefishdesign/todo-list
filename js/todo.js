// JavaScript Document
var wrapper = $("#list-wrapper"),
	list = $("#list");
var listStatusCode = [
	"pending",
	"completed"
];
var buttonTags = {
	'delete':'<span class="delete"><i class="fa fa-trash"></i></span>',
	'edit':'<span class="edit"><i class="fa fa-pencil"></i></span>',
	'tocomplete':'<span class="tocomplete"><i class="fa fa-check-circle"></i></span>',
	'topending':'<span class="topending"><i class="fa fa-circle"></i></span>',
	'save':'<span class="save"><i class="fa fa-floppy-o"></i></span>'
};

var init = function(){
	listItem = JSON.parse(localStorage.getItem("listData"));
	displayList();
};
var displayList = function(){
	list.find("li").remove();
	if(listItem){
		for(i=0;i<listItem.length;i++){
			item = $('<li class="'+listStatusCode[listItem[i]["listStatus"]]+'" id="'+listItem[i]["id"]+'"><span class="content">'+listItem[i]["content"]+'</span></li>').appendTo(list);
			if(listItem[i]["listStatus"] == 0){
				$('<i class="fa fa-circle"></i>').prependTo(item);
				$('<div class="buttons">' + buttonTags.delete + buttonTags.edit + buttonTags.tocomplete + '</div>').appendTo(item);
			} else{
				$('<i class="fa fa-check-circle"></i>').prependTo(item);
				$('<div class="buttons">' + buttonTags.delete + buttonTags.edit + buttonTags.topending + '</div>').appendTo(item);
			}
		}
		$('<li><input type="text" placeholder="Please type to add your list item"><div class="buttons">' + buttonTags.save + '</div></li>').appendTo(list);
		$( "input" ).focus();
		if(listItem.length<8){
			for(i=listItem.length+1;i<8;i++){
				$('<li />').appendTo(list);
			}
		}
	}else{
		$('<li><input type="text" placeholder="Please type to add your first item"><div class="buttons">' + buttonTags.save + '</div></li>').appendTo(list);
		$( "input" ).focus();
		for(i=1;i<8;i++){
			$('<li />').appendTo(list);
		}
		listItem = [];
	}
};
var addItem = function(content,listStatus){
	item_id =  'todo_'+$.now();
	newItem = {
		id : item_id,
		content: content,
		listStatus: listStatus
	};
	listItem.push(newItem);
	localStorage.setItem('listData',JSON.stringify(listItem));
}
var deleteItem = function(id){
	for (i=0;i<listItem.length;i++) {
        if (listItem[i].id == id) {
			listItem.splice(i,1); 
			localStorage.setItem('listData',JSON.stringify(listItem));
			break;
        }
    }
}
var updateItem = function(id,content,listStatus){
	for (i=0;i<listItem.length;i++) {
        if (listItem[i].id == id) {
        	listItem[i].content = content || listItem[i].content;
        	if(listStatus == 0 || listStatus == 1){
        		listItem[i].listStatus = listStatus;
        	}
        	break; 
     	}
    }
    localStorage.setItem('listData',JSON.stringify(listItem));
}
$(document).ready(function(){
	init();
	$('.clear-all').click(function() {
		localStorage.removeItem('listData');
		init();
	});
	$('#list').on("keypress","input",function(event) {
	    if (event.which == 13) {
	        event.preventDefault();
			item = $(this).parents('li');
			id= item.attr('id');
	        content = $(this).val();
	        if(content!=""){
		        if(id==undefined){
		        	//add new item
			        addItem(content,0);
			        displayList();
		        }else{
		        	//edit current item
					updateItem(id,content);
					displayList();
		        }
	        }
	    }
	});
	$(list).hoverIntent(function(e) {
		    $(this).find('.buttons').fadeIn('fast');
		},
		function(e) {
		    $(this).find('.buttons').fadeOut('fast');
		},'li');
	$(list).on("click",".delete",function(event) {
		id = $(this).parents('li').attr('id');
	  	deleteItem(id);
	  	displayList();
	});
	$(list).on("click",".edit",function(event) {
		if(!$(this).hasClass('editing')){
			$(this).addClass('editing');
			item = $(this).parents('li').find('.content');
			content = item.html();
			item.empty();
			newInput = $('<input type="text" value="'+ content +'">').insertBefore(item);
			newInput.focus();
			$(buttonTags.save).prependTo($(this).parents('li').find('.buttons'));
		}
	});
	$(list).on("click",".tocomplete",function(event) {
		id = $(this).parents('li').attr('id');
	  	updateItem(id,'',1);
	  	displayList();
	});
	$(list).on("click",".topending",function(event) {
		id = $(this).parents('li').attr('id');
	  	updateItem(id,'',0);
	  	displayList();
	});
	$(list).on("click",".save",function(event) {
		item = $(this).parents('li');
		id= item.attr('id');
        content = item.find('input').val();
        if(content!=""){
	        if(id==undefined){
	        	//add new item
		        addItem(content,0);
		        displayList();
	        }else{
	        	//edit current item
				updateItem(id,content);
				displayList();
	        }
	    }
	});
});
