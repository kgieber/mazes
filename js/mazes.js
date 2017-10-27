// parameters
var rows = 12,
	cols =  16,
	type = 'lg',
	maze_state = 'build',
	pos_col= 0,
	pos_row = 0;
	
// $("#grlarge").prop("checked", true);
// $("#grsmall").prop("checked", false);
rebuildGrid();

// listeners for radio button control to switch the grid size
$('#grlarge').change(function() {
	rows = 12,
	cols =  16,
	type = 'lg';
	rebuildGrid();		
});	
$('#grsmall').change(function() {
	rows = 24,
	cols =  32,
	type = 'sm';
	rebuildGrid();		
});	

// listener for keypresses
$(document).keydown(function(ev) {
	// check for the different directions
	switch(ev.which) {
	case 37:
		// left
		ev.preventDefault();
		--pos_col;
		if(pos_col < 1) {
			pos_col = 1;
		}
		// make sure rows is also ready
		if(pos_row < 1) {
			pos_row = 1;
		}
		// don't move if at start point
		if((pos_row === rows) && (pos_col === 1)) {
			pos_col = 2;
		}
		$('#r'+pos_row.toString()+'c'+pos_col.toString()).focus();
		break;
	case 38:
		// top
		ev.preventDefault();
		--pos_row;
		if(pos_row < 1) {
			pos_row = 1;
		}
		// make sure cols is also ready
		if(pos_col < 1) {
			pos_col = 1;
		}
		// don't move if at end point
		if((pos_row === 1) && (pos_col === cols)) {
			pos_row = 2;
		}
		$('#r'+pos_row.toString()+'c'+pos_col.toString()).focus();
		break;
	case 39:
		// right
		ev.preventDefault();
		++pos_col;
		if(pos_col > cols) {
			pos_col = cols;
		}
		// make sure rows is also ready
		if(pos_row < 1) {
			pos_row = 1;
		}
		// don't move if at end point
		if((pos_row === 1) && (pos_col === cols)) {
			pos_col = cols - 1;
		}
		$('#r'+pos_row.toString()+'c'+pos_col.toString()).focus();
		break;
	case 40:
		ev.preventDefault();
		// down
		++pos_row;
		if(pos_row > rows) {
			pos_row = rows;
		}
		// make sure cols is also ready
		if(pos_col < 1) {
			pos_col = 1;
		}
		// don't move if at start point
		if((pos_row === rows) && (pos_cols === 1)) {
			pos_row = rows - 1;
		}
		$('#r'+pos_row.toString()+'c'+pos_col.toString()).focus();
		break;
	default:
		// do nothing
		break;	
	}
});

// used in the building mode when the buttons are selected
function swapBlocks(block) {
	if(block.hasClass('green-lego')) {
		block.removeClass('green-lego');
		block.attr('aria-label', (block.attr('name') + 'empty'));
	}
	else {
		block.addClass('green-lego');
		block.attr('aria-label', (block.attr('name') + 'lego'));
	}		
};

// used to build the grid
function rebuildGrid() {
	var	i = 0,
		j = 0;
	$('#maze-board').html('');
	for(; i < rows; ++i) {
		var newdiv = '<div>';
		j = 0;
		for(; j < cols; ++j) {
			var btn_name = 'row '+(i+1)+' column '+(j+1) + ' ',
				newbtn = '';
			// check for exit point
			if((i === 0) && (j === (cols - 1))) {
				newbtn = '<button class="game-block-'+type+' end-btn" id="'+('r'+(i+1)+'c'+(j+1))+'" aria-label="' + btn_name + 'end point" name="' + btn_name + '"/>';
			}
			// check for entrance point
			else if((j === 0) && (i === (rows - 1))) {
				newbtn = '<button class="game-block-'+type+' start-btn" id="'+('r'+(i+1)+'c'+(j+1))+'" aria-label="' + btn_name + 'start point" name="' + btn_name + '"/>';			
			}
			else {
				newbtn = '<button class="game-block-'+type+'" id="'+('r'+(i+1)+'c'+(j+1))+'" aria-label="' + btn_name + 'empty" name="' + btn_name + '"/>';
			}
			newdiv += newbtn;
		}
		newdiv += '</div>';
		$('#maze-board').append(newdiv);
	}
	
	// disable end and start buttons
	$('.end-btn').prop("disabled", true);
	$('.start-btn').prop("disabled", true);
	
	// listeners for grid blocks
	$('.game-block-'+type).click(function(ev) {
		var id_str = $(this).attr('id'),
			cl_ptr = id_str.indexOf('c');
		pos_row = parseInt(id_str.substring(1, cl_ptr), 10);
		pos_col = parseInt(id_str.substr(cl_ptr + 1, 10));
		swapBlocks($(this));
	});
	$('.game-block-'+type).focus(function(ev) {
		var id_str = $(this).attr('id'),
			cl_ptr = id_str.indexOf('c');
		pos_row = parseInt(id_str.substring(1, cl_ptr), 10);
		pos_col = parseInt(id_str.substr(cl_ptr + 1, 10));
	});
}


