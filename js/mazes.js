// parameters
var rows = 12,
	cols =  16,
	type = 'lg',
	maze_state = 'build',
	pos_col= 0,
	pos_row = 0,
	ball_col = 0,
	ball_row = 0;
	
rebuildGrid();

$('#hdr-play').removeClass('hidden');
$('#hdr-play').hide();
$('#bt-build').prop("disabled", true);

// listeners for radio button control to switch the grid size
/*
// $("#grlarge").prop("checked", true);
// $("#grsmall").prop("checked", false);
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
*/

// listeners for nav buttons
$('#bt-play').click(function() {
	var start_id = '#r' + rows.toString() + 'c1';
	$('#bt-play').prop("disabled", true);
	$('#bt-build').prop("disabled", false);
	$('#hdr-play').show();
	$('#hdr-build').hide();
	// set start points
	$(start_id).removeClass('start-btn');
	$(start_id).addClass('has-ball');
	$(start_id).attr('aria-label', ($(start_id).attr('name') + 'ball'));
	maze_state = 'play';
	ball_col = 1;
	ball_row = rows;
});
$('#bt-build').click(function() {
	$('#bt-play').prop("disabled", false);
	$('#bt-build').prop("disabled", true);
	$('#hdr-play').hide();
	$('#hdr-build').show();
	maze_state = 'build';
	clearBall();
	$('#r' + rows.toString() + 'c1').addClass('start-btn');
	$('#r' + rows.toString() + 'c1').attr('aria-label', ($('#r' + rows.toString() + 'c1').attr('name') + 'start point'));
});

// listener for keypresses
$(document).keydown(function(ev) {
	// check for the different directions
	switch(ev.which) {
	case 37:
		// left
		ev.preventDefault();
		if(maze_state === 'build') {
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
		}
		else {
			attemptMove(ball_col - 1, ball_row);
		}
		break;
	case 38:
		// top
		ev.preventDefault();
		if(maze_state === 'build') {
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
		}
		else {
			attemptMove(ball_col, ball_row - 1);
		}
		break;
	case 39:
		// right
		ev.preventDefault();
		if(maze_state === 'build') {
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
		}
		else {
			attemptMove(ball_col + 1, ball_row);
		}
		break;
	case 40:
		// down
		ev.preventDefault();
		if(maze_state === 'build') {
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
		}
		else {
			attemptMove(ball_col, ball_row + 1);		
		}
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
	var	i = 1,
		j = 1;
	$('#maze-board').html('');
	for(; i <= rows; ++i) {
		var newdiv = '<div>';
		j = 1;
		for(; j <= cols; ++j) {
			var btn_name = 'row ' + i.toString() + ' column ' + j.toString() + ' ',
				btn_id = 'r' + i.toString() + 'c' + j.toString(),
				newbtn = '';
			// check for exit point
			if((i === 1) && (j === cols)) {
				newbtn = '<button class="game-block-'+type+' end-btn" id="' + btn_id + '" aria-label="' + btn_name + 'end point" name="' + btn_name + '"/>';
			}
			// check for entrance point
			else if((j === 1) && (i === rows)) {
				newbtn = '<button class="game-block-'+type+' start-btn" id="' + btn_id + '" aria-label="' + btn_name + 'start point" name="' + btn_name + '"/>';			
			}
			else {
				newbtn = '<button class="game-block-'+type+'" id="' + btn_id + '" aria-label="' + btn_name + 'empty" name="' + btn_name + '"/>';
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
		if(maze_state === 'build') {
			var id_str = $(this).attr('id'),
				cl_ptr = id_str.indexOf('c');
			pos_row = parseInt(id_str.substring(1, cl_ptr), 10);
			pos_col = parseInt(id_str.substr(cl_ptr + 1, 10));
			swapBlocks($(this));
		}
		else {
		
		}
	});
	$('.game-block-'+type).focus(function(ev) {
		if(maze_state === 'build') {
			var id_str = $(this).attr('id'),
				cl_ptr = id_str.indexOf('c');
			pos_row = parseInt(id_str.substring(1, cl_ptr), 10);
			pos_col = parseInt(id_str.substr(cl_ptr + 1, 10));
		}
		else {
		
		}
	});
}

// used to clear the ball from the blocks when returning to build mode
function clearBall() {
	var	i = 1,
		j = 1;
	for(; i <= rows; ++i) {
		var newdiv = '<div>';
		j = 1;
		for(; j <= cols; ++j) {
			var block_id = '#r' + i.toString() + 'c' + j.toString();
			if($(block_id).hasClass('has-ball')) {
				$(block_id).removeClass('has-ball');
				$(block_id).attr('aria-label', ($(block_id).attr('name') + 'empty'));
			}
		}
	}
}

// used to check if this is a spot that can have the ball
function attemptMove(clsp, rwsp) {
console.log('row['+rwsp+'] col['+clsp+']');
	var no_move = false,
		chk_id = '#r' + rwsp.toString() + 'c' + clsp.toString();
	if(rwsp < 1 || clsp < 1 || rwsp > rows || clsp > cols) {
		no_move = true;
	}
	if($(chk_id).hasClass('green-lego')) {
		no_move = true;
	}
	if(!no_move) {
		clearBall();
		$(chk_id).addClass('has-ball');
		$(chk_id).attr('aria-label', ($(chk_id).attr('name') + 'ball'));
		ball_row = rwsp;
		ball_col = clsp;
	}
	
}




